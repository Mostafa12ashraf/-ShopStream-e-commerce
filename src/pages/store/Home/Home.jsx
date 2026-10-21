import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import ProductCard from '../../../components/store/ProductCard'

// Asset imports
import heroHeadphones from '../../../assets/hero_headphones.jpg'
import catComputing from '../../../assets/cat_computing.jpg'
import catWearables from '../../../assets/cat_wearables.jpg'
import catAudio from '../../../assets/cat_audio.jpg'
import catTheater from '../../../assets/cat_theater.jpg'

import './Home.css'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Fetch featured products from DummyJSON
  useEffect(() => {
    let isMounted = true

    async function fetchFeaturedProducts() {
      setLoading(true)
      setError(null)

      try {
        // Fetch curated tech & lifestyle products
        const response = await axios.get('https://dummyjson.com/products?limit=12')
        if (isMounted) {
          setProducts(response.data.products || [])
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

    fetchFeaturedProducts()

    return () => {
      isMounted = false
    }
  }, [])

  function handlePrevSlide() {
    setCarouselIndex((prev) => Math.max(prev - 4, 0))
  }

  function handleNextSlide() {
    setCarouselIndex((prev) => {
      if (prev + 4 < products.length) {
        return prev + 4
      }
      return 0
    })
  }

  function handleNewsletterSubmit(e) {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setSubscribed(true)
      setNewsletterEmail('')
    }
  }

  const visibleProducts = products.slice(carouselIndex, carouselIndex + 4)

  return (
    <Container fluid className="home-page">
      {/* ── 1. Hero Section ── */}
      <section className="home-hero-section">
        <Row className="align-items-center g-4">
          <Col xs={12} lg={6}>
            <span className="hero-pill-badge">NEW SEASON ARRIVAL</span>
            <h1 className="home-hero-heading">
              Experience the Future
              <br />
              of <span className="home-hero-highlight">Innovation.</span>
            </h1>
            <p className="home-hero-subtext">
              Explore our curated selection of premium electronics designed to
              elevate your daily stream of life. Precision engineering meets
              minimalist design.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/products" className="btn btn-hero-primary">
                Shop Electronics
              </Link>
              <a href="#top-categories" className="btn btn-hero-outline">
                View Collections
              </a>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div className="hero-image-frame">
              <img
                src={heroHeadphones}
                alt="Premium Wireless Headphones"
                className="hero-image-media"
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* ── 2. Top Categories (Bento Grid matching Figma) ── */}
      <section id="top-categories" className="mb-5">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Top Categories</h2>
            <p className="home-section-subtitle">
              Curated gear for every lifestyle.
            </p>
          </div>
          <Link to="/products" className="home-see-all-link">
            See All &rarr;
          </Link>
        </div>

        <Row className="g-3">
          {/* Left Large Column: Computing */}
          <Col xs={12} lg={6}>
            <Link
              to="/products?category=laptops"
              className="bento-card bento-card-computing"
            >
              <img
                src={catComputing}
                alt="Computing"
                className="bento-img"
              />
              <div className="bento-overlay">
                <h4 className="bento-title">Computing</h4>
                <p className="bento-subtitle">Work and play without limits.</p>
              </div>
            </Link>
          </Col>

          {/* Right Column: 2 half rows */}
          <Col xs={12} lg={6}>
            <Row className="g-3">
              <Col xs={12} sm={6}>
                <Link
                  to="/products?category=mens-watches"
                  className="bento-card bento-card-half"
                >
                  <img
                    src={catWearables}
                    alt="Wearables"
                    className="bento-img"
                  />
                  <div className="bento-overlay">
                    <h5 className="bento-title">Wearables</h5>
                  </div>
                </Link>
              </Col>

              <Col xs={12} sm={6}>
                <Link
                  to="/products?search=audio"
                  className="bento-card bento-card-half"
                >
                  <img
                    src={catAudio}
                    alt="Audio"
                    className="bento-img"
                  />
                  <div className="bento-overlay">
                    <h5 className="bento-title">Audio</h5>
                  </div>
                </Link>
              </Col>

              <Col xs={12}>
                <Link
                  to="/products?search=tv"
                  className="bento-card bento-card-full"
                >
                  <img
                    src={catTheater}
                    alt="Home Theater"
                    className="bento-img"
                  />
                  <div className="bento-overlay">
                    <h5 className="bento-title">Home Theater</h5>
                  </div>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>

      {/* ── 3. Featured Products Section matching Figma ── */}
      <section className="mb-5">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Featured Products</h2>
            <p className="home-section-subtitle">
              Explore our featured selection.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="carousel-nav-btn"
              onClick={handlePrevSlide}
              disabled={carouselIndex === 0}
              aria-label="Previous products"
            >
              &lt;
            </button>
            <button
              type="button"
              className="carousel-nav-btn"
              onClick={handleNextSlide}
              aria-label="Next products"
            >
              &gt;
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading featured products...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {!loading && !error && (
          <Row xs={1} sm={2} lg={4} className="g-4">
            {visibleProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} variant="home" />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* ── 4. Stay Ahead of the Stream Promo Banner ── */}
      <section className="promo-stream-banner">
        <Row className="align-items-center">
          <Col xs={12} lg={8} className="position-relative" style={{ zIndex: 2 }}>
            <h2 className="promo-stream-title">Stay Ahead of the Stream</h2>
            <p className="promo-stream-desc">
              Join our inner circle for exclusive early access to product
              launches, seasonal deals, and curated tech trends. No spam, just
              high-quality updates.
            </p>

            {subscribed ? (
              <div className="alert alert-success d-inline-block py-2 px-3 mb-0">
                ✓ Thanks! This is a demo subscription.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="promo-form-wrapper">
                <input
                  type="email"
                  className="promo-stream-input"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-promo-join">
                  Join Now
                </button>
              </form>
            )}
          </Col>
        </Row>
      </section>
    </Container>
  )
}

export default Home
