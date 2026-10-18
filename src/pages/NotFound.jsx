import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Container className="py-4 text-center">
      <h1>404 – Page Not Found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Button as={Link} to="/" variant="primary">
        Back to Home
      </Button>
    </Container>
  )
}

export default NotFound
