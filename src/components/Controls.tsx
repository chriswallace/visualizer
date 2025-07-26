

interface ControlsProps {
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking'
  setAiState: (state: 'idle' | 'listening' | 'thinking' | 'speaking') => void
}

export function Controls({ aiState, setAiState }: ControlsProps) {
  const states = [
    { key: 'idle', label: 'Idle', color: '#4A90E2' },
    { key: 'listening', label: 'Listening', color: '#50C878' },
    { key: 'thinking', label: 'Thinking', color: '#FFD700' },
    { key: 'speaking', label: 'Speaking', color: '#FF69B4' }
  ] as const

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
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
        gap: '8px',
        flexWrap: 'wrap'
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
  )
}