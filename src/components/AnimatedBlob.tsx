import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3, Color } from 'three'
import { MeshDistortMaterial } from '@react-three/drei'
import { useControls } from 'leva'

interface AnimatedBlobProps {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking'
}

export function AnimatedBlob({ position, color, scale, speed, aiState }: AnimatedBlobProps) {
  const meshRef = useRef<Mesh>(null)
  const timeRef = useRef(0)
  
  const {
    distortionScale,
    roughness,
    metalness,
    emissiveIntensity
  } = useControls('Blob Material', {
    distortionScale: { value: 0.4, min: 0, max: 2, step: 0.1 },
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 0.8, min: 0, max: 1, step: 0.1 },
    emissiveIntensity: { value: 0.3, min: 0, max: 1, step: 0.1 }
  })

  // Create dynamic geometry based on AI state
  const geometry = useMemo(() => {
    const baseRadius = 0.8
    const detail = aiState === 'thinking' ? 32 : 16
    return { radius: baseRadius, widthSegments: detail, heightSegments: detail }
  }, [aiState])

  // Animation parameters based on AI state
  const animationConfig = useMemo(() => {
    switch (aiState) {
      case 'idle':
        return {
          distortSpeed: 0.5,
          distortIntensity: 0.2,
          rotationSpeed: 0.3,
          floatAmplitude: 0.5,
          pulseIntensity: 0.1
        }
      case 'listening':
        return {
          distortSpeed: 1.5,
          distortIntensity: 0.6,
          rotationSpeed: 0.8,
          floatAmplitude: 1.2,
          pulseIntensity: 0.4
        }
      case 'thinking':
        return {
          distortSpeed: 2.0,
          distortIntensity: 0.8,
          rotationSpeed: 1.2,
          floatAmplitude: 0.3,
          pulseIntensity: 0.6
        }
      case 'speaking':
        return {
          distortSpeed: 1.8,
          distortIntensity: 0.7,
          rotationSpeed: 1.0,
          floatAmplitude: 0.8,
          pulseIntensity: 0.5
        }
      default:
        return {
          distortSpeed: 0.5,
          distortIntensity: 0.2,
          rotationSpeed: 0.3,
          floatAmplitude: 0.5,
          pulseIntensity: 0.1
        }
    }
  }, [aiState])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    timeRef.current += delta * speed

    const { 
      distortSpeed, 
      distortIntensity, 
      rotationSpeed, 
      floatAmplitude, 
      pulseIntensity 
    } = animationConfig

    // Rotation animation
    meshRef.current.rotation.x += delta * rotationSpeed * 0.5
    meshRef.current.rotation.y += delta * rotationSpeed * 0.7
    meshRef.current.rotation.z += delta * rotationSpeed * 0.3

    // Floating animation
    meshRef.current.position.y = 
      position[1] + Math.sin(timeRef.current * 0.8) * floatAmplitude

    // Orbital movement
    const orbitRadius = 0.5
    meshRef.current.position.x = 
      position[0] + Math.cos(timeRef.current * 0.4) * orbitRadius
    meshRef.current.position.z = 
      position[2] + Math.sin(timeRef.current * 0.6) * orbitRadius

    // Scale pulsing
    const pulseScale = 1 + Math.sin(timeRef.current * 2) * pulseIntensity
    meshRef.current.scale.setScalar(scale * pulseScale)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry 
        args={[geometry.radius, geometry.widthSegments, geometry.heightSegments]} 
      />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={roughness}
        metalness={metalness}
        distort={distortionScale}
        speed={animationConfig.distortSpeed}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}