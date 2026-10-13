import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  TextInput,
  PasswordInput,
  Form,
  Stack,
  InlineNotification,
  Tile,
  Grid,
  Column,
  Theme,
  Header,
  HeaderName,
} from '@carbon/react'
import { Login as LoginIcon, UserAdmin } from '@carbon/icons-react'

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setIsSubmitting(true)

    // Check credentials: Username "Admin" and Password "password"
    if (username === 'Admin' && password === 'password') {
      const user = { username: 'Admin', role: 'Administrator' }
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('user', JSON.stringify(user))

      if (onLoginSuccess) {
        onLoginSuccess(user)
      }

      // Navigate to the list of books page
      navigate('/books')
    } else {
      setError('Invalid username or password.')
      setIsSubmitting(false)
    }
  }

  return (
    <Theme theme="g10" className="login-theme-wrapper">
      <Header aria-label="eBookStore">
        <HeaderName prefix="IBM">eBookStore</HeaderName>
      </Header>

      <main className="login-page-container">
        <Grid className="login-grid">
          <Column sm={4} md={6} lg={{ span: 6, offset: 5 }} xlg={{ span: 4, offset: 6 }}>
            <Tile className="login-tile">
              <div className="login-header-section">
                <div className="login-icon-badge">
                  <UserAdmin size={32} />
                </div>
                <h1 className="login-title">Sign in</h1>
                <p className="login-subtitle">
                  Access your eBookStore management library
                </p>
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  title="Login Error"
                  subtitle={error}
                  lowContrast
                  hideCloseButton
                  className="login-notification"
                />
              )}

              <Form onSubmit={handleSubmit} className="login-form">
                <Stack gap={6}>
                  <TextInput
                    id="username"
                    labelText="Username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    invalid={Boolean(error && !username.trim())}
                    invalidText="Username is required"
                    autoComplete="username"
                    required
                  />

                  <PasswordInput
                    id="password"
                    labelText="Password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={Boolean(error && !password.trim())}
                    invalidText="Password is required"
                    autoComplete="current-password"
                    required
                  />

                  <Button
                    type="submit"
                    renderIcon={LoginIcon}
                    disabled={isSubmitting}
                    className="login-submit-btn"
                    size="lg"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </Stack>
              </Form>
            </Tile>
          </Column>
        </Grid>
      </main>
    </Theme>
  )
}
