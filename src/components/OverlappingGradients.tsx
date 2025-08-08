import { useState, useEffect, useRef } from 'react'

// Simple static transform for subtle variation
const applyStaticTransform = (element: Element, index: number) => {
  const htmlElement = element as HTMLElement
  
  // Apply a subtle static offset based on index - no animation
  const offsetX = Math.sin(index * 0.8) * 5
  const offsetY = Math.cos(index * 0.6) * 4
  const scale = 1 + Math.sin(index * 0.4) * 0.03
  
  htmlElement.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px) scale(${scale})`
  htmlElement.style.transition = 'opacity 800ms ease-out'
}

interface OverlappingGradientsProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout'
  glitchPhase?: 'initial' | 'sine' | 'settling'
  animationTime: number
}

export function OverlappingGradients({ aiState, glitchPhase, animationTime }: OverlappingGradientsProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRefs = useRef<anime.AnimeInstance[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  // Define gradient shapes that will overlap and blend
  const gradientShapes = {
    dreamy: [
      {
        id: 'shape1',
        colors: ['#ff9a56', '#ff6b94', '#ffffff'], // Peachy-orange to coral-pink to white
        coverage: 70,
        blendMode: 'normal',
        opacity: 0.8
      },
      {
        id: 'shape2', 
        colors: ['#ff8a80', '#ffffff', '#ffffff'], // Light coral to white to white
        coverage: 80,
        blendMode: 'screen',
        opacity: 0.9
      },
      {
        id: 'shape3',
        colors: ['#ffffff', '#ffffff', '#f0f0f0'], // White to white to very light gray
        coverage: 90,
        blendMode: 'normal',
        opacity: 0.95
      },
      {
        id: 'shape4',
        colors: ['#ffffff', '#f8f9fa', '#ffffff'], // White to light gray to white
        coverage: 85,
        blendMode: 'screen',
        opacity: 0.9
      },
      {
        id: 'shape5',
        colors: ['#ffffff', '#ffffff', '#ffffff'], // Pure white highlight
        coverage: 75,
        blendMode: 'normal',
        opacity: 0.8
      }
    ],
    sunset: [
      {
        id: 'shape1',
        path: 'M0,0 Q35,15 70,0 T140,0 L140,50 Q105,65 70,50 T0,50 Z',
        colors: ['#ff7e5f', '#feb47b'],
        coverage: 55,
        blendMode: 'multiply',
        opacity: 0.9
      },
      {
        id: 'shape2',
        path: 'M30,10 Q60,30 90,10 L90,70 Q60,90 30,70 Z',
        colors: ['#ff6b6b', '#ee5a24'],
        coverage: 40,
        blendMode: 'color-burn',
        opacity: 0.7
      }
    ],
    aurora: [
      {
        id: 'shape1',
        path: 'M0,0 Q40,25 80,0 T160,0 L160,60 Q120,85 80,60 T0,60 Z',
        colors: ['#a8edea', '#fed6e3'],
        coverage: 65,
        blendMode: 'soft-light',
        opacity: 0.8
      },
      {
        id: 'shape2',
        path: 'M20,15 Q55,5 90,15 T150,15 L150,75 Q115,85 90,75 T20,75 Z',
        colors: ['#d299c2', '#fef9d7'],
        coverage: 45,
        blendMode: 'overlay',
        opacity: 0.6
      }
    ],
    cosmic: [
      {
        id: 'shape1',
        path: 'M0,0 Q45,20 90,0 T180,0 L180,70 Q135,90 90,70 T0,70 Z',
        colors: ['#ff7eb3', '#ff758c'],
        coverage: 70,
        blendMode: 'screen',
        opacity: 0.8
      },
      {
        id: 'shape2',
        path: 'M25,5 Q60,25 95,5 L95,65 Q60,85 25,65 Z',
        colors: ['#d8b5ff', '#ff7eb3'],
        coverage: 35,
        blendMode: 'color-dodge',
        opacity: 0.7
      }
    ]
  }

  const getCurrentShapes = () => {
    switch (aiState) {
      case 'idle':
        return gradientShapes.dreamy
      case 'listening':
        return gradientShapes.aurora
      case 'thinking':
        return gradientShapes.cosmic
      case 'speaking':
        return gradientShapes.sunset
      default:
        return gradientShapes.dreamy
    }
  }

  // Static positioning setup
  useEffect(() => {
    if (!svgRef.current) return
    
    const shapes = getCurrentShapes()
    
    shapes.forEach((shape, index) => {
      const shapeElements = svgRef.current?.querySelectorAll(`[data-shape-id="${shape.id}-${index}"]`)
      
      if (shapeElements) {
        shapeElements.forEach((element) => {
          applyStaticTransform(element, index)
        })
      }
    })
  }, [aiState])
  
  // State change opacity updates
  useEffect(() => {
    if (!svgRef.current) return
    
    const shapes = getCurrentShapes()
    
    shapes.forEach((shape, index) => {
      const shapeElements = svgRef.current?.querySelectorAll(`[data-shape-id="${shape.id}-${index}"]`)
      
      if (shapeElements) {
        shapeElements.forEach((element) => {
          const htmlElement = element as HTMLElement
          htmlElement.style.transition = 'opacity 800ms ease-out'
          htmlElement.style.opacity = shape.opacity.toString()
        })
      }
    })
  }, [aiState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining styles if needed
      if (svgRef.current) {
        const elements = svgRef.current.querySelectorAll('[data-shape-id]')
        elements.forEach(element => {
          const htmlElement = element as HTMLElement
          htmlElement.style.animation = ''
          htmlElement.style.transform = ''
        })
      }
    }
  }, [])

  const shapes = getCurrentShapes()

  // Handle glitch state
  if (aiState === 'glitchout') {
    if (glitchPhase === 'initial' || glitchPhase === 'sine') {
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#FF0066',
            zIndex: 1
          }}
        />
      )
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
        zIndex: 0, // Behind the orb
        pointerEvents: 'none'
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Optimized blur filters - reduced intensity for better performance */}
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          
          <filter id="medium-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
          
          <filter id="heavy-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
          </filter>

          {/* Gradients for each shape with harsh contrast */}
          {shapes.map((shape, index) => (
            <radialGradient
              key={`gradient-${shape.id}-${index}`}
              id={`gradient-${shape.id}-${index}`}
              cx="50%"
              cy="50%"
              r={shape.coverage + '%'}
            >
              {/* Deep, rich center */}
              <stop offset="0%" stopColor={shape.colors[0]} stopOpacity={shape.opacity} />
              <stop offset="15%" stopColor={shape.colors[0]} stopOpacity={shape.opacity * 0.95} />
              
              {/* Sharp transition to mid color */}
              <stop offset="35%" stopColor={shape.colors[1] || shape.colors[0]} stopOpacity={shape.opacity * 0.9} />
              <stop offset="50%" stopColor={shape.colors[1] || shape.colors[0]} stopOpacity={shape.opacity * 0.8} />
              
              {/* Dramatic fade to edge color */}
              <stop offset="70%" stopColor={shape.colors[2] || shape.colors[1] || shape.colors[0]} stopOpacity={shape.opacity * 0.6} />
              <stop offset="85%" stopColor={shape.colors[2] || shape.colors[1] || shape.colors[0]} stopOpacity={shape.opacity * 0.3} />
              <stop offset="100%" stopColor={shape.colors[2] || shape.colors[1] || shape.colors[0]} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {shapes.map((shape, index) => {
          // Assign different blur levels to different shapes for variety
          const getBlurFilter = (shapeIndex: number) => {
            const blurTypes = ['soft-blur', 'medium-blur', 'heavy-blur']
            return `url(#${blurTypes[shapeIndex % blurTypes.length]})`
          }

          return (
            <g
              key={`shape-${shape.id}-${index}`}
              data-shape-id={`${shape.id}-${index}`}
              style={{
                transformOrigin: 'center',
                mixBlendMode: shape.blendMode as any
              }}
            >
              <ellipse
                cx={10 + index * 30}
                cy={90 - index * 25}
                rx={shape.coverage * 1.2}
                ry={shape.coverage * 1.0}
                fill={`url(#gradient-${shape.id}-${index})`}
                opacity={shape.opacity}
                filter={getBlurFilter(index)}
                data-shape-id={`${shape.id}-${index}`}
              />
              
              {/* Additional overlapping ellipse positioned for more white coverage in top */}
              <ellipse
                cx={15 + index * 28}
                cy={85 - index * 22}
                rx={shape.coverage * 0.9}
                ry={shape.coverage * 0.7}
                fill={`url(#gradient-${shape.id}-${index})`}
                opacity={shape.opacity * 0.8}
                filter={getBlurFilter(index)}
                data-shape-id={`${shape.id}-${index}`}
              />
            </g>
          )
        })}

        {/* Base layer for depth with subtle blur */}
        <rect
          width="100%"
          height="100%"
          fill="url(#base-gradient)"
          opacity="0.4"
          style={{ mixBlendMode: 'soft-light' }}
          filter="url(#soft-blur)"
        />

        <defs>
          <linearGradient id="base-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8f9fa" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#495057" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}