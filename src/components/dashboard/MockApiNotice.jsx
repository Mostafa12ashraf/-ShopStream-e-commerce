function MockApiNotice({ children, text, className = '' }) {
  return (
    <div className={`dashboard-info-notice ${className}`.trim()}>
      <span aria-hidden="true">ℹ️</span>
      <div>{children || text}</div>
    </div>
  )
}

export default MockApiNotice
