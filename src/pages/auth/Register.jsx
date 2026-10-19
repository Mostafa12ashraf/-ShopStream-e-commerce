import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  // Form states
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Status states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Form Validations
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)

    try {
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || 'User'
      const lastName = nameParts.slice(1).join(' ') || ''

      // DummyJSON simulation for adding a user
      await axios.post('https://dummyjson.com/users/add', {
        firstName,
        lastName,
        username: username.trim(),
        email: email.trim(),
        password,
      })

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message
      setError(serverMessage || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-3">
          <Link to="/" className="auth-brand">
            ShopStream
          </Link>
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join us to get exclusive deals and track your orders</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label className="auth-label">Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Emily Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label className="auth-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. emilys"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              autoComplete="username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label className="auth-label">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="new-password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label className="auth-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              autoComplete="new-password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="registerAgreeTerms">
            <Form.Check
              type="checkbox"
              label={
                <span className="small text-muted">
                  I agree to the <span className="text-primary" style={{ cursor: 'pointer' }}>Terms of Service</span> and{' '}
                  <span className="text-primary" style={{ cursor: 'pointer' }}>Privacy Policy</span>
                </span>
              }
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 auth-btn-primary"
            disabled={loading || Boolean(success)}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </Form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>

        <div className="text-center mt-3">
          <Link to="/" className="text-muted small text-decoration-none">
            &larr; Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
