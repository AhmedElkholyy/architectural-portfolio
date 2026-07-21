import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import ConfirmModal from '../../components/ConfirmModal'

export default function ContactAdmin() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedMsg, setExpandedMsg] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: m }] = await Promise.all([
        supabase.from('contact_page_settings').select('*').eq('id', 1).single(),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      ])
      setSettings(s)
      setMessages(m || [])
      setLoading(false)
    }
    load()
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await supabase.from('contact_page_settings').update({
        email: settings.email,
        phone: settings.phone,
        location_en: settings.location_en,
        location_ar: settings.location_ar,
        updated_at: new Date().toISOString(),
      }).eq('id', 1)
      showToast(t('admin.saved'))
    } catch (err) {
      showToast(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleRead(msg) {
    await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id)
    setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
  }

  function requestDelete(msg) {
    setPendingDelete(msg)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    const msg = pendingDelete
    setConfirmOpen(false)
    setPendingDelete(null)
    if (!msg) return
    await supabase.from('contact_messages').delete().eq('id', msg.id)
    setMessages(messages.filter(m => m.id !== msg.id))
  }

  if (loading) return <p>{t('admin.loading')}</p>

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="admin-editor">
      {toast && <div className="admin-toast">{toast}</div>}

      <h1>{t('admin.contactAdmin')}</h1>

      <section className="admin-section">
        <h2>{t('admin.contactPageInfo')}</h2>
        <label className="admin-field">
          <span>{t('contact.emailLabel')}</span>
          <input value={settings?.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>{t('contact.phoneLabel')}</span>
          <input value={settings?.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
        </label>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>{t('admin.locationEn')}</span>
            <input value={settings?.location_en || ''} onChange={(e) => setSettings({ ...settings, location_en: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>{t('admin.locationAr')}</span>
            <input value={settings?.location_ar || ''} onChange={(e) => setSettings({ ...settings, location_ar: e.target.value })} dir="rtl" />
          </label>
        </div>
        <button className="admin-save" onClick={handleSave} disabled={saving}>
          {saving ? t('admin.loading') : t('admin.save')}
        </button>
      </section>

      <section className="admin-section">
        <h2>
          {t('admin.messages')}
          {unreadCount > 0 && <span className="admin-badge">{unreadCount} {t('admin.unreadCount').toLowerCase()}</span>}
        </h2>

        {messages.length === 0 ? (
          <p className="admin-empty">{t('admin.noMessages')}</p>
        ) : (
          <div className="admin-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`admin-msg ${msg.is_read ? 'read' : 'unread'}`}>
                <div className="admin-msg-header">
                  <div className="admin-msg-meta">
                    <strong>{msg.sender_name}</strong>
                    <span className="admin-msg-email">{msg.sender_email}</span>
                    <span className={`admin-msg-badge ${msg.is_read ? 'read' : 'unread'}`}>
                      {msg.is_read ? t('admin.markRead') : t('admin.unreadCount')}
                    </span>
                  </div>
                  <span className="admin-msg-date">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className={`admin-msg-body ${expandedMsg === msg.id ? 'expanded' : ''}`}
                  onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}>
                  {msg.message}
                </p>
                <div className="admin-msg-actions">
                  <button onClick={() => toggleRead(msg)}>
                    {msg.is_read ? t('admin.markUnread') : t('admin.markRead')}
                  </button>
                  <button className="danger" onClick={() => requestDelete(msg)}>
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmModal
        open={confirmOpen}
        title={t('admin.delete')}
        message={`${t('admin.confirm')} message from "${pendingDelete?.sender_name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null) }}
        danger
      />
    </div>
  )
}
