import { useEffect, useState, useMemo } from 'react'

interface Shape {
  id: string
  type: 'circle' | 'ellipse' | 'blob' | 'polygon'
  x: number
  y: number
  size: number
  color: string
  opacity: number
  rotation: number
  animationDuration: number
  delay: number
}

interface MoodySVGShapesProps {
  shapeCount?: number
  animate?: boolean
  intensity?: number
}

export function MoodySVGShapes({ 
  shapeCount = 8, 
  animate = true,
  intensity = 0.8 
}: MoodySVGShapesProps) {
  const [time, setTime] = useState(0)

  // Color palette for moody gradients
  const moodColors = [
    '#FF6B6B', // Coral red
    '#4ECDC4', // Teal
    '#45B7D1', // Sky blue
    '#96CEB4', // Mint green
    '#FECA57', // Warm yellow
    '#FF9FF3', // Pink
    '#54A0FF', // Blue
    '#5F27CD', // Purple
    '#00D2D3', // Cyan
    '#FF9F43', // Orange
    '#10AC84', // Green
    '#EE5A24', // Red orange
  ]

  const shapes = useMemo(() => {
    const generatedShapes: Shape[] = []
    
    for (let i = 0; i < shapeCount; i++) {
      const shape: Shape = {
        id: `shape-${i}`,
        type: ['circle', 'ellipse', 'blob', 'polygon'][Math.floor(Math.random() * 4)] as Shape['type'],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 80 + Math.random() * 140,
        color: moodColors[Math.floor(Math.random() * moodColors.length)],
        opacity: 0.4 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        animationDuration: 20 + Math.random() * 30,
        delay: Math.random() * 10
      }
      generatedShapes.push(shape)
    }
    
    return generatedShapes
  }, [shapeCount])

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setTime(prev => prev + 0.1)
    }, 100)

    return () => clearInterval(interval)
  }, [animate])

  const renderShape = (shape: Shape) => {
    const animatedX = shape.x + Math.sin(time / shape.animationDuration + shape.delay) * 4
    const animatedY = shape.y + Math.cos(time / shape.animationDuration + shape.delay) * 3
    const animatedOpacity = shape.opacity * (0.8 + 0.2 * Math.sin(time / 6 + shape.delay))

    switch (shape.type) {
      case 'circle':
        return (
          <circle
            key={shape.id}
            cx={`${animatedX}%`}
            cy={`${animatedY}%`}
            r={shape.size}
            fill={shape.color}
            opacity={animatedOpacity}
            filter="url(#shared-blur)"
          />
        )
      
      case 'ellipse':
        return (
          <ellipse
            key={shape.id}
            cx={`${animatedX}%`}
            cy={`${animatedY}%`}
            rx={shape.size}
            ry={shape.size * 0.6}
            fill={shape.color}
            opacity={animatedOpacity}
            filter="url(#shared-blur)"
          />
        )
      
      case 'blob':
        const blobPath = `M${shape.size * 0.8},${shape.size * 0.3} 
                         C${shape.size * 1.2},${shape.size * 0.1} ${shape.size * 1.4},${shape.size * 0.8} ${shape.size},${shape.size} 
                         C${shape.size * 0.6},${shape.size * 1.2} ${shape.size * 0.2},${shape.size * 0.9} ${shape.size * 0.4},${shape.size * 0.6} 
                         C${shape.size * 0.2},${shape.size * 0.3} ${shape.size * 0.4},${shape.size * 0.1} ${shape.size * 0.8},${shape.size * 0.3} Z`
        
        return (
          <path
            key={shape.id}
            d={blobPath}
            fill={shape.color}
            opacity={animatedOpacity}
            filter="url(#shared-blur)"
            transform={`translate(${animatedX}%, ${animatedY}%)`}
          />
        )
      
      case 'polygon':
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = shape.size
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          return `${x},${y}`
        }).join(' ')
        
        return (
          <polygon
            key={shape.id}
            points={points}
            fill={shape.color}
            opacity={animatedOpacity}
            filter="url(#shared-blur)"
            transform={`translate(${animatedX}%, ${animatedY}%)`}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 45, // Behind grain (50) and glass (100), but above background
        opacity: intensity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <filter id="shared-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>
        {shapes.map(renderShape)}
      </svg>
    </div>
  )
}