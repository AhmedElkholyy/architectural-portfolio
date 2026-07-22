import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export default function CropModal({ image, aspect = 16 / 9, circular = false, onCrop, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, area) => {
    setCroppedAreaPixels(area)
  }, [])

  return (
    <div className="crop-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-area">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            circular={circular}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="crop-controls">
          <label className="crop-zoom-label">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          <div className="crop-actions">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="button" className="modal-btn modal-btn-confirm" onClick={() => onCrop(croppedAreaPixels)}>Crop</button>
          </div>
        </div>
      </div>
    </div>
  )
}
