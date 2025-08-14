import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { AIVisualizer } from './components/AIVisualizer'
import { Controls } from './components/Controls'
import { LiquidGlass } from './components/LiquidGlass'

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

  const getGlitchBackground = () => {
    if (aiState !== 'glitchout') return '#f2f2f2'
    
    if (glitchPhase === 'initial') {
      return '#FF0066' // Bright red-pink
    }
    
    if (glitchPhase === 'sine') {
      // Brief red-pink flash for 0.2 seconds only
      return '#FF0066' // Solid red-pink hold
    }
    
    if (glitchPhase === 'settling') {
      // Gradual return to normal over 1.8 seconds
      const progress = Math.min((glitchTime - 0.2) / 1.8, 1)
      const normalR = 242, normalG = 242, normalB = 242 // #f2f2f2
      const glitchR = 255, glitchG = 0, glitchB = 102
      
      const r = Math.floor(glitchR + (normalR - glitchR) * progress)
      const g = Math.floor(glitchG + (normalG - glitchG) * progress)
      const b = Math.floor(glitchB + (normalB - glitchB) * progress)
      
      return `rgb(${r}, ${g}, ${b})`
    }
    
    return '#f2f2f2'
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
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: getGlitchBackground() }}
      >
        <AIVisualizer aiState={aiState} />
      </Canvas>
      
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
          zIndex: 100,
          userSelect: 'none',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
      >
      </LiquidGlass>
    </>
  )
}