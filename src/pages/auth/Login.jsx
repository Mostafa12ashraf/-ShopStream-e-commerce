import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import './Auth.css'

function Login() {
  const navigate = useNavigate()

  // Form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

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
      setError('Please enter both your username and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: username.trim(),
        password: password,
        expiresInMins: rememberMe ? 1440 : 60,
      })

      const token = response.data.accessToken || response.data.token

      if (token) {
        // Save token and user details to localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(response.data))

        // Dispatch storage event so navbar and other listeners update instantly
        window.dispatchEvent(new Event('authChange'))

        // Navigate to profile or store
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
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-3">
          <Link to="/" className="auth-brand">
            ShopStream
          </Link>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Demo credentials hint box */}
        <div className="demo-credentials-box">
          <div className="d-flex justify-content-between align-items-center">
            <span className="demo-credentials-title">Demo Credentials</span>
            <button
              type="button"
              className="demo-btn-autofill"
              onClick={handleAutoFillDemo}
            >
              Autofill
            </button>
          </div>
          <div className="demo-credentials-text mt-1">
            Username: <code>emilys</code> | Password: <code>emilyspass</code>
          </div>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginUsername">
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

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check
              type="checkbox"
              id="remember-me"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="small text-muted"
            />
            <span className="small text-muted" style={{ cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            className="w-100 auth-btn-primary"
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up
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

export default Login
