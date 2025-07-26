import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { AnimatedBlob } from './AnimatedBlob'
import { useControls } from 'leva'

interface AIVisualizerProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking'
}

export function AIVisualizer({ aiState }: AIVisualizerProps) {
  const { 
    blobCount,
    bloomIntensity,
    chromaIntensity 
  } = useControls('Global Effects', {
    blobCount: { value: 5, min: 3, max: 8, step: 1 },
    bloomIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
    chromaIntensity: { value: 0.1, min: 0, max: 1, step: 0.01 }
  })

  // Generate blob configurations based on AI state
  const blobConfigs = useMemo(() => {
    const configs = []
    
    for (let i = 0; i < blobCount; i++) {
      const angle = (i / blobCount) * Math.PI * 2
      const radius = 2 + Math.random() * 1.5
      
      configs.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        ] as [number, number, number],
        color: getColorForState(aiState, i),
        scale: getScaleForState(aiState, i),
        speed: getSpeedForState(aiState, i)
      })
    }
    
    return configs
  }, [blobCount, aiState])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {blobConfigs.map((config) => (
        <AnimatedBlob
          key={config.id}
          position={config.position}
          color={config.color}
          scale={config.scale}
          speed={config.speed}
          aiState={aiState}
        />
      ))}
      
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[chromaIntensity * 0.002, chromaIntensity * 0.001]}
        />
      </EffectComposer>
    </>
  )
}

function getColorForState(state: string, index: number): string {
  const colors = {
    idle: ['#4A90E2', '#7B68EE', '#9370DB', '#6A5ACD', '#483D8B'],
    listening: ['#50C878', '#00FF7F', '#32CD32', '#7CFC00', '#ADFF2F'],
    thinking: ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500'],
    speaking: ['#FF69B4', '#FF1493', '#DC143C', '#B22222', '#8B0000']
  }
  
  const stateColors = colors[state as keyof typeof colors] || colors.idle
  return stateColors[index % stateColors.length]
}

function getScaleForState(state: string, index: number): number {
  const scales = {
    idle: 0.8 + index * 0.1,
    listening: 1.2 + Math.sin(index) * 0.3,
    thinking: 0.6 + Math.cos(index) * 0.4,
    speaking: 1.0 + index * 0.2
  }
  
  return scales[state as keyof typeof scales] || scales.idle
}

function getSpeedForState(state: string, index: number): number {
  const speeds = {
    idle: 0.5 + index * 0.1,
    listening: 1.5 + index * 0.2,
    thinking: 2.0 + Math.random() * 1.0,
    speaking: 1.8 + Math.sin(index) * 0.5
  }
  
  return speeds[state as keyof typeof speeds] || speeds.idle
}