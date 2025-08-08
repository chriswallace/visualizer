import { useEffect, useRef, useState } from 'react'

interface LiquidGlassProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: number
  opacity?: number
  blur?: number
  scale?: number
  animate?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
}

export function LiquidGlass({ 
  children, 
  className = '', 
  style = {}, 
  intensity = 1,
  opacity = 0.1,
  blur = 15,
  scale = 1.2,
  animate = true,
  onMouseDown
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mouseUsed, setMouseUsed] = useState(false)
  const filterId = `liquid-glass-${Math.random().toString(36).substr(2, 9)}`
  const width = 300
  const height = 200
  const canvasDPI = 1

  // Utility functions from the vanilla JS implementation
  const smoothStep = (a: number, b: number, t: number) => {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }

  const length = (x: number, y: number) => {
    return Math.sqrt(x * x + y * y)
  }

  const roundedRectSDF = (x: number, y: number, width: number, height: number, radius: number) => {
    const qx = Math.abs(x) - width + radius
    const qy = Math.abs(y) - height + radius
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius
  }

  const texture = (x: number, y: number) => {
    return { x, y }
  }

  // Fragment shader function
  const fragmentShader = (uv: { x: number, y: number }, mouse: { x: number, y: number }) => {
    const ix = uv.x - 0.5
    const iy = uv.y - 0.5
    const distanceToEdge = roundedRectSDF(
      ix,
      iy,
      0.3,
      0.2,
      0.6
    )
    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.12)  // Balanced displacement area
    const scaled = smoothStep(0, 1, displacement) * 1.2  // Moderate displacement
    return texture(ix * scaled + 0.5, iy * scaled + 0.5)
  }

  // Update shader effect
  const updateShader = () => {
    if (!canvasRef.current || !svgRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const mouseProxy = new Proxy(mousePosition, {
      get: (target, prop) => {
        setMouseUsed(true)
        return target[prop as keyof typeof target]
      }
    })

    setMouseUsed(false)

    const w = width * canvasDPI
    const h = height * canvasDPI
    const data = new Uint8ClampedArray(w * h * 4)

    let maxScale = 0
    const rawValues: number[] = []

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w
      const y = Math.floor(i / 4 / w)
      const pos = fragmentShader(
        { x: x / w, y: y / h },
        mouseProxy
      )
      const dx = pos.x * w - x
      const dy = pos.y * h - y
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy))
      rawValues.push(dx, dy)
    }

    maxScale *= 0.8  // Moderate displacement scaling

    let index = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5
      const g = rawValues[index++] / maxScale + 0.5
      data[i] = r * 255
      data[i + 1] = g * 255
      data[i + 2] = 0
      data[i + 3] = 255
    }

    context.putImageData(new ImageData(data, w, h), 0, 0)

    // Update SVG filter
    const feImage = svgRef.current.querySelector('feImage')
    const feDisplacementMap = svgRef.current.querySelector('feDisplacementMap')
    
    if (feImage && feDisplacementMap) {
      feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL())
      feDisplacementMap.setAttribute('scale', (maxScale / canvasDPI).toString())
    }
  }

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const newMousePos = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    }
    
    setMousePosition(newMousePos)
  }

  useEffect(() => {
    if (animate) {
      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [animate])

  useEffect(() => {
    updateShader()
  }, [mousePosition])

  useEffect(() => {
    // Initialize canvas
    if (canvasRef.current) {
      canvasRef.current.width = width * canvasDPI
      canvasRef.current.height = height * canvasDPI
    }
    updateShader()
  }, [])

  return (
    <>
      {/* Hidden SVG filter */}
      <svg 
        ref={svgRef}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: 0, 
          height: 0, 
          pointerEvents: 'none',
          zIndex: 9998
        }}
      >
        <defs>
          <filter 
            id={filterId}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width={width.toString()}
            height={height.toString()}
          >
            <feImage
              id={`${filterId}_map`}
              width={width.toString()}
              height={height.toString()}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2={`${filterId}_map`}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Hidden canvas for displacement map */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Main glass container */}
      <div
        ref={containerRef}
        className={`liquid-glass ${className}`}
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)',
          cursor: 'grab',
          backdropFilter: `url(#${filterId}) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`,
          zIndex: 100,
          pointerEvents: 'auto',
          ...style
        }}
      >
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
} 