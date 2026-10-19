import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap'
import ProductCard from '../../components/ProductCard'
import ProductsFilters from '../../components/ProductsFilters'
import ProductsPagination from '../../components/ProductsPagination'
import './Products.css'

const PRODUCTS_PER_PAGE = 12

function Products() {
  // ── Data state ──────────────────────────────────────────────
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // ── Filter / search state ────────────────────────────────────
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [minimumRating, setMinimumRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [priceLimit, setPriceLimit] = useState(1000)
  const [sortOption, setSortOption] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)

  // ── Fetch products ───────────────────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get('https://dummyjson.com/products?limit=0')
        let allProducts = response.data.products

        // limit=0 returns an empty array in some DummyJSON versions;
        // fall back by fetching the full collection using the reported total
        if (allProducts.length === 0 && response.data.total > 0) {
          const fullResponse = await axios.get(
            `https://dummyjson.com/products?limit=${response.data.total}`
          )
          allProducts = fullResponse.data.products
        }

        setProducts(allProducts)

        // Set the price slider ceiling from the highest product price
        const highest = Math.max(...allProducts.map((p) => p.price))
        const roundedLimit = Math.ceil(highest / 100) * 100
        setPriceLimit(roundedLimit)
        setMaxPrice(roundedLimit)
      } catch (err) {
        setError(err.message || 'Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [retryCount])

  // ── Derived: unique categories and brands from API data ──────
  const categories = [...new Set(products.map((p) => p.category))].sort()
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort()

  // ── Filtering ────────────────────────────────────────────────
  let filtered = products

  if (search.trim()) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    )
  }

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.category === selectedCategory)
  }

  if (selectedBrand) {
    filtered = filtered.filter((p) => p.brand === selectedBrand)
  }

  if (maxPrice < priceLimit) {
    filtered = filtered.filter((p) => p.price <= maxPrice)
  }

  if (minimumRating > 0) {
    filtered = filtered.filter((p) => p.rating >= minimumRating)
  }

  // ── Sorting (copy first to avoid mutating state) ─────────────
  const sorted = [...filtered]
  if (sortOption === 'price-asc') sorted.sort((a, b) => a.price - b.price)
  else if (sortOption === 'price-desc') sorted.sort((a, b) => b.price - a.price)
  else if (sortOption === 'rating-desc') sorted.sort((a, b) => b.rating - a.rating)
  else if (sortOption === 'name-asc') sorted.sort((a, b) => a.title.localeCompare(b.title))

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const rangeStart = (safePage - 1) * PRODUCTS_PER_PAGE
  const paginated = sorted.slice(rangeStart, rangeStart + PRODUCTS_PER_PAGE)

  const showingFrom = sorted.length > 0 ? rangeStart + 1 : 0
  const showingTo = Math.min(rangeStart + PRODUCTS_PER_PAGE, sorted.length)

  // ── Handlers ─────────────────────────────────────────────────
  // Wraps a setter so that any filter change also resets to page 1
  function handleFilterChange(setter) {
    return function (value) {
      setter(value)
      setCurrentPage(1)
    }
  }

  function handleClearFilters() {
    setSearch('')
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

  // ── Category display label ────────────────────────────────────
  const categoryLabel = selectedCategory
    ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
    : 'All Products'

  // ── Render ────────────────────────────────────────────────────
  return (
    <Container fluid="xl" className="products-page py-4">
      <Row className="g-4">

        {/* ── Sidebar Filters ── */}
        <Col xs={12} lg={3}>
          <ProductsFilters
            categories={categories}
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

        {/* ── Products Area ── */}
        <Col xs={12} lg={9}>
          {/* Header: title + results count + search + sort */}
          <div className="products-area-header mb-3">
            <div>
              <h5 className="mb-0">{categoryLabel}</h5>
              <small className="text-muted">
                Showing {showingFrom}–{showingTo} of {sorted.length} results
              </small>
            </div>

            <div className="products-area-controls">
              <Form.Control
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="products-search-input"
                aria-label="Search products"
              />

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
                  <option value="name-asc">Name: A to Z</option>
                </Form.Select>
              </div>
            </div>
          </div>

          {/* Empty results state */}
          {sorted.length === 0 && (
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
          {sorted.length > 0 && (
            <>
              <Row xs={1} sm={2} xl={3} className="g-4">
                {paginated.map((product) => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              <div className="mt-4 pb-2">
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
