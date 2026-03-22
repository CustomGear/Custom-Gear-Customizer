import { useEffect, useState, useCallback } from 'react'
import { COLOR_ZONES } from '../templates'

// Cache raw SVG text only (not colored versions)
const SVG_TEXT_CACHE = new Map()

async function fetchSvgText(url) {
  if (SVG_TEXT_CACHE.has(url)) return SVG_TEXT_CACHE.get(url)
  const r = await fetch(url)
  const text = await r.text()
  SVG_TEXT_CACHE.set(url, text)
  return text
}

/**
 * useSvgRenderer
 * Fetches SVG once, then re-colors it on every colors change
 * by string-replacing the 4 placeholder hex values.
 */
export function useSvgRenderer({ svgFile, colors }) {
  const [svgUrl, setSvgUrl] = useState(null)
  const colorKey = colors?.join(',') || ''

  const render = useCallback(async () => {
    if (!svgFile) return
    try {
      // Always get fresh SVG text (from cache after first load)
      let svg = await fetchSvgText(svgFile)

      // Replace each color zone with user's chosen color
      const replacements = [
        [COLOR_ZONES[1], colors?.[0]],
        [COLOR_ZONES[2], colors?.[1]],
        [COLOR_ZONES[3], colors?.[2]],
        [COLOR_ZONES[4], colors?.[3]],
      ]

      for (const [from, to] of replacements) {
        if (!to) continue
        const toUpper = to.toUpperCase()
        // Replace all case variants of the placeholder
        svg = svg.split(from.toUpperCase()).join(toUpper)
        svg = svg.split(from.toLowerCase()).join(toUpper)
        svg = svg.split(from).join(toUpper)
      }

      // Create fresh blob URL every time colors change
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url  = URL.createObjectURL(blob)

      setSvgUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
    } catch (e) {
      console.error('SVG render error:', e)
    }
  }, [svgFile, colorKey])

  useEffect(() => {
    render()
  }, [render])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSvgUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [])

  return svgUrl
}
