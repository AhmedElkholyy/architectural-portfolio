import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

const TOKEN_NAMES = [
  'background', 'surface', 'textPrimary', 'textMuted', 'textInverse',
  'accent', 'accentDark', 'border', 'danger', 'success', 'warning',
  'cardAccent1', 'cardAccent2', 'cardAccent3',
]

export default function Appearance() {
  const { t } = useTranslation()
  const [tokens, setTokens] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('color_tokens').eq('id', 1).single()
      setTokens(data?.color_tokens || {})
      setLoading(false)
    }
    load()
  }, [])

  function updateToken(name, value) {
    setTokens({ ...tokens, [name]: value })
  }

  async function handleSave() {
    setSaving(true)
    try {
      await supabase.from('site_settings').update({
        color_tokens: tokens,
        updated_at: new Date().toISOString(),
      }).eq('id', 1)

      // Apply immediately
      const root = document.documentElement
      const mapping = {
        background: '--background', surface: '--surface', textPrimary: '--text-primary',
        textMuted: '--text-muted', textInverse: '--text-inverse',
        accent: '--accent', accentDark: '--accent-dark', border: '--border',
        danger: '--danger', success: '--success', warning: '--warning',
        cardAccent1: '--card-accent-1', cardAccent2: '--card-accent-2', cardAccent3: '--card-accent-3',
      }
      for (const [key, cssVar] of Object.entries(mapping)) {
        if (tokens[key]) root.style.setProperty(cssVar, tokens[key])
      }

      alert('Saved!')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>{t('admin.loading')}</p>

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1>{t('admin.colorTokens')}</h1>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Token names are fixed. Only values can be changed.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {TOKEN_NAMES.map((name) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ flex: 1, fontWeight: 500 }}>{name}</label>
            <input
              type="color"
              value={tokens[name] || '#000000'}
              onChange={(e) => updateToken(name, e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={tokens[name] || ''}
              onChange={(e) => updateToken(name, e.target.value)}
              style={{ width: '200px', padding: '8px', fontFamily: 'monospace' }}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--background)', border: 'none', cursor: 'pointer', marginTop: '1.5rem' }}>
        {saving ? t('admin.loading') : t('admin.save')}
      </button>
    </div>
  )
}
