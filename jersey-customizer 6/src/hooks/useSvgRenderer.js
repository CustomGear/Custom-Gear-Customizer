import { useEffect, useState, useCallback } from 'react'
import { COLOR_ZONES } from '../templates'

const SVG_CACHE = new Map()

async function fetchSvg(url) {
  if (SVG_CACHE.has(url)) return SVG_CACHE.get(url)
  const r = await fetch(url)
  const text = await r.text()
  SVG_CACHE.set(url, text)
  return text
}

/**
 * useSvgRenderer
 * --------------
 * Fetches the SVG template, replaces the placeholder color zones
 * with the user's chosen colors, and returns the colored SVG as
 * a data URL that can be used as an <img> src — no canvas needed,
 * no CORS issues, works perfectly.
 *
 * Color zone mapping (from the SVG files):
 *   #30E2E2 → colors[0]  (primary body)
 *   #167C8C → colors[1]  (secondary stripe)
 *   #51DE48 → colors[2]  (tertiary accent)
 *   #8E23CC → colors[3]  (quaternary detail)
 */
export function useSvgRenderer({ svgFile, colors }) {
  const [svgUrl, setSvgUrl] = useState(null)

  const render = useCallback(async () => {
    if (!svgFile) return
    try {
      let svg = await fetchSvg(svgFile)

      // Replace each color zone placeholder with the user's chosen color
      // Use case-insensitive regex to handle both upper and lower case hex
      const replacements = [
        [COLOR_ZONES[1], colors[0]],
        [COLOR_ZONES[2], colors[1]],
        [COLOR_ZONES[3], colors[2]],
        [COLOR_ZONES[4], colors[3]],
      ]

      for (const [from, to] of replacements) {
        if (!to) continue
        // Replace fill colors
        const fromUpper = from.toUpperCase()
        const fromLower = from.toLowerCase()
        svg = svg.replace(new RegExp(fromUpper, 'g'), to.toUpperCase())
        svg = svg.replace(new RegExp(fromLower, 'g'), to.toUpperCase())
        // Also handle without the # prefix in some SVG attributes
        const fromNoHash = from.slice(1)
        svg = svg.replace(new RegExp(fromNoHash, 'gi'), to.slice(1).toUpperCase())
      }

      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url  = URL.createObjectURL(blob)
      setSvgUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
    } catch (e) {
      console.error('SVG render error:', e)
    }
  }, [svgFile, colors?.join(',')])

  useEffect(() => {
    render()
  }, [render])

  return svgUrl
}
