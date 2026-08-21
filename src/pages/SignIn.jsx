import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../lib/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignIn() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFormError('')
  }

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Enter your work email.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setFormError('')

    try {
      await signIn(form)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <p className="mobile-brand">Nexora CRM</p>
      <p className="form-kicker">Welcome back</p>
      <h2>Sign in to your workspace</h2>
      <p className="form-sub">Use the email you registered with your team.</p>

      {formError ? <div className="banner banner--error" role="alert">{formError}</div> : null}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className={errors.email ? 'field field--error' : 'field'}>
          <span>Work email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
          />
          {errors.email ? <small>{errors.email}</small> : null}
        </label>

        <label className={errors.password ? 'field field--error' : 'field'}>
          <span>Password</span>
          <div className="password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
            />
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password ? <small>{errors.password}</small> : null}
        </label>

        <div className="form-row">
          <label className="check">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => update('remember', event.target.checked)}
            />
            Remember me
          </label>
          <button type="button" className="text-link" onClick={() => setFormError('Password reset will be available once email is connected.')}>
            Forgot password?
          </button>
        </div>

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="switch-line">
        New to Nexora? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  )
}
