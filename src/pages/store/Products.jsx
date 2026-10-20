import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap'
import ProductCard from '../../components/ProductCard'
import ProductsFilters from '../../components/ProductsFilters'
import ProductsPagination from '../../components/ProductsPagination'
import './Products.css'

const limit = 12

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Single Source of Truth for Search and Category ──────────
  const search = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || ''

  // ── Data state ──────────────────────────────────────────────
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [total, setTotal] = useState(0)

  // ── Sorting and Pagination state ────────────────────────────
  const [sortOption, setSortOption] = useState('default')
  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // ── Reset pagination to page 1 whenever search or category changes ─
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setCurrentPage(1)
  }, [search, selectedCategory])

  // ── 1. Fetch Categories once on mount ────────────────────────
  useEffect(() => {
    let isMounted = true

    async function getCategories() {
      try {
        const response = await axios.get('https://dummyjson.com/products/categories')
        if (isMounted) {
          const raw = response.data || []
          const normalized = raw.map((cat) => {
            if (typeof cat === 'object' && cat !== null) {
              return {
                slug: cat.slug || '',
                name: cat.name || cat.slug || '',
              }
            }
            return {
              slug: String(cat),
              name: String(cat).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            }
          })
          setCategories(normalized)
        }
      } catch {
        if (isMounted) {
          setCategories([])
        }
      }
    }

    getCategories()

    return () => {
      isMounted = false
    }
  }, [])

  // ── 2. Fetch Products with limit & skip pagination ───────────
  useEffect(() => {
    let isMounted = true

    async function getProducts() {
      setLoading(true)
      setError(null)

      try {
        const skip = (currentPage - 1) * limit
        let endpoint = ''

        if (search.trim()) {
          endpoint = `https://dummyjson.com/products/search?q=${encodeURIComponent(
            search.trim()
          )}&limit=${limit}&skip=${skip}`
        } else if (selectedCategory) {
          endpoint = `https://dummyjson.com/products/category/${encodeURIComponent(
            selectedCategory
          )}?limit=${limit}&skip=${skip}`
        } else {
          endpoint = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
        }

        if (sortBy && order) {
          endpoint += `&sortBy=${encodeURIComponent(sortBy)}&order=${encodeURIComponent(order)}`
        }

        const response = await axios.get(endpoint)

        if (isMounted) {
          const responseTotal = response.data.total || 0
          setProducts(response.data.products || [])
          setTotal(responseTotal)
          if (responseTotal > 0 && (currentPage - 1) * limit >= responseTotal) {
            setCurrentPage(1)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products. Please try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getProducts()

    return () => {
      isMounted = false
    }
  }, [search, selectedCategory, sortBy, order, currentPage, retryCount])

  // ── Named Handlers ───────────────────────────────────────────
  function handleCategoryChange(slug) {
    setCurrentPage(1)
    if (selectedCategory === slug) {
      // Toggle off: remove category parameter
      setSearchParams({})
    } else {
      // Toggle on: set category and clear search parameter
      setSearchParams({ category: slug })
    }
  }

  function handleSortChange(value) {
    setSortOption(value)
    if (value === 'price-asc') {
      setSortBy('price')
      setOrder('asc')
    } else if (value === 'price-desc') {
      setSortBy('price')
      setOrder('desc')
    } else if (value === 'rating-desc') {
      setSortBy('rating')
      setOrder('desc')
    } else if (value === 'title-asc') {
      setSortBy('title')
      setOrder('asc')
    } else {
      setSortBy('')
      setOrder('')
    }
    setCurrentPage(1)
  }

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearFilters() {
    setSearchParams({})
    setSortOption('default')
    setSortBy('')
    setOrder('')
    setCurrentPage(1)
  }

  function handleRetry() {
    setRetryCount((prev) => prev + 1)
  }

  // ── Calculations for Result Counter and Pagination ──────────
  const totalPages = Math.ceil(total / limit)
  const startResult = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const endResult = Math.min((currentPage - 1) * limit + products.length, total)

  // ── Heading Label ───────────────────────────────────────────
  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory)
  const headingLabel = search.trim()
    ? `Search Results for "${search.trim()}"`
    : activeCategoryObj
    ? activeCategoryObj.name
    : 'All Products'

  return (
    <Container fluid="xl" className="products-page py-4">
      <Row className="g-4">
        {/* ── Sidebar Filters (Permanently mounted to prevent layout shift) ── */}
        <Col xs={12} lg={3}>
          <ProductsFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
          />
        </Col>

        {/* ── Products Content Area ── */}
        <Col xs={12} lg={9}>
          {/* Header: Category title, result summary, and sort */}
          <div className="products-area-header mb-4">
            <div>
              <h4 className="products-heading mb-1">{headingLabel}</h4>
              <p className="text-muted small mb-0">
                {loading
                  ? 'Loading products...'
                  : total === 0
                  ? 'Showing 0 results'
                  : `Showing ${startResult}-${endResult} of ${total} results`}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted text-nowrap" style={{ fontSize: '0.875rem' }}>
                Sort by:
              </span>
              <Form.Select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="title-asc">Title: A to Z</option>
              </Form.Select>
            </div>
          </div>

          {/* Loading state inside products area */}
          {loading && (
            <div className="products-loading">
              <Spinner animation="border" variant="primary" role="status" />
              <p className="mt-3 text-muted">Loading products...</p>
            </div>
          )}

          {/* Error state inside products area */}
          {!loading && error && (
            <Alert variant="danger" className="my-4">
              <Alert.Heading>Something went wrong</Alert.Heading>
              <p className="mb-3">{error}</p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRetry}
              >
                Retry
              </button>
            </Alert>
          )}

          {/* Empty results state */}
          {!loading && !error && total === 0 && (
            <div className="products-empty-enhanced text-center py-4">
              <div className="no-results-icon-box mb-3">
                <span className="no-results-icon" aria-hidden="true">🔍</span>
              </div>

              <h4 className="no-results-title mb-1">
                {search.trim()
                  ? `No results for "${search.trim()}"`
                  : 'No products found'}
              </h4>
              <p className="text-muted small mb-4">
                We couldn't find what you were looking for. Try adjusting your search or filters.
              </p>

              {/* Assistance Cards */}
              <Row className="g-3 justify-content-center text-start mb-4">
                <Col md={7}>
                  <div className="empty-help-card h-100">
                    <h6 className="fw-bold text-primary mb-2">Need a quick fix?</h6>
                    <ul className="empty-help-list mb-0">
                      <li>✓ Check your spelling for any typos.</li>
                      <li>✓ Try using more general keywords.</li>
                      <li>✓ Use the categories sidebar to broaden your search.</li>
                    </ul>
                  </div>
                </Col>

                <Col md={5}>
                  <div className="empty-chat-card h-100">
                    <h6 className="fw-bold text-success mb-1">Chat with us</h6>
                    <p className="text-muted small mb-3">
                      Our shopping assistants are online and ready to help you find the right item.
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-success btn-chat-support w-100"
                      disabled
                      title="Chat support is not available in this demo"
                    >
                      💬 Start Live Chat (Demo only)
                    </button>
                  </div>
                </Col>
              </Row>

              {/* Popular Categories */}
              {categories.length > 0 && (
                <div className="popular-categories-section mb-4">
                  <p className="text-muted small fw-bold mb-2">BROWSE POPULAR CATEGORIES</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {categories.slice(0, 6).map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        className="btn btn-sm btn-category-pill"
                        onClick={() => handleCategoryChange(cat.slug)}
                      >
                        {cat.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-category-pill"
                      onClick={handleClearFilters}
                    >
                      All Products
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary btn-clear-empty"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && total > 0 && (
            <>
              <Row xs={1} sm={2} xl={3} className="g-4">
                {products.map((product) => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className="mt-5 pb-2">
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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
