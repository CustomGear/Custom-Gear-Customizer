import { useRef } from 'react'
import { useJerseyCanvas } from '../hooks/useJerseyCanvas'

export default function JerseyCanvas({
  template,
  part,
  colors,
  playerName,
  playerNumber,
  fontName,
  fontUrl,
  textColor,
  strokeColor,
  logoCenter,
  logoLeft,
  logoRight,
  laceFile,
  width,
  height,
}) {
  const canvasRef = useRef(null)

  useJerseyCanvas({
    canvasRef,
    templateFolder: template?.folder,
    part,
    colors,
    playerName,
    playerNumber,
    fontName,
    fontUrl,
    textColor,
    strokeColor,
    textPositions: template?.textPositions?.[part],
    logoCenter:    part === 'front' ? logoCenter : null,
    logoLeft:      part === 'front' ? logoLeft   : null,
    logoRight:     part === 'front' ? logoRight  : null,
    laceFile:      (part === 'front' || part === 'back') ? laceFile : null,
    width,
    height,
  })

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
    />
  )
}
