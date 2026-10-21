import { useState } from 'react'
import { Form } from 'react-bootstrap'

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings', stars: '' },
  { value: 4, label: '4 & Up', stars: '★★★★☆' },
  { value: 3, label: '3 & Up', stars: '★★★☆☆' },
  { value: 2, label: '2 & Up', stars: '★★☆☆☆' },
  { value: 1, label: '1 & Up', stars: '★☆☆☆☆' },
]

function ProductsFilters({
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  maximumPrice = null,
  catalogMaxPrice = 1000,
  onPriceChange,
  minimumRating = 0,
  onRatingChange,
  selectedBrand = 'all',
  availableBrands = [],
  onBrandChange,
  onClearFilters,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Determine initially visible real categories (first 4)
  const initialCount = 4
  const initialCategories = categories.slice(0, initialCount)
  const isSelectedInInitial = initialCategories.some((c) => c.slug === selectedCategory)

  // If a category outside the initial 4 is active while collapsed, keep it visible so user understands selection
  let visibleCategories = categories
  if (!showAllCategories) {
    if (selectedCategory && !isSelectedInInitial) {
      const activeObj = categories.find((c) => c.slug === selectedCategory)
      visibleCategories = activeObj
        ? [...initialCategories, activeObj]
        : initialCategories
    } else {
      visibleCategories = initialCategories
    }
  }

  function handleCategoryClick(slug) {
    if (selectedCategory === slug) {
      onCategoryChange('')
    } else {
      onCategoryChange(slug)
    }
  }

  const activeMaxPrice = maximumPrice !== null ? maximumPrice : catalogMaxPrice

  return (
    <aside id="categories" className="products-filters">
      {/* ── 1. CATEGORY (Real API Categories) ── */}
      <div className="filter-section">
        <p className="filter-heading">CATEGORY</p>
        <div className="category-filter-list">
          {visibleCategories.map((cat) => (
            <Form.Check
              key={cat.slug}
              type="checkbox"
              id={`category-${cat.slug}`}
              label={cat.name}
              checked={selectedCategory === cat.slug}
              onChange={() => handleCategoryClick(cat.slug)}
              className="filter-option"
            />
          ))}
        </div>

        {/* Show More / Show Less Toggle */}
        {categories.length > initialCount && (
          <button
            type="button"
            className="btn btn-link btn-sm p-0 text-decoration-none mt-2 show-more-categories-btn"
            onClick={() => setShowAllCategories((prev) => !prev)}
            style={{ color: '#4338ca', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            {showAllCategories
              ? 'Show Less ↑'
              : `Show More (${categories.length - initialCount}) ↓`}
          </button>
        )}
      </div>

      {/* ── 2. PRICE RANGE ── */}
      <div className="filter-section">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <p className="filter-heading mb-0">PRICE RANGE</p>
          <span className="price-active-val">
            ${activeMaxPrice.toLocaleString()}
          </span>
        </div>
        <div className="price-range-wrapper">
          <input
            type="range"
            min="0"
            max={catalogMaxPrice}
            step="1"
            value={activeMaxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="form-range figma-price-slider"
            aria-label="Filter products by maximum price"
          />
          <div className="d-flex justify-content-between price-range-labels mt-1">
            <span className="price-label-text">$0</span>
            <span className="price-label-text">${catalogMaxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── 3. RATING ── */}
      <div className="filter-section">
        <p className="filter-heading mb-2">RATING</p>
        <div className="rating-filter-list d-flex flex-column gap-2">
          {RATING_OPTIONS.map((opt) => (
            <Form.Check
              key={opt.value}
              type="radio"
              id={`rating-filter-${opt.value}`}
              name="rating-filter"
              checked={minimumRating === opt.value}
              onChange={() => onRatingChange(opt.value)}
              className="filter-option"
              label={
                <span className="d-inline-flex align-items-center gap-2">
                  {opt.stars ? <span className="rating-stars-green">{opt.stars}</span> : null}
                  <span className="rating-filter-label">{opt.label}</span>
                </span>
              }
            />
          ))}
        </div>
      </div>

      {/* ── 4. BRAND ── */}
      <div className="filter-section">
        <p className="filter-heading mb-2">BRAND</p>
        <Form.Select
          className="brand-filter-select"
          aria-label="Filter by brand"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="all">All Brands ({availableBrands.length})</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* ── 5. CLEAR FILTERS ── */}
      <button
        type="button"
        className="btn btn-clear-filters w-100 mt-2"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </aside>
  )
}

export default ProductsFilters
