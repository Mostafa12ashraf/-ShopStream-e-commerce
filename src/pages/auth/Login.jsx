import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContext'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  // Form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Status states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleAutoFillDemo() {
    setUsername('emilys')
    setPassword('emilyspass')
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!username.trim() || !password) {
      setError('Please enter both your email/username and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: username.trim(),
        password: password,
        expiresInMins: rememberMe ? 43200 : 60, // 30 days vs 1 hour
      })

      const token = response.data.accessToken || response.data.token

      if (token) {
        // Persist session strictly via AuthContext according to Remember Me setting
        login(response.data, rememberMe)
        navigate('/profile')
      } else {
        setError('Login failed: Token not received from server.')
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message
      setError(serverMessage || 'Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card-figma">
        {/* Header */}
        <h2 className="auth-header-title">Welcome Back</h2>
        <p className="auth-header-subtitle">Please enter your details to sign in.</p>

        {/* Demo Credentials Box */}
        <div className="demo-credentials-pill d-flex justify-content-between align-items-center">
          <div>
            <div className="small fw-bold text-primary">Demo User</div>
            <div className="small text-muted">
              <code>emilys</code> &bull; <code>emilyspass</code>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={handleAutoFillDemo}
          >
            Autofill
          </button>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="py-2">
            <span className="small">{error}</span>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Email or Username */}
          <Form.Group className="mb-3" controlId="loginUsername">
            <Form.Label className="auth-field-label">Email or Username</Form.Label>
            <div className="auth-input-group">
              <span className="auth-input-icon" aria-hidden="true">✉</span>
              <Form.Control
                type="text"
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-control-with-icon"
                autoComplete="username"
                required
              />
            </div>
          </Form.Group>

          {/* Password with Forgot? demo indicator */}
          <Form.Group className="mb-3" controlId="loginPassword">
            <div className="auth-field-label">
              <span>Password</span>
              <span className="auth-disabled-link" title="Password recovery is not available in this demo">
                Forgot? (Demo)
              </span>
            </div>
            <div className="auth-input-group">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-control-with-icon"
                autoComplete="current-password"
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

          {/* Stay signed in checkbox */}
          <div className="mb-3">
            <Form.Check
              type="checkbox"
              id="stay-signed-in"
              label={<span className="small text-secondary">Stay signed in for 30 days</span>}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="btn-auth-submit"
            disabled={loading}
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
                Signing In...
              </>
            ) : (
              <>Sign In &rarr;</>
            )}
          </Button>

          {/* Or continue with */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          {/* Social login buttons (unsupported demo-only) */}
          <div className="auth-social-row">
            <button
              type="button"
              className="btn-auth-social"
              disabled
              title="Google sign-in is not available in this demo"
            >
              <span>G</span> Google (Demo)
            </button>
            <button
              type="button"
              className="btn-auth-social"
              disabled
              title="Apple sign-in is not available in this demo"
            >
              <span></span> Apple (Demo)
            </button>
          </div>
        </Form>

        {/* Switch to Register */}
        <p className="auth-bottom-switch">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-switch-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
