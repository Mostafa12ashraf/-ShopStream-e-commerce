import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

function ProductDetails() {
  const { id } = useParams()

  return (
    <Container className="py-4">
      <h1>Product Details</h1>
      <p className="text-muted">
        Viewing product ID: <strong>{id}</strong>
      </p>
      <p className="text-muted">Placeholder – will be implemented in a later phase.</p>
    </Container>
  )
}

export default ProductDetails
