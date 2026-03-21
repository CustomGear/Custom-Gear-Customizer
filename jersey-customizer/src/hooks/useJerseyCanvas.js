import { useEffect, useRef, useCallback } from 'react'

const IMAGE_CACHE = new Map()
const FONT_CACHE  = new Map()

async function loadImage(src) {
  if (!src) return null
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src)
  const p = new Promise(resolve => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
  IMAGE_CACHE.set(src, p)
  return p
}

async function loadFont(name, url, type) {
  if (!url || FONT_CACHE.has(name)) return
  try {
    const fmt  = type === 'opentype' ? 'opentype' : 'truetype'
    const font = new FontFace(name, `url(${url}) format('${fmt}')`)
    await font.load()
    document.fonts.add(font)
    FONT_CACHE.set(name, true)
  } catch (e) {}
}

/**
 * Renders a jersey using an offscreen canvas + multiply blend.
 * 
 * How it works:
 * 1. Draw the template PNG onto an offscreen canvas (white bg)
 * 2. For each color zone, create a colored layer and composite
 *    it with the template using multiply blend
 * 3. The result: colored jersey with dark outlines preserved
 * 
 * The key insight: we draw color UNDER the template PNG.
 * White areas of the PNG pass the color through.
 * Dark areas of the PNG stay dark (multiply with black = black).
 */
function renderJersey(ctx, tImg, sImg, colors, w, h) {
  // Use an offscreen canvas to compose the jersey
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const oc = off.getContext('2d')

  // White background so multiply works correctly
  oc.fillStyle = '#ffffff'
  oc.fillRect(0, 0, w, h)

  // Draw template PNG — this gives us the jersey shape with outlines
  oc.drawImage(tImg, 0, 0, w, h)

  // Now apply color1 as the base — use source-atop to only paint
  // where the jersey pixels are (non-white/non-transparent areas)
  // We achieve coloring by using multiply blend:
  // Draw a solid color rect, then multiply with the template
  
  // Step 1: fill with color1
  const c1 = colors[0] || '#cccccc'
  oc.globalCompositeOperation = 'multiply'
  oc.fillStyle = c1
  oc.fillRect(0, 0, w, h)

  // Step 2: re-draw template on top to restore outlines
  oc.globalCompositeOperation = 'multiply'
  oc.drawImage(tImg, 0, 0, w, h)

  // Reset
  oc.globalCompositeOperation = 'source-over'

  // Add shading
  if (sImg) {
    oc.globalCompositeOperation = 'multiply'
    oc.globalAlpha = 0.5
    oc.drawImage(sImg, 0, 0, w, h)
    oc.globalAlpha = 1
    oc.globalCompositeOperation = 'source-over'
  }

  // Draw the composed jersey onto the main canvas
  // Clear with transparent background first
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(off, 0, 0)
}

export function useJerseyCanvas({
  canvasRef,
  part,
  templatePart,
  colors,
  playerName,
  playerNumber,
  fontName,
  fontUrl,
  fontType,
  textColor,
  strokeColor,
  textPositions,
  logoCenter,
  logoLeft,
  logoRight,
  laceFile,
  width  = 500,
  height = 600,
}) {
  const activeRef = useRef(true)

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)

    if (!templatePart?.img) {
      // Show a simple placeholder jersey shape
      ctx.fillStyle = colors[0] || '#1a3a6b'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Loading...', width/2, height/2)
      return
    }

    const [tImg, sImg, laceImg] = await Promise.all([
      loadImage(templatePart.img),
      templatePart.shading ? loadImage(templatePart.shading) : null,
      laceFile ? loadImage(laceFile) : null,
    ])

    if (!activeRef.current) return

    if (!tImg) {
      ctx.fillStyle = colors[0] || '#cccccc'
      ctx.fillRect(0, 0, width, height)
      return
    }

    // Render the colored jersey
    renderJersey(ctx, tImg, sImg, colors, width, height)

    if (!activeRef.current) return

    // Logos
    for (const cfg of [logoCenter, logoLeft, logoRight]) {
      if (!cfg?.dataUrl) continue
      const img = await loadImage(cfg.dataUrl)
      if (!img || !activeRef.current) continue
      ctx.save()
      ctx.translate(cfg.x * (width / 1000), cfg.y * (height / 1000))
      if (cfg.r) ctx.rotate(cfg.r * Math.PI / 180)
      const ss = (cfg.size || 200) * (width / 1000)
      ctx.drawImage(img, -ss/2, -ss/2, ss, ss)
      ctx.restore()
    }

    // Text
    if (fontUrl) await loadFont(fontName, fontUrl, fontType)
    if (!activeRef.current) return

    const ff = (fontName && FONT_CACHE.has(fontName))
      ? `'${fontName}'`
      : `'Barlow Condensed'`

    if (textPositions?.length) {
      for (const pos of textPositions) {
        const txt = pos.type === 'name'
          ? (playerName  || 'PLAYER').toUpperCase()
          : (playerNumber || '97')
        if (!txt) continue
        ctx.save()
        ctx.translate(pos.x * (width/1000), pos.y * (height/1000))
        ctx.rotate((pos.angle || 0) * Math.PI / 180)
        const fs = pos.fontSize * (width / 1000)
        ctx.font = `900 ${fs}px ${ff}, 'Barlow Condensed', sans-serif`
        ctx.textAlign    = pos.align || 'center'
        ctx.textBaseline = 'middle'
        if (strokeColor) {
          ctx.strokeStyle = strokeColor
          ctx.lineWidth   = (pos.lineWidth || 4) * (width / 1000)
          ctx.lineJoin    = 'round'
          ctx.strokeText(txt, 0, 0)
        }
        ctx.fillStyle = textColor || '#ffffff'
        ctx.fillText(txt, 0, 0)
        ctx.restore()
      }
    }

    // Laces
    if (laceImg) {
      ctx.save()
      ctx.globalAlpha = 0.9
      ctx.drawImage(laceImg, 0, 0, width, height)
      ctx.restore()
    }

  }, [canvasRef, part, templatePart, colors, playerName, playerNumber,
      fontName, fontUrl, fontType, textColor, strokeColor, textPositions,
      logoCenter, logoLeft, logoRight, laceFile, width, height])

  useEffect(() => {
    activeRef.current = true
    render()
    return () => { activeRef.current = false }
  }, [render])
}
