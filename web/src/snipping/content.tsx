{
  function SnipperOverlay() {
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.zIndex = '999999'
    overlay.style.cursor = 'crosshair'
    overlay.style.backgroundColor = 'rgba(0,0,0,0.2)'
    return overlay
  }

  function SelectionBox() {
    const selectionBox = document.createElement('div')
    selectionBox.style.position = 'fixed'
    selectionBox.style.border = '2px dashed #fff'
    selectionBox.style.background = 'rgba(255, 255, 255, 0.3)'
    selectionBox.style.zIndex = '1000000'
    return selectionBox
  }

  let startX: number,
    startY: number,
    endX: number,
    endY: number,
    selectionBox: HTMLDivElement

  const overlay = SnipperOverlay()
  document.body.appendChild(overlay)
  overlay.addEventListener('mousedown', (e: MouseEvent) => {
    startX = e.clientX
    startY = e.clientY

    selectionBox = SelectionBox()
    document.body.appendChild(selectionBox)

    const onMouseMove = (e: MouseEvent) => {
      endX = e.clientX
      endY = e.clientY

      const rect = {
        left: Math.min(startX, endX),
        top: Math.min(startY, endY),
        width: Math.abs(startX - endX),
        height: Math.abs(startY - endY),
      }

      Object.assign(selectionBox.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      })
    }

    const onMouseUp = () => {
      overlay.remove()
      selectionBox.remove()

      const cropX = Math.min(startX, endX)
      const cropY = Math.min(startY, endY)
      const cropW = Math.abs(startX - endX)
      const cropH = Math.abs(startY - endY)

      chrome.runtime.sendMessage({
        action: 'capture',
        x: cropX,
        y: cropY,
        w: cropW,
        h: cropH,
      })

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}
