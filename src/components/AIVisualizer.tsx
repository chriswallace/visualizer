import { useMemo } from 'react'
import { AnimatedBlob } from './AnimatedBlob'
import { useControls } from 'leva'

interface AIVisualizerProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout'
}

export function AIVisualizer({ aiState }: AIVisualizerProps) {
  const { 
    blobCount,
    spacing,
    movement,
    colorShift
  } = useControls('AI Blobs', {
    blobCount: { value: 5, min: 3, max: 8, step: 1 },
    spacing: { value: 0.4, min: 0.2, max: 1.0, step: 0.1 },
    movement: { value: 1.0, min: 0.5, max: 2.0, step: 0.1 },
    colorShift: { value: 0, min: 0, max: 7, step: 1 }
  })

  const blobConfigs = useMemo(() => {
    const configs = []
    
    // Size modifier based on AI state
    const sizeModifier = aiState === 'thinking' ? 0.7 : 1.0
    // Spacing modifier based on AI state
    const spacingModifier = aiState === 'thinking' ? 0.6 : 1.0
    
    for (let i = 0; i < blobCount; i++) {
      const angle = (i / blobCount) * Math.PI * 2
      const radius = (spacing + Math.random() * 0.2) * spacingModifier
      
      configs.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 0.2
        ] as [number, number, number],
        color: getSpecificColor(i, colorShift, aiState),
        scale: (1.0 + Math.random() * 0.5) * sizeModifier,
        speed: movement * (0.5 + Math.random() * 0.5),
        layerIndex: i
      })
    }
    
    return configs
  }, [blobCount, spacing, movement, colorShift, aiState])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      
      {blobConfigs.map((config) => (
        <AnimatedBlob
          key={config.id}
          position={config.position}
          color={config.color}
          scale={config.scale}
          speed={config.speed}
          aiState={aiState}
          layerIndex={config.layerIndex}
        />
      ))}
    </>
  )
}

function getIdleColors(): string[] {
  return [
    '#FF3B30', // red
    '#FF6B00', // orange
    '#FFC400', // yellow (muted to avoid blowout)
    '#A0F400', // lime
    '#00E676', // green
    '#00D5FF', // cyan
    '#1E88E5', // blue
    '#3949AB', // indigo
    '#8E24AA', // violet
    '#D81B60', // magenta
    '#FF4081', // pink
    '#FF1744'  // red accent
  ]
}

function getActiveColors(): string[] {
  return [
    '#D900FF', // Bright magenta
    '#FF3333', // Bright red
    '#C933FF', // Purple magenta
    '#8533FF', // Blue purple
    '#3A33FF', // Blue
    '#FF1E1E', // Red
    '#FF1EA1', // Pink
    '#FF00F6'  // Magenta pink
  ]
}

function getSpecificColor(index: number, shift: number, aiState: string): string {
  const colors = aiState === 'idle' ? getIdleColors() : getActiveColors()
  const shiftedIndex = (index + shift) % colors.length
  return colors[shiftedIndex]
}