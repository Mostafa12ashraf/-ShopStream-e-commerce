import { Form } from 'react-bootstrap'

function ProductsFilters({
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  onClearFilters,
}) {
  return (
    <aside className="products-filters">
      {/* CATEGORY FILTER */}
      <div className="filter-section">
        <p className="filter-heading">CATEGORY</p>
        <div className="category-filter-list">
          {categories.map((cat) => (
            <Form.Check
              key={cat.slug}
              type="checkbox"
              id={`category-${cat.slug}`}
              label={cat.name}
              checked={selectedCategory === cat.slug}
              onChange={() => onCategoryChange(cat.slug)}
              className="filter-option"
            />
          ))}
        </div>
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
