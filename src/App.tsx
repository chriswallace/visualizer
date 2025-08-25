import { Canvas } from '@react-three/fiber'
import { AIVisualizer } from './components/AIVisualizer'

export default function App() {
  const aiState = 'idle'



  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: '#f2f2f2' }}
      >
        <AIVisualizer aiState={aiState} />
      </Canvas>
    </>
  )
}