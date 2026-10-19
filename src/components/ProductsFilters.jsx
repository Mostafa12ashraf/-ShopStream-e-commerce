import { Form } from 'react-bootstrap'

function ProductsFilters({
  categoryGroups,
  brands,
  selectedCategory,
  selectedBrand,
  maxPrice,
  priceLimit,
  minimumRating,
  onCategoryChange,
  onBrandChange,
  onMaxPriceChange,
  onMinRatingChange,
  onClearFilters,
}) {
  const groups = categoryGroups ? Object.keys(categoryGroups) : []

  return (
    <aside className="products-filters">
      {/* CATEGORY */}
      <div className="filter-section">
        <p className="filter-heading">CATEGORY</p>
        {groups.map((group) => (
          <Form.Check
            key={group}
            type="checkbox"
            id={`category-${group}`}
            label={group}
            checked={selectedCategory === group}
            onChange={() =>
              onCategoryChange(selectedCategory === group ? '' : group)
            }
            className="filter-option"
          />
        ))}
      </div>

      {/* PRICE RANGE */}
      <div className="filter-section">
        <p className="filter-heading">PRICE RANGE</p>
        <Form.Range
          min={0}
          max={priceLimit}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          aria-label="Maximum price filter"
        />
        <div className="d-flex justify-content-between mt-1">
          <small className="text-muted">$0</small>
          <small className="text-muted">
            ${maxPrice >= priceLimit ? `${priceLimit.toLocaleString()}+` : maxPrice.toLocaleString()}
          </small>
        </div>
      </div>

      {/* RATING */}
      <div className="filter-section">
        <p className="filter-heading">RATING</p>
        <Form.Check
          type="radio"
          id="rating-all"
          name="rating-filter"
          label="All Ratings"
          checked={minimumRating === 0}
          onChange={() => onMinRatingChange(0)}
          className="filter-option"
        />
        {[4, 3, 2].map((r) => (
          <Form.Check
            key={r}
            type="radio"
            id={`rating-${r}`}
            name="rating-filter"
            label={
              <span>
                <span className="rating-stars-green">{'★'.repeat(r)}</span>
                <span className="rating-stars-muted">{'☆'.repeat(5 - r)}</span>
                {' & Up'}
              </span>
            }
            checked={minimumRating === r}
            onChange={() => onMinRatingChange(r)}
            className="filter-option"
          />
        ))}
      </div>

      {/* BRAND */}
      <div className="filter-section">
        <p className="filter-heading">BRAND</p>
        <Form.Select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          aria-label="Filter by brand"
          className="filter-select"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Form.Select>
      </div>

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
