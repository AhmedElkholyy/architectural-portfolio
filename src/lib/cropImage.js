export function getCroppedImg(imageSrc, cropPixels) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cropPixels.width
      canvas.height = cropPixels.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        image,
        cropPixels.x, cropPixels.y,
        cropPixels.width, cropPixels.height,
        0, 0,
        cropPixels.width, cropPixels.height
      )
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    }
    image.src = imageSrc
  })
}

export function getRoundedCrop(imageSrc, cropPixels) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const size = Math.min(cropPixels.width, cropPixels.height)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(
        image,
        cropPixels.x + (cropPixels.width - size) / 2,
        cropPixels.y + (cropPixels.height - size) / 2,
        size, size,
        0, 0,
        size, size
      )
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    }
    image.src = imageSrc
  })
}
