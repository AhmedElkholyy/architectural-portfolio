import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

export default function Messages() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function toggleRead(msg) {
    await supabase
      .from('contact_messages')
      .update({ is_read: !msg.is_read })
      .eq('id', msg.id)
    fetchMessages()
  }

  async function deleteMessage(msg) {
    if (!confirm(t('admin.confirm') + '?')) return
    await supabase.from('contact_messages').delete().eq('id', msg.id)
    fetchMessages()
  }

  if (loading) return <p>{t('admin.loading')}</p>
  if (messages.length === 0) return <p>{t('admin.noMessages')}</p>

  return (
    <div>
      <h1>{t('admin.messages')}</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Message</th>
            <th style={{ padding: '8px' }}>Status</th>
            <th style={{ padding: '8px' }}>Date</th>
            <th style={{ padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} style={{ borderBottom: '1px solid var(--border)', background: msg.is_read ? 'transparent' : 'var(--surface)' }}>
              <td style={{ padding: '8px' }}>{msg.sender_name}</td>
              <td style={{ padding: '8px' }}>{msg.sender_email}</td>
              <td style={{ padding: '8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {msg.message}
              </td>
              <td style={{ padding: '8px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                  background: msg.is_read ? 'var(--success)' : 'var(--warning)',
                  color: msg.is_read ? 'var(--text-inverse)' : 'var(--text-primary)',
                }}>
                  {msg.is_read ? 'Read' : 'Unread'}
                </span>
              </td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleRead(msg)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}>
                  {msg.is_read ? t('admin.markUnread') : t('admin.markRead')}
                </button>
                <button onClick={() => deleteMessage(msg)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}>
                  {t('admin.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
