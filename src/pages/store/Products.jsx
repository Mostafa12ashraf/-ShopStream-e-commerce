import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap'
import ProductCard from '../../components/ProductCard'
import ProductsFilters from '../../components/ProductsFilters'
import ProductsPagination from '../../components/ProductsPagination'
import './Products.css'

const PRODUCTS_PER_PAGE = 12

// 4 Figma category groups mapped to real DummyJSON categories
const categoryGroups = {
  Electronics: [
    'smartphones',
    'laptops',
    'tablets',
    'mobile-accessories',
  ],
  Fashion: [
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-dresses',
    'womens-shoes',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'tops',
    'sunglasses',
  ],
  'Home & Living': [
    'furniture',
    'home-decoration',
    'kitchen-accessories',
    'groceries',
  ],
  Beauty: [
    'beauty',
    'fragrances',
    'skin-care',
  ],
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Data state ──────────────────────────────────────────────
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // ── Filter / search state ────────────────────────────────────
  const search = searchParams.get('search') || ''
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [minimumRating, setMinimumRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [priceLimit, setPriceLimit] = useState(1000)
  const [sortOption, setSortOption] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)

  // ── Fetch all products ───────────────────────────────────────
  useEffect(() => {
    async function getProducts() {
      setLoading(true)
      setError(null)

      try {
        // limit=0 returns the full collection (194 products) directly from DummyJSON
        const response = await axios.get('https://dummyjson.com/products?limit=0')
        const allProducts = response.data.products || []

        setProducts(allProducts)

        // Set the price slider ceiling dynamically from the highest product price
        if (allProducts.length > 0) {
          const highest = Math.max(...allProducts.map((p) => p.price))
          const roundedLimit = Math.ceil(highest / 100) * 100
          setPriceLimit(roundedLimit)
          setMaxPrice(roundedLimit)
        }
      } catch (err) {
        setError(err.message || 'Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [retryCount])

  // ── Derived: unique brands from API data ─────────────────────
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort()

  // ── Filtering pipeline ───────────────────────────────────────
  let filtered = products

  // 1. Search filter (title and description)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  // 2. Category group filter (matches against mapped subcategories)
  if (selectedCategory && categoryGroups[selectedCategory]) {
    const groupCategories = categoryGroups[selectedCategory]
    filtered = filtered.filter((p) => groupCategories.includes(p.category))
  }

  // 3. Brand filter
  if (selectedBrand) {
    filtered = filtered.filter((p) => p.brand === selectedBrand)
  }

  // 4. Maximum price filter
  if (maxPrice < priceLimit) {
    filtered = filtered.filter((p) => p.price <= maxPrice)
  }

  // 5. Minimum rating filter
  if (minimumRating > 0) {
    filtered = filtered.filter((p) => p.rating >= minimumRating)
  }

  // ── Sorting (copy first to avoid mutating state) ─────────────
  const sorted = [...filtered]
  if (sortOption === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortOption === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price)
  } else if (sortOption === 'rating-desc') {
    sorted.sort((a, b) => b.rating - a.rating)
  }

  // ── Pagination calculation ───────────────────────────────────
  const totalCount = sorted.length
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const startResult = totalCount === 0 ? 0 : (safePage - 1) * PRODUCTS_PER_PAGE + 1
  const endResult = Math.min(safePage * PRODUCTS_PER_PAGE, totalCount)
  const paginated = sorted.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  )

  // ── Handlers ─────────────────────────────────────────────────
  function handleFilterChange(setter) {
    return function (value) {
      setter(value)
      setCurrentPage(1)
    }
  }

  function handleClearFilters() {
    setSearchParams({})
    setSelectedCategory('')
    setSelectedBrand('')
    setMinimumRating(0)
    setMaxPrice(priceLimit)
    setSortOption('default')
    setCurrentPage(1)
  }

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="products-loading">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p className="mb-3">{error}</p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setRetryCount((c) => c + 1)}
          >
            Retry
          </button>
        </Alert>
      </Container>
    )
  }

  // ── Heading label ────────────────────────────────────────────
  const headingLabel = selectedCategory || 'All Products'

  return (
    <Container fluid="xl" className="products-page py-4">
      <Row className="g-4">
        {/* ── Sidebar Filters ── */}
        <Col xs={12} lg={3}>
          <ProductsFilters
            categoryGroups={categoryGroups}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            maxPrice={maxPrice}
            priceLimit={priceLimit}
            minimumRating={minimumRating}
            onCategoryChange={handleFilterChange(setSelectedCategory)}
            onBrandChange={handleFilterChange(setSelectedBrand)}
            onMaxPriceChange={handleFilterChange(setMaxPrice)}
            onMinRatingChange={handleFilterChange(setMinimumRating)}
            onClearFilters={handleClearFilters}
          />
        </Col>

        {/* ── Products Content Area ── */}
        <Col xs={12} lg={9}>
          {/* Header matching Figma: Category title, result summary, and sort */}
          <div className="products-area-header mb-4">
            <div>
              <h4 className="products-heading mb-1">{headingLabel}</h4>
              <p className="text-muted small mb-0">
                {totalCount === 0
                  ? 'Showing 0 results'
                  : `Showing ${startResult}-${endResult} of ${totalCount} results`}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted text-nowrap" style={{ fontSize: '0.875rem' }}>
                Sort by:
              </span>
              <Form.Select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value)
                  setCurrentPage(1)
                }}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="default">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
              </Form.Select>
            </div>
          </div>

          {/* Empty results state */}
          {totalCount === 0 && (
            <div className="products-empty">
              <p className="text-muted fs-5 mb-1">No products found.</p>
              <p className="text-muted small mb-3">
                Try adjusting your filters or search term.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Products grid */}
          {totalCount > 0 && (
            <>
              <Row xs={1} sm={2} xl={3} className="g-4">
                {paginated.map((product) => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className="mt-5 pb-2">
                <ProductsPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Products
