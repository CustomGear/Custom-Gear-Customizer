import { useSvgRenderer } from '../hooks/useSvgRenderer'

export default function JerseyPreview({ template, colors }) {
  const svgUrl = useSvgRenderer({ svgFile: template?.file, colors })

  if (!template) return <div className="loading-block" />
  if (!svgUrl) return <div className="loading-block" />

  return (
    <img
      src={svgUrl}
      alt={template.name}
      draggable={false}
    />
  )
}
