import { useState } from 'react'

interface ControlsProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout'
  setAiState: (state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'glitchout') => void
}

export function Controls({ aiState, setAiState }: ControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  const states = [
    { key: 'idle', label: 'Idle', color: '#4A90E2' },
    { key: 'listening', label: 'Listening', color: '#50C878' },
    { key: 'thinking', label: 'Thinking', color: '#FFD700' },
    { key: 'speaking', label: 'Speaking', color: '#FF69B4' },
    { key: 'glitchout', label: 'Glitchout', color: '#FF0066' }
  ] as const

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          marginBottom: isVisible ? '15px' : '0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isVisible ? '✕' : '⚙️'}
      </button>

      {/* Controls Panel */}
      {isVisible && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animation: 'fadeInUp 0.3s ease-out',
        }}>
          <div style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}>
            AI Companion Visualizer
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '200px'
          }}>
            {states.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setAiState(key)}
                style={{
                  padding: '8px 16px',
                  border: `2px solid ${color}`,
                  borderRadius: '25px',
                  background: aiState === key 
                    ? `linear-gradient(135deg, ${color}40, ${color}20)`
                    : 'rgba(0,0,0,0.5)',
                  color: aiState === key ? color : 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  fontWeight: aiState === key ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  textShadow: aiState === key ? `0 0 10px ${color}` : 'none',
                  boxShadow: aiState === key 
                    ? `0 0 20px ${color}40, inset 0 0 20px ${color}10`
                    : '0 2px 10px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (aiState !== key) {
                    e.currentTarget.style.background = `rgba(255,255,255,0.1)`
                    e.currentTarget.style.color = color
                  }
                }}
                onMouseLeave={(e) => {
                  if (aiState !== key) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            marginTop: '10px',
            maxWidth: '200px'
          }}>
            Current state: <span style={{ color: states.find(s => s.key === aiState)?.color }}>
              {states.find(s => s.key === aiState)?.label}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}