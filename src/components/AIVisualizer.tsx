import { useMemo } from 'react'
import { AnimatedBlob } from './AnimatedBlob'
import { useControls } from 'leva'

interface AIVisualizerProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking'
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
        color: getSpecificColor(i, colorShift),
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

function getSpecificColors(): string[] {
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

function getSpecificColor(index: number, shift: number): string {
  const colors = getSpecificColors()
  const shiftedIndex = (index + shift) % colors.length
  return colors[shiftedIndex]
}