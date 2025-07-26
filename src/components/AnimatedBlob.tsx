import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Vector3 } from 'three'
import { shaderMaterial } from '@react-three/drei'

// Enhanced blob shader with chromatic aberration
const BlobShader = shaderMaterial(
  {
    uColor: new Vector3(1, 0, 1),
    uOpacity: 0.8,
    uTime: 0.0,
    uAberration: 0.01
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader with chromatic aberration
  `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    uniform float uAberration;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      
      // Periodic chromatic aberration offset
      float aberrationStrength = sin(uTime * 2.0) * uAberration;
      vec2 direction = normalize(vUv - center);
      
      // Sample each color channel with slight offset
      vec2 offsetR = vUv + direction * aberrationStrength * 1.5;
      vec2 offsetG = vUv + direction * aberrationStrength * 0.5;
      vec2 offsetB = vUv - direction * aberrationStrength * 1.0;
      
      // Calculate distance for each channel
      float distR = distance(offsetR, center);
      float distG = distance(offsetG, center);
      float distB = distance(offsetB, center);
      
      // Create the blob shape with soft edges for each channel
      float alphaR = 1.0 - smoothstep(0.15, 0.45, distR);
      float alphaG = 1.0 - smoothstep(0.15, 0.45, distG);
      float alphaB = 1.0 - smoothstep(0.15, 0.45, distB);
      
      // Combine channels with chromatic aberration
      vec3 finalColor = vec3(
        uColor.r * alphaR,
        uColor.g * alphaG,
        uColor.b * alphaB
      );
      
      // Use the green channel alpha as the main alpha
      float finalAlpha = alphaG * uOpacity;
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
)

extend({ BlobShader })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      blobShader: any
    }
  }
}

interface AnimatedBlobProps {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking'
  layerIndex: number
}

export function AnimatedBlob({ position, color, scale, speed, aiState, layerIndex }: AnimatedBlobProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const timeRef = useRef(0)

  // Convert hex to RGB
  const colorVector = useMemo(() => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    return new Vector3(r, g, b)
  }, [color])

  useFrame((_state, delta) => {
    if (!meshRef.current || !materialRef.current) return
    
    timeRef.current += delta * speed

    // Simple organic movement
    const time = timeRef.current
    const floatX = Math.sin(time * 0.8 + layerIndex * 1.2) * 0.4
    const floatY = Math.cos(time * 0.6 + layerIndex * 0.9) * 0.4
    const floatZ = Math.sin(time * 0.4 + layerIndex * 1.5) * 0.3
    
    meshRef.current.position.x = position[0] + floatX
    meshRef.current.position.y = position[1] + floatY
    meshRef.current.position.z = position[2] + floatZ

    // Breathing effect
    const breathe = 1 + Math.sin(time * 1.2 + layerIndex * 0.7) * 0.15
    meshRef.current.scale.setScalar(scale * breathe)

    // Dynamic opacity for varying solidness
    const baseOpacity = 0.8
    const opacityVariation = Math.sin(time * 0.3 + layerIndex * 2.1) * 0.25 + 
                            Math.cos(time * 0.7 + layerIndex * 1.8) * 0.15
    const dynamicOpacity = baseOpacity + opacityVariation
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uOpacity.value = Math.max(0.4, Math.min(1.0, dynamicOpacity))
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[3, 3]} />
      <blobShader
        ref={materialRef}
        uColor={colorVector}
        uOpacity={0.8}
        uTime={0}
        uAberration={0.01}
        transparent
        depthWrite={false}
        blending={2}
      />
    </mesh>
  )
}