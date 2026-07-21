import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger }) {
  const { t } = useTranslation()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus()
  }, [open])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && open) onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} ref={dialogRef} tabIndex="-1">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>{t('admin.cancel')}</button>
          <button className={`modal-btn ${danger ? 'modal-btn-danger' : 'modal-btn-confirm'}`} onClick={onConfirm}>{t('admin.confirm')}</button>
        </div>
      </div>
    </div>
  )
}
