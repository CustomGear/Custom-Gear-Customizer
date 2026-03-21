import { useEffect, useRef, useCallback } from 'react'

/**
 * useJerseyCanvas
 * ---------------
 * Draws a jersey part (front, back, sock, pant) onto a canvas element.
 *
 * Rendering pipeline per canvas:
 *   1. Fill background with color1
 *   2. Draw the template PNG (transparent line-art) with multiply blend — this
 *      tints the stripes/yoke areas that are encoded as grey tones in the PNG
 *   3. Re-draw color zones: the template PNG encodes color regions as specific
 *      RGB channels. We use getImageData to detect which pixels belong to
 *      which color zone, then paint them.
 *   4. Draw shading overlay (source-over, semi-transparent) for depth
 *   5. Draw logos at defined positions
 *   6. Draw text (name / number) at defined positions with the chosen font
 *   7. Draw laces overlay if selected
 *
 * NOTE: Because your SVG templates use color channels to encode zones,
 * and PNGs from the reference site use a different approach, this renderer
 * uses the SIMPLER approach: the template PNG IS the stripe/line artwork.
 * Color is painted in background layers. This exactly matches how the
 * reference site works.
 */

const IMAGE_CACHE = new Map()

async function loadImage(src) {
  if (!src) return null
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src)
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { IMAGE_CACHE.set(src, img); resolve(img) }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

const FONT_CACHE = new Map()

async function loadFont(name, url) {
  if (!url || FONT_CACHE.has(name)) return
  try {
    const font = new FontFace(name, `url(${url})`)
    await font.load()
    document.fonts.add(font)
    FONT_CACHE.set(name, true)
  } catch (e) {
    // font failed, will fallback to condensed
  }
}

export function useJerseyCanvas({
  canvasRef,
  templateFolder,
  part,          // 'front' | 'back' | 'sock' | 'pant'
  colors,        // [color1, color2, color3, color4]
  playerName,
  playerNumber,
  fontName,
  fontUrl,
  textColor,
  strokeColor,
  textPositions, // array of {x,y,angle,fontSize,type,align}
  logoCenter,    // { dataUrl, x, y, size }
  logoLeft,
  logoRight,
  laceFile,
  width = 500,
  height = 600,
}) {
  const renderRef = useRef(null)

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !templateFolder) return
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)

    const base = `/templates/${templateFolder}`

    // Load all images in parallel
    const [templateImg, shadingImg, laceImg] = await Promise.all([
      loadImage(`${base}/${part}.png`),
      loadImage(`${base}/shading-${part}.png`),
      laceFile ? loadImage(laceFile) : Promise.resolve(null),
    ])

    if (!templateImg) {
      // Draw placeholder
      ctx.fillStyle = colors[0] || '#cccccc'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Add ${part}.png to /public/templates/${templateFolder}/`, width/2, height/2)
      return
    }

    // ── 1. Base color fill (color1) ──
    ctx.fillStyle = colors[0] || '#cccccc'
    ctx.fillRect(0, 0, width, height)

    // ── 2. Draw the jersey template PNG ──
    // Use 'multiply' so the dark lines/stripes in the PNG tint the background color
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(templateImg, 0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'

    // ── 3. Color zones ──
    // The PNG encodes secondary colors as specific zones.
    // We draw the PNG into an offscreen canvas, sample pixel colors,
    // and re-paint those zones in the chosen colors.
    // This works when the PNG has distinct color regions (R/G/B channels).
    applyColorZones(ctx, templateImg, colors, width, height)

    // ── 4. Shading overlay ──
    if (shadingImg) {
      ctx.globalAlpha = 0.55
      ctx.globalCompositeOperation = 'multiply'
      ctx.drawImage(shadingImg, 0, 0, width, height)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    // ── 5. Logos ──
    const logos = [
      { cfg: logoCenter, key: 'center' },
      { cfg: logoLeft,   key: 'left' },
      { cfg: logoRight,  key: 'right' },
    ]
    for (const { cfg } of logos) {
      if (!cfg?.dataUrl) continue
      const img = await loadImage(cfg.dataUrl)
      if (!img) continue
      const s = cfg.size
      ctx.save()
      ctx.translate(cfg.x, cfg.y)
      ctx.drawImage(img, -s/2, -s/2, s, s)
      ctx.restore()
    }

    // ── 6. Text ──
    if (fontUrl) await loadFont(fontName, fontUrl)
    const fontFamily = fontName && FONT_CACHE.has(fontName)
      ? fontName
      : 'Barlow Condensed'

    if (textPositions?.length && (playerName || playerNumber)) {
      for (const pos of textPositions) {
        const text = pos.type === 'name'
          ? (playerName || 'PLAYER').toUpperCase()
          : (playerNumber || '97')

        if (!text) continue

        ctx.save()
        ctx.translate(pos.x * (width / 1000), pos.y * (height / 1000))
        ctx.rotate((pos.angle || 0) * Math.PI / 180)

        const scaledSize = pos.fontSize * (width / 1000)
        ctx.font = `900 ${scaledSize}px '${fontFamily}', 'Barlow Condensed', sans-serif`
        ctx.textAlign = pos.align || 'center'
        ctx.textBaseline = 'middle'

        // Stroke
        if (strokeColor) {
          ctx.strokeStyle = strokeColor
          ctx.lineWidth = pos.lineWidth ? pos.lineWidth * (width / 1000) : 3
          ctx.lineJoin = 'round'
          ctx.strokeText(text, 0, 0)
        }

        // Fill
        ctx.fillStyle = textColor || '#ffffff'
        ctx.fillText(text, 0, 0)
        ctx.restore()
      }
    }

    // ── 7. Laces overlay ──
    if (laceImg) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(laceImg, 0, 0, width, height)
      ctx.globalAlpha = 1
    }

  }, [
    canvasRef, templateFolder, part, colors,
    playerName, playerNumber, fontName, fontUrl,
    textColor, strokeColor, textPositions,
    logoCenter, logoLeft, logoRight, laceFile,
    width, height,
  ])

  useEffect(() => {
    // Cancel previous render
    if (renderRef.current) renderRef.current = false
    const token = {}
    renderRef.current = token
    render()
  }, [render])
}

/**
 * applyColorZones
 * ---------------
 * Reads the template PNG pixels. The PNG should encode color zones as
 * dominant channel values:
 *   - Pure Red   (r>200, g<80,  b<80)  → color2
 *   - Pure Green (g>200, r<80,  b<80)  → color3
 *   - Pure Blue  (b>200, r<80,  g<80)  → color4
 *
 * White/transparent areas = primary color (already painted).
 * Dark/black areas = keep as-is (the lines).
 *
 * If your PNGs don't use this encoding, the zones simply won't apply
 * and only color1 will show — which is fine for single-color templates.
 */
function applyColorZones(ctx, templateImg, colors, width, height) {
  const offscreen = document.createElement('canvas')
  offscreen.width = width
  offscreen.height = height
  const octx = offscreen.getContext('2d')
  octx.drawImage(templateImg, 0, 0, width, height)

  let imageData
  try {
    imageData = octx.getImageData(0, 0, width, height)
  } catch (e) {
    return // CORS issue — skip zone coloring
  }

  const data = imageData.data
  const overlay = ctx.createImageData(width, height)
  const od = overlay.data
  let hasZones = false

  const c2 = hexToRgb(colors[1])
  const c3 = hexToRgb(colors[2])
  const c4 = hexToRgb(colors[3])

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 10) continue

    let fill = null

    if (r > 180 && g < 80 && b < 80 && c2) { fill = c2; hasZones = true }
    else if (g > 180 && r < 80 && b < 80 && c3) { fill = c3; hasZones = true }
    else if (b > 180 && r < 80 && g < 80 && c4) { fill = c4; hasZones = true }

    if (fill) {
      od[i]   = fill.r
      od[i+1] = fill.g
      od[i+2] = fill.b
      od[i+3] = a
    }
  }

  if (hasZones) {
    ctx.putImageData(overlay, 0, 0)
  }
}

function hexToRgb(hex) {
  if (!hex) return null
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}
