import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import ProductCard from '../../components/ProductCard'
import heroImg from '../../assets/hero.png'
import './Home.css'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchFeatured() {
      try {
        setLoading(true)
        setError(null)

        // Fetch top 8 products from DummyJSON
        const response = await axios.get('https://dummyjson.com/products?limit=8')
        if (isMounted) {
          setFeaturedProducts(response.data.products || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load featured products.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchFeatured()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Container fluid="xl" className="home-page pb-5">
      {/* ── Hero Banner ── */}
      <section className="home-hero">
        <Row className="align-items-center g-4">
          <Col xs={12} lg={7}>
            <span className="home-hero-badge">NEW ARRIVALS 2026</span>
            <h1 className="home-hero-title">
              Discover Next-Gen Products with <span className="home-hero-title-highlight">ShopStream</span>
            </h1>
            <p className="home-hero-desc">
              Explore thousands of handpicked electronics, modern fashion, home decor,
              and beauty essentials with express delivery and guaranteed satisfaction.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button
                as={Link}
                to="/products"
                variant="primary"
                size="lg"
                className="px-4 py-2 fw-semibold"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
              >
                Shop All Products &rarr;
              </Button>
              <Button
                as={Link}
                to="/products"
                variant="outline-secondary"
                size="lg"
                className="px-4 py-2 fw-semibold"
              >
                Explore Categories
              </Button>
            </div>
          </Col>
          <Col xs={12} lg={5} className="home-hero-img-box">
            <img
              src={heroImg}
              alt="ShopStream Hero Illustration"
              className="home-hero-img img-fluid"
            />
          </Col>
        </Row>
      </section>

      {/* ── Value Proposition Cards ── */}
      <section className="home-features">
        <Row className="g-3">
          <Col xs={12} sm={6} lg={3}>
            <div className="home-feature-card">
              <div className="home-feature-icon">🚚</div>
              <div>
                <h6 className="home-feature-title">Free Shipping</h6>
                <p className="home-feature-sub">On orders over $50</p>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div className="home-feature-card">
              <div className="home-feature-icon">🔒</div>
              <div>
                <h6 className="home-feature-title">Secure Payments</h6>
                <p className="home-feature-sub">100% encrypted checkout</p>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div className="home-feature-card">
              <div className="home-feature-icon">⚡</div>
              <div>
                <h6 className="home-feature-title">Express Delivery</h6>
                <p className="home-feature-sub">Arrives in 2-3 business days</p>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div className="home-feature-card">
              <div className="home-feature-icon">🔄</div>
              <div>
                <h6 className="home-feature-title">30-Day Returns</h6>
                <p className="home-feature-sub">Hassle-free money back</p>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* ── Categories Showcase ── */}
      <section className="home-categories">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Shop by Category</h2>
            <p className="home-section-subtitle">Browse through our most popular curated departments</p>
          </div>
          <Link to="/products" className="text-primary fw-semibold text-decoration-none">
            All Categories &rarr;
          </Link>
        </div>

        <Row className="g-3">
          <Col xs={6} md={3}>
            <Link to="/products" className="home-category-card">
              <span className="home-category-icon">📱</span>
              <h5 className="home-category-name">Electronics</h5>
              <p className="home-category-desc">Phones, laptops & gadgets</p>
              <span className="home-category-cta">Browse 38+ Items &rarr;</span>
            </Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/products" className="home-category-card">
              <span className="home-category-icon">👗</span>
              <h5 className="home-category-name">Fashion</h5>
              <p className="home-category-desc">Trendy apparel & watches</p>
              <span className="home-category-cta">Browse 50+ Items &rarr;</span>
            </Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/products" className="home-category-card">
              <span className="home-category-icon">🏠</span>
              <h5 className="home-category-name">Home & Living</h5>
              <p className="home-category-desc">Decor, furniture & kitchen</p>
              <span className="home-category-cta">Browse 40+ Items &rarr;</span>
            </Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/products" className="home-category-card">
              <span className="home-category-icon">✨</span>
              <h5 className="home-category-name">Beauty</h5>
              <p className="home-category-desc">Skincare, cosmetics & fragrances</p>
              <span className="home-category-cta">Browse 20+ Items &rarr;</span>
            </Link>
          </Col>
        </Row>
      </section>

      {/* ── Featured Products Grid ── */}
      <section className="home-featured-section mb-5">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Featured Products</h2>
            <p className="home-section-subtitle">Handpicked deals and trending items for you</p>
          </div>
          <Link to="/products" className="text-primary fw-semibold text-decoration-none">
            View All ({featuredProducts.length ? '190+' : '...'}) &rarr;
          </Link>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading featured products...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <Alert.Heading>Error loading products</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {!loading && !error && (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* ── Promo CTA Banner ── */}
      <section className="home-promo-banner">
        <Row className="align-items-center">
          <Col md={8}>
            <h3 className="fw-bold mb-2">Join ShopStream Plus & Save 20%</h3>
            <p className="mb-0 text-white-50">
              Sign up today and get access to exclusive seasonal sales, early access to new releases,
              and member-only perks.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button
              as={Link}
              to="/register"
              variant="light"
              size="lg"
              className="fw-bold px-4 text-primary"
            >
              Sign Up Now &rarr;
            </Button>
          </Col>
        </Row>
      </section>
    </Container>
  )
}

export default Home
