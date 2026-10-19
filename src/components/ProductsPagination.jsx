function ProductsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  function getPageNumbers() {
    const pages = []

    // Show all pages when total is small
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Always show first page
    pages.push(1)

    // Ellipsis after 1 when current page is far enough
    if (currentPage > 3) {
      pages.push('...')
    }

    // Pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="products-pagination" aria-label="Products pagination">
      {/* Previous */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page numbers and ellipsis */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="page-ellipsis">
              …
            </span>
          )
        }

        return (
          <button
            key={page}
            type="button"
            className={`page-btn ${currentPage === page ? 'page-btn--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      {/* Next */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}

export default ProductsPagination
