import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../lib/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function passwordScore(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent']

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const score = useMemo(() => passwordScore(form.password), [form.password])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFormError('')
  }

  function validate() {
    const next = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!form.email.trim()) next.email = 'Enter your work email.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    if (!form.terms) next.terms = 'Please accept the terms to continue.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setFormError('')

    try {
      await signUp(form)
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
      <p className="form-kicker">Start free</p>
      <h2>Create your CRM workspace</h2>
      <p className="form-sub">Set up your account in under a minute. No credit card needed.</p>

      {formError ? <div className="banner banner--error" role="alert">{formError}</div> : null}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className={errors.fullName ? 'field field--error' : 'field'}>
          <span>Full name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="Ava Patel"
            value={form.fullName}
            onChange={(event) => update('fullName', event.target.value)}
          />
          {errors.fullName ? <small>{errors.fullName}</small> : null}
        </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
          <div className={`strength strength--${score}`} aria-hidden={!form.password}>
            <span /><span /><span /><span />
          </div>
          {form.password ? (
            <small className="hint">{strengthLabels[score]} password</small>
          ) : errors.password ? (
            <small>{errors.password}</small>
          ) : (
            <small className="hint">Use 8+ characters with mixed case and a number.</small>
          )}
        </label>

        <label className={errors.confirmPassword ? 'field field--error' : 'field'}>
          <span>Confirm password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(event) => update('confirmPassword', event.target.value)}
          />
          {errors.confirmPassword ? <small>{errors.confirmPassword}</small> : null}
        </label>

        <label className={errors.terms ? 'check check--error' : 'check'}>
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) => update('terms', event.target.checked)}
          />
          <span>
            I agree to the Terms and Privacy Policy
          </span>
        </label>
        {errors.terms ? <small className="field-error">{errors.terms}</small> : null}

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Creating workspace…' : 'Create account'}
        </button>
      </form>

      <p className="switch-line">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
