interface GrainEffectProps {
  intensity?: number
  opacity?: number
  size?: number
  animate?: boolean
}

export function GrainEffect({ 
  intensity = 0.8, 
  opacity = 0.15, 
  size = 128,
  animate = false 
}: GrainEffectProps) {
  const filterId = `grain-filter-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
        opacity: opacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={1.2}
              numOctaves={3}
              result="noise"
              type="fractalNoise"
              seed="2"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="monoNoise"
            />
            <feComponentTransfer in="monoNoise" result="grain">
              <feFuncA type="discrete" tableValues={`0 ${intensity * 0.3} ${intensity * 0.8} ${intensity} ${intensity * 0.6} 0 ${intensity * 0.4}`} />
            </feComponentTransfer>
            <feBlend
              in="grain"
              in2="SourceGraphic"
              mode="multiply"
            />
          </filter>
        </defs>
        
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  )
}