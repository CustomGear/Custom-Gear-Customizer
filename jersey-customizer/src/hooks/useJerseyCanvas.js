import { useEffect, useRef, useCallback } from 'react'

const IMAGE_CACHE = new Map()
const FONT_CACHE  = new Map()

async function loadImage(src) {
  if (!src) return null
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src)
  const p = new Promise(resolve => {
    const img = new Image()
    // No crossOrigin — we won't read pixels, just draw
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
  } catch (e) { /* fallback to system font */ }
}

function hexToRgb(hex) {
  if (!hex) return null
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null
}

/**
 * drawColoredJersey
 * -----------------
 * Uses multiply blend mode — no getImageData, no CORS issues.
 *
 * The reference site PNGs work like this:
 *   - White areas  = show the background color (painted underneath)
 *   - Black areas  = outlines (stay dark via multiply)
 *   - Colored zones (red/green/blue encoded) = separate color layers
 *
 * We paint each color as a full canvas fill, then draw the template PNG
 * on top using 'multiply'. The PNG's white zones become the color,
 * dark zones stay dark. For multi-color templates we use multiple passes.
 */
function drawColoredJersey(ctx, tImg, colors, w, h) {
  // 1. Fill with color1 (primary)
  ctx.fillStyle = colors[0] || '#cccccc'
  ctx.fillRect(0, 0, w, h)

  // 2. Draw template PNG with multiply — outlines darken the color, white = transparent
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(tImg, 0, 0, w, h)
  ctx.globalCompositeOperation = 'source-over'

  // 3. For secondary colors: draw a color-filled rect clipped to those zones
  // The template PNG encodes zones as red/green/blue channels
  // We use screen/lighten blend to paint over those zones
  if (colors[1] && colors[1] !== colors[0]) {
    // Draw color2 using 'screen' blend over the red-channel zones
    // This approximation works well for most jersey designs
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = blendColor(colors[1], 0.3)
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(tImg, 0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
  }
}

function blendColor(hex, alpha) {
  const c = hexToRgb(hex)
  if (!c) return `rgba(200,200,200,${alpha})`
  return `rgba(${c.r},${c.g},${c.b},${alpha})`
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
      ctx.fillStyle = colors[0] || '#1a3a6b'
      ctx.fillRect(0, 0, width, height)
      return
    }

    const [tImg, sImg, laceImg] = await Promise.all([
      loadImage(templatePart.img),
      loadImage(templatePart.shading),
      laceFile ? loadImage(laceFile) : null,
    ])

    if (!activeRef.current) return

    if (!tImg) {
      ctx.fillStyle = colors[0] || '#cccccc'
      ctx.fillRect(0, 0, width, height)
      return
    }

    // 1. Draw colored jersey using multiply blend (no CORS needed)
    drawColoredJersey(ctx, tImg, colors, width, height)

    // 2. Shading overlay
    if (sImg) {
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      ctx.globalAlpha = 0.5
      ctx.drawImage(sImg, 0, 0, width, height)
      ctx.restore()
    }

    // 3. Logos
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

    // 4. Text
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

    // 5. Laces
    if (laceImg) {
      ctx.save()
      ctx.globalAlpha = 0.85
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
