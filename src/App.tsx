import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { AIVisualizer } from './components/AIVisualizer'
import { Controls } from './components/Controls'

export default function App() {
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'radial-gradient(circle, #0a0a1a 0%, #000000 100%)' }}
      >
        <AIVisualizer aiState={aiState} />
      </Canvas>
      
      <Controls aiState={aiState} setAiState={setAiState} />
      <Leva collapsed />
    </>
  )
}