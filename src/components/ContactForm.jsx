import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function ContactForm() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '', _website: '' })
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name || form.name.length < 2) errs.name = t('contact.validationName')
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('contact.validationEmail')
    if (!form.message || form.message.length < 10) errs.message = t('contact.validationMessage')
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form._website) return

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStatus(t('contact.sending'))

    const { error } = await supabase.from('contact_messages').insert({
      sender_name: form.name,
      sender_email: form.email,
      message: form.message,
    })

    if (error) {
      setStatus(t('contact.error'))
      return
    }

    setForm({ name: '', email: '', message: '', _website: '' })
    setStatus(t('contact.success'))
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="_website"
        value={form._website}
        onChange={(e) => setForm({ ...form, _website: e.target.value })}
        style={{ display: 'none' }}
        tabIndex="-1"
        autoComplete="off"
      />

      <div className="form-row">
        <label className="form-field">
          <span className="form-label">{t('contact.name')}</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('contact.name')}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </label>
        <label className="form-field">
          <span className="form-label">{t('contact.email')}</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t('contact.email')}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>
      </div>

      <label className="form-field">
        <span className="form-label">{t('contact.message')}</span>
        <textarea
          required
          minLength="10"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t('contact.message')}
          rows="5"
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </label>

      <button type="submit">{t('contact.send')}</button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  )
}
