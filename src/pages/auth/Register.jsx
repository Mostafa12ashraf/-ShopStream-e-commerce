import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  // Form states
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Status states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Form Validations
    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
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

      // DummyJSON mock registration endpoint
      await axios.post('https://dummyjson.com/users/add', {
        firstName,
        lastName,
        username: username.trim(),
        email: email.trim(),
        password,
      })

      setSuccess('Mock account submitted successfully. Continue to sign in with an existing DummyJSON account.')
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
    <div className="auth-page-container">
      <div className="auth-card-figma">
        {/* Header */}
        <h2 className="auth-header-title">Create Account</h2>
        <p className="auth-header-subtitle">
          Join ShopStream for a personalized shopping experience.
        </p>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="py-2">
            <span className="small">{error}</span>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="py-2">
            <span className="small">{success}</span>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Full Name */}
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label className="auth-field-label">Full Name</Form.Label>
            <div className="auth-input-group">
              <span className="auth-input-icon" aria-hidden="true">👤</span>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-control-with-icon"
                required
              />
            </div>
          </Form.Group>

          {/* Username & Email Row */}
          <Row className="g-2 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group controlId="registerUsername">
                <Form.Label className="auth-field-label">Username</Form.Label>
                <div className="auth-input-group">
                  <span className="auth-input-icon" aria-hidden="true">@</span>
                  <Form.Control
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-control-with-icon"
                    autoComplete="username"
                    required
                  />
                </div>
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group controlId="registerEmail">
                <Form.Label className="auth-field-label">Email Address</Form.Label>
                <div className="auth-input-group">
                  <span className="auth-input-icon" aria-hidden="true">✉</span>
                  <Form.Control
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-control-with-icon"
                    autoComplete="email"
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Password */}
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label className="auth-field-label">Password</Form.Label>
            <div className="auth-input-group">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-control-with-icon"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-pwd-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label className="auth-field-label">Confirm Password</Form.Label>
            <div className="auth-input-group">
              <span className="auth-input-icon" aria-hidden="true">🛡️</span>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-control-with-icon"
                autoComplete="new-password"
                required
              />
            </div>
          </Form.Group>

          {/* Terms checkbox */}
          <div className="mb-3">
            <Form.Check
              type="checkbox"
              id="register-terms"
              label={
                <span className="small text-secondary">
                  I agree to the Terms of Service and Privacy Policy (Demo terms).
                </span>
              }
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="btn-auth-submit"
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
              <>Sign Up &rarr;</>
            )}
          </Button>

          {/* Or register with */}
          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          {/* Social login buttons (unsupported demo-only) */}
          <div className="auth-social-row">
            <button
              type="button"
              className="btn-auth-social"
              disabled
              title="Google sign-up is not available in this demo"
            >
              <span>G</span> Google (Demo)
            </button>
            <button
              type="button"
              className="btn-auth-social"
              disabled
              title="Apple sign-up is not available in this demo"
            >
              <span></span> Apple (Demo)
            </button>
          </div>
        </Form>

        {/* Switch to Login */}
        <p className="auth-bottom-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
