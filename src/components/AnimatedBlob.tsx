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
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout'
  layerIndex: number
}

export function AnimatedBlob({ position, color, scale, speed, aiState, layerIndex }: AnimatedBlobProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const timeRef = useRef(0)
  const lastStateRef = useRef(aiState)
  const transitionTimeRef = useRef(0)
  const glitchStartTimeRef = useRef(0)
  const postGlitchTransitionRef = useRef(0)

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

    // Track state transitions
    if (lastStateRef.current !== 'glitchout' && aiState === 'glitchout') {
      glitchStartTimeRef.current = 0 // Start glitch transition
      postGlitchTransitionRef.current = 0
    }
    if (lastStateRef.current === 'glitchout' && aiState !== 'glitchout') {
      transitionTimeRef.current = 0 // Start transition back to normal
      postGlitchTransitionRef.current = 0 // Start post-glitch transition
    }
    if (aiState !== 'glitchout') {
      transitionTimeRef.current += delta
      if (lastStateRef.current === 'glitchout') {
        postGlitchTransitionRef.current += delta
      }
    }
    if (aiState === 'glitchout') {
      glitchStartTimeRef.current += delta
    }
    lastStateRef.current = aiState

    // Simple organic movement
    const time = timeRef.current
    let floatX = Math.sin(time * 0.8 + layerIndex * 1.2) * 0.4
    let floatY = Math.cos(time * 0.6 + layerIndex * 0.9) * 0.4
    let floatZ = Math.sin(time * 0.4 + layerIndex * 1.5) * 0.3
    
    // Glitch effects for glitchout state - center and minimize movement
    if (aiState === 'glitchout') {
      // Smooth transition into glitch over 0.3 seconds
      const glitchProgress = Math.min(glitchStartTimeRef.current / 0.3, 1)
      const easedGlitchProgress = glitchProgress * glitchProgress * (3 - 2 * glitchProgress)
      
      // Reduce organic movement but don't eliminate it completely
      const movementReduction = 0.85 * easedGlitchProgress // Reduce to 15% of normal movement
      floatX *= (1 - movementReduction)
      floatY *= (1 - movementReduction)
      floatZ *= (1 - movementReduction)
      
      // Add "breaking" oscillation effect that decreases as it contracts
      const breakingIntensity = (1 - glitchProgress) * 0.4 // Starts at 0.4, fades to 0
      const breakingFreq = 15 + layerIndex * 2.5 // Slightly different frequency per blob
      const breakingX = Math.sin(timeRef.current * breakingFreq + layerIndex * 3.7) * breakingIntensity
      const breakingY = Math.cos(timeRef.current * breakingFreq * 0.8 + layerIndex * 2.1) * breakingIntensity
      const breakingZ = Math.sin(timeRef.current * breakingFreq * 1.2 + layerIndex * 4.3) * breakingIntensity * 0.5
      
      // Pull the base position toward center partially (60% instead of 100%)
      const centerX = -position[0] * easedGlitchProgress * 0.6
      const centerY = -position[1] * easedGlitchProgress * 0.6
      const centerZ = -position[2] * easedGlitchProgress * 0.6
      
      meshRef.current.position.x = position[0] + centerX + floatX + breakingX
      meshRef.current.position.y = position[1] + centerY + floatY + breakingY
      meshRef.current.position.z = position[2] + centerZ + floatZ + breakingZ
      
      transitionTimeRef.current = 0 // Reset transition time during glitch
    } else if (transitionTimeRef.current < 2.0) {
      // Smooth transition back to normal movement over 2 seconds
      const transitionProgress = Math.min(transitionTimeRef.current / 2.0, 1)
      const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress) // Smooth ease
      
      // Gradually restore movement from reduced state back to full
      const movementReduction = 0.85 * (1 - easedProgress) // Start from 85% reduction, restore to 0%
      floatX *= (1 - movementReduction)
      floatY *= (1 - movementReduction)
      floatZ *= (1 - movementReduction)
      
      const centerX = -position[0] * 0.6 * (1 - easedProgress)
      const centerY = -position[1] * 0.6 * (1 - easedProgress)
      const centerZ = -position[2] * 0.6 * (1 - easedProgress)
      
      meshRef.current.position.x = position[0] + centerX + floatX
      meshRef.current.position.y = position[1] + centerY + floatY
      meshRef.current.position.z = position[2] + centerZ + floatZ
    } else if (postGlitchTransitionRef.current < 1.0) {
      // Additional smooth transition to ensure perfect return to idle (1 second)
      const postTransitionProgress = Math.min(postGlitchTransitionRef.current / 1.0, 1)
      const easedPostProgress = postTransitionProgress * postTransitionProgress * (3 - 2 * postTransitionProgress)
      
      // Ensure movement is fully restored with gentle easing
      const movementRestore = easedPostProgress
      floatX *= (0.95 + 0.05 * movementRestore) // Smooth final restoration
      floatY *= (0.95 + 0.05 * movementRestore)
      floatZ *= (0.95 + 0.05 * movementRestore)
      
      meshRef.current.position.x = position[0] + floatX
      meshRef.current.position.y = position[1] + floatY
      meshRef.current.position.z = position[2] + floatZ
    } else {
      // Normal positioning
      meshRef.current.position.x = position[0] + floatX
      meshRef.current.position.y = position[1] + floatY
      meshRef.current.position.z = position[2] + floatZ
    }

    // Breathing effect
    let breathe = 1 + Math.sin(time * 1.2 + layerIndex * 0.7) * 0.15
    
    // Glitch scale effects - shrink much faster and less dramatically
    if (aiState === 'glitchout') {
      // Ultra-fast shrinking over 0.05 seconds
      const shrinkProgress = Math.min(glitchStartTimeRef.current / 0.05, 1)
      const easedShrinkProgress = shrinkProgress * shrinkProgress * (3 - 2 * shrinkProgress)
      
      const shrinkFactor = 1 - (1 - 0.65) * easedShrinkProgress // From 1.0 to 0.65 (less shrinkage)
      breathe *= shrinkFactor
    } else if (transitionTimeRef.current < 2.0) {
      // Smooth transition back to normal size over 2 seconds
      const transitionProgress = Math.min(transitionTimeRef.current / 2.0, 1)
      const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress) // Smooth ease
      
      const shrinkFactor = 0.65 + (1 - 0.65) * easedProgress
      breathe *= shrinkFactor
    } else if (postGlitchTransitionRef.current < 1.0) {
      // Additional smooth scale transition to ensure perfect return to normal breathing
      const postTransitionProgress = Math.min(postGlitchTransitionRef.current / 1.0, 1)
      const easedPostProgress = postTransitionProgress * postTransitionProgress * (3 - 2 * postTransitionProgress)
      
      // Ensure breathing effect is fully restored
      const breathingRestore = easedPostProgress
      const baseBreathing = 1 + Math.sin(time * 1.2 + layerIndex * 0.7) * 0.15
      breathe = baseBreathing * (0.98 + 0.02 * breathingRestore) // Smooth final scale restoration
    }
    
    meshRef.current.scale.setScalar(scale * breathe)

    // Dynamic opacity for varying solidness
    const baseOpacity = 0.8
    const opacityVariation = Math.sin(time * 0.3 + layerIndex * 2.1) * 0.25 + 
                            Math.cos(time * 0.7 + layerIndex * 1.8) * 0.15
    let dynamicOpacity = baseOpacity + opacityVariation
    
    // Glitch opacity effects - keep them more visible
    if (aiState === 'glitchout') {
      // Smooth transition to high opacity over 0.3 seconds
      const glitchProgress = Math.min(glitchStartTimeRef.current / 0.3, 1)
      const easedGlitchProgress = glitchProgress * glitchProgress * (3 - 2 * glitchProgress)
      
      const normalOpacity = baseOpacity + opacityVariation
      const glitchOpacity = 0.9
      dynamicOpacity = normalOpacity + (glitchOpacity - normalOpacity) * easedGlitchProgress
    } else if (transitionTimeRef.current < 2.0) {
      // Smooth transition back to normal opacity
      const transitionProgress = Math.min(transitionTimeRef.current / 2.0, 1)
      const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress)
      
      const glitchOpacity = 0.9
      const normalOpacity = baseOpacity + opacityVariation
      dynamicOpacity = glitchOpacity + (normalOpacity - glitchOpacity) * easedProgress
    } else if (postGlitchTransitionRef.current < 1.0) {
      // Additional smooth opacity transition
      const postTransitionProgress = Math.min(postGlitchTransitionRef.current / 1.0, 1)
      const easedPostProgress = postTransitionProgress * postTransitionProgress * (3 - 2 * postTransitionProgress)
      
      // Ensure opacity variations are fully restored
      const normalOpacity = baseOpacity + opacityVariation
      dynamicOpacity = normalOpacity * (0.98 + 0.02 * easedPostProgress) // Smooth final opacity restoration
    }
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uOpacity.value = Math.max(0.1, Math.min(1.0, dynamicOpacity))
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