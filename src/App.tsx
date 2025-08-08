import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { AIVisualizer } from './components/AIVisualizer'
import { Controls } from './components/Controls'
import { LiquidGlass } from './components/LiquidGlass'
import { OverlappingGradients } from './components/OverlappingGradients'

export default function App() {
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout'>('idle')
  const [glitchPhase, setGlitchPhase] = useState<'initial' | 'sine' | 'settling'>('initial')
  const [glitchTime, setGlitchTime] = useState(0)
  const [dragPosition, setDragPosition] = useState({ x: 200, y: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationId: number
    
    if (aiState === 'glitchout') {
      setGlitchPhase('initial')
      setGlitchTime(0)
      
      // Initial red-pink flash for 0.2 seconds
      setTimeout(() => {
        setGlitchPhase('sine')
      }, 200)
      
      // Start sine wave animation
      const animate = () => {
        setGlitchTime(prev => prev + 0.016) // ~60fps
        animationId = requestAnimationFrame(animate)
      }
      animate()
      
      // Start settling immediately after flash ends (0.2s) - no hold time
      setTimeout(() => {
        setGlitchPhase('settling')
      }, 200)
      
      // Return to idle after 2 seconds total
      setTimeout(() => {
        setAiState('idle')
        setGlitchPhase('initial')
        setGlitchTime(0)
      }, 2000)
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [aiState])

  // Gradient presets - all starting from same corner (135deg) with different progressions
  const gradientPresets = {
    dreamy: {
      colors: ['#ffb07c', '#ff8a9e', '#e991d1', '#a8c8ec', '#8bb6f0'],
      angle: 135,
      progression: 'soft' // Gentle color transitions matching uploaded image
    },
    sunset: {
      colors: ['#ff7e5f', '#feb47b', '#ff6b6b', '#ee5a24'],
      angle: 135,
      progression: 'warm' // Warm color flow
    },
    ocean: {
      colors: ['#667eea', '#764ba2', '#f093fb', '#43cea2'],
      angle: 135,
      progression: 'cool' // Cool color transitions
    },
    aurora: {
      colors: ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7'],
      angle: 135,
      progression: 'ethereal' // Light, airy progression
    },
    cosmic: {
      colors: ['#ff7eb3', '#ff758c', '#ff7eb3', '#d8b5ff'],
      angle: 135,
      progression: 'vibrant' // Bold color shifts
    },
    // Additional progressive variations
    midnight: {
      colors: ['#2c3e50', '#3498db', '#9b59b6', '#e74c3c'],
      angle: 135,
      progression: 'deep' // Dark to bright progression
    },
    forest: {
      colors: ['#27ae60', '#2ecc71', '#f1c40f', '#e67e22'],
      angle: 135,
      progression: 'natural' // Nature-inspired progression
    },
    monochrome: {
      colors: ['#ecf0f1', '#bdc3c7', '#95a5a6', '#34495e'],
      angle: 135,
      progression: 'neutral' // Grayscale progression
    }
  }

  const [currentGradient, setCurrentGradient] = useState('dreamy')
  const [gradientTime, setGradientTime] = useState(0)

  // Animate gradient transitions
  useEffect(() => {
    let animationId: number
    
          const animate = () => {
        setGradientTime(prev => prev + 0.002) // Even slower for better performance
        animationId = requestAnimationFrame(animate)
      }
    
    if (aiState !== 'glitchout') {
      animate()
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [aiState])

  // Cycle through gradients based on AI state
  useEffect(() => {
    const gradientKeys = Object.keys(gradientPresets)
    
    switch (aiState) {
      case 'idle':
        setCurrentGradient('dreamy')
        break
      case 'listening':
        setCurrentGradient('aurora')
        break
      case 'thinking':
        setCurrentGradient('cosmic')
        break
      case 'speaking':
        setCurrentGradient('sunset')
        break
      default:
        setCurrentGradient('dreamy')
    }
  }, [aiState])

  // Function to create progressive gradient animations based on progression type
  const getProgressiveAnimation = (preset, time) => {
    const { colors, progression, angle } = preset
    
    switch (progression) {
      case 'soft':
        // Gentle, flowing movement
        return colors.map((color, index) => {
          const offset = Math.sin(time * 0.5 + index * 0.8) * 8
          const position = (index / (colors.length - 1)) * 100 + offset
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'warm':
        // Warmer colors flow faster, creating heat-like movement
        return colors.map((color, index) => {
          const heatOffset = Math.sin(time * 0.7 + index * 1.2) * 12
          const position = (index / (colors.length - 1)) * 100 + heatOffset
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'cool':
        // Slower, more methodical progression like water
        return colors.map((color, index) => {
          const waveOffset = Math.sin(time * 0.3 + index * 0.6) * 6
          const position = (index / (colors.length - 1)) * 100 + waveOffset
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'ethereal':
        // Light, airy movement with multiple harmonics
        return colors.map((color, index) => {
          const primary = Math.sin(time * 0.4 + index * 0.9) * 5
          const secondary = Math.sin(time * 0.8 + index * 1.5) * 3
          const position = (index / (colors.length - 1)) * 100 + primary + secondary
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'vibrant':
        // Bold, energetic movement
        return colors.map((color, index) => {
          const energy = Math.sin(time * 0.9 + index * 1.8) * 15
          const position = (index / (colors.length - 1)) * 100 + energy
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'deep':
        // Mysterious, deep space-like progression
        return colors.map((color, index) => {
          const cosmic = Math.sin(time * 0.2 + index * 0.4) * 4
          const pulse = Math.sin(time * 1.5 + index * 2) * 2
          const position = (index / (colors.length - 1)) * 100 + cosmic + pulse
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'natural':
        // Organic, nature-inspired flow
        return colors.map((color, index) => {
          const organic = Math.sin(time * 0.6 + index * 1.1) * 10
          const growth = Math.cos(time * 0.4 + index * 0.7) * 5
          const position = (index / (colors.length - 1)) * 100 + organic + growth
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      case 'neutral':
        // Subtle, professional movement
        return colors.map((color, index) => {
          const subtle = Math.sin(time * 0.3 + index * 0.5) * 3
          const position = (index / (colors.length - 1)) * 100 + subtle
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
      
      default:
        // Default gentle animation
        return colors.map((color, index) => {
          const offset = Math.sin(time + index * 0.5) * 8
          const position = (index / (colors.length - 1)) * 100 + offset
          return `${color} ${Math.max(0, Math.min(100, position))}%`
        })
    }
  }

  const getAnimatedGradient = () => {
    if (aiState === 'glitchout') {
      if (glitchPhase === 'initial' || glitchPhase === 'sine') {
        return '#FF0066' // Bright red-pink flash
      }
      
      if (glitchPhase === 'settling') {
        // Gradual return to animated gradient
        const progress = Math.min((glitchTime - 0.2) / 1.8, 1)
        const preset = gradientPresets[currentGradient]
        
        if (progress < 1) {
          const glitchR = 255, glitchG = 0, glitchB = 102
          const r = Math.floor(glitchR * (1 - progress))
          const g = Math.floor(glitchG * (1 - progress))
          const b = Math.floor(glitchB * (1 - progress))
          
          return `linear-gradient(${preset.angle}deg, 
            rgba(${r}, ${g}, ${b}, ${1 - progress}), 
            ${preset.colors.map((color, i) => 
              `${color} ${(i / (preset.colors.length - 1) * 100) * progress}%`
            ).join(', ')})`
        }
      }
    }
    
    // Normal animated gradient with progressive animations
    const preset = gradientPresets[currentGradient]
    const time = gradientTime
    
    // Get animated colors based on progression type
    const animatedColors = getProgressiveAnimation(preset, time)
    
    // Subtle angle animation (consistent across all gradients from same corner)
    const baseAngle = 135 // All gradients start from same corner
    const angleVariation = Math.sin(time * 0.2) * 3 // Very subtle angle shift
    const animatedAngle = baseAngle + angleVariation
    
    return `linear-gradient(${animatedAngle}deg, ${animatedColors.join(', ')})`
  }

  // Function to manually cycle through gradients (can be called from controls)
  const cycleGradient = () => {
    const gradientKeys = Object.keys(gradientPresets)
    const currentIndex = gradientKeys.indexOf(currentGradient)
    const nextIndex = (currentIndex + 1) % gradientKeys.length
    setCurrentGradient(gradientKeys[nextIndex])
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    setDragPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#f8f9fa', // Subtle base color
      }}
    >
      {/* Overlapping gradient shapes */}
      <OverlappingGradients 
        aiState={aiState} 
        glitchPhase={glitchPhase}
        animationTime={gradientTime}
      />
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ 
          background: 'transparent',
          position: 'relative',
          zIndex: 10 // Above the gradient layers
        }}
      >
        <AIVisualizer aiState={aiState} />
      </Canvas>
      
      {/* Simple Noise Layer - CSS only, super lightweight */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 20, // Above orb but below controls
          opacity: 0.15,
          background: `
            radial-gradient(circle at 20% 80%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 22%, transparent 23%),
            radial-gradient(circle at 80% 20%, transparent 20%, rgba(0,0,0,0.3) 21%, rgba(0,0,0,0.3) 22%, transparent 23%),
            radial-gradient(circle at 40% 40%, transparent 20%, rgba(255,255,255,0.2) 21%, rgba(255,255,255,0.2) 22%, transparent 23%),
            radial-gradient(circle at 60% 60%, transparent 20%, rgba(0,0,0,0.2) 21%, rgba(0,0,0,0.2) 22%, transparent 23%),
            radial-gradient(circle at 90% 90%, transparent 20%, rgba(255,255,255,0.1) 21%, rgba(255,255,255,0.1) 22%, transparent 23%)
          `,
          backgroundSize: '4px 4px, 3px 3px, 5px 5px, 2px 2px, 6px 6px',
        }}
      />
      
      <Controls aiState={aiState} setAiState={setAiState} />
      <Leva collapsed />
      
      {/* Draggable Liquid Glass Surface */}
      <LiquidGlass
        intensity={2}
        opacity={0.03}
        blur={3}
        animate={true}
        style={{
          position: 'absolute',
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
          width: '300px',
          height: '200px',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 30, // Above noise layer
          userSelect: 'none',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
      >
      </LiquidGlass>
    </div>
  )
}