function DashboardPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemLabel = 'items',
  ariaLabel = 'Dashboard pagination',
}) {
  if (!totalPages || totalPages < 1) {
    return null
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  const filteredPages = pageNumbers.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  const paginationNav = (
    <nav className="dashboard-pagination" aria-label={ariaLabel}>
      <button
        type="button"
        className="btn-dash-page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        &lsaquo;
      </button>

      {filteredPages.map((page, index) => {
        const prevPage = filteredPages[index - 1]
        const showEllipsis = prevPage && page - prevPage > 1

        return (
          <span key={page} className="d-inline-flex align-items-center">
            {showEllipsis && <span className="px-1 text-muted">...</span>}
            <button
              type="button"
              className={`btn-dash-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        className="btn-dash-page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        &rsaquo;
      </button>
    </nav>
  )

  // If total items and page size are provided, render standard table footer container
  if (totalItems !== undefined && pageSize !== undefined) {
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return (
      <div className="dashboard-table-footer">
        <p className="dashboard-showing-text">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </p>
        {paginationNav}
      </div>
    )
  }

  return paginationNav
}

export default DashboardPagination
