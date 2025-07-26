# AI Companion Visualizer

A dynamic, interactive visualizer for AI companion applications built with React Three Fiber. Features morphing blobs of color that shift, blur, and animate in response to different AI states (idle, listening, thinking, speaking).

## Features

- **Dynamic Blob Animation**: Morphing spheres with distortion effects that respond to AI states
- **State-Based Color Transitions**: Different color palettes for each AI state
  - 🔵 **Idle**: Cool blues and purples
  - 🟢 **Listening**: Vibrant greens
  - 🟡 **Thinking**: Warm oranges and yellows
  - 🔴 **Speaking**: Energetic pinks and reds
- **Real-time Controls**: Interactive UI to switch between AI states
- **Post-processing Effects**: Bloom and chromatic aberration for enhanced visuals
- **Customizable Parameters**: Real-time tweaking via Leva controls

## Technology Stack

- **React 18** - UI framework
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and materials
- **@react-three/postprocessing** - Post-processing effects
- **Three.js** - 3D graphics library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Leva** - GUI controls for real-time tweaking

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Launch the visualizer**: Run `npm run dev` and open your browser
2. **Switch AI states**: Use the control buttons in the top-left corner
3. **Adjust parameters**: Open the Leva panel (collapsed by default) to fine-tune:
   - Blob count and appearance
   - Material properties (distortion, roughness, metalness)
   - Post-processing effects (bloom intensity, chromatic aberration)

## AI State Behaviors

### Idle State
- Gentle floating and rotation
- Subtle pulsing
- Cool blue/purple color palette
- Low distortion and movement speed

### Listening State
- Increased animation speed
- Higher amplitude movements
- Vibrant green colors
- Enhanced pulsing to suggest attentiveness

### Thinking State
- Rapid, chaotic movements
- High distortion effects
- Warm orange/yellow colors
- Irregular pulsing patterns

### Speaking State
- Rhythmic, expressive animations
- Moderate to high distortion
- Pink/red color scheme
- Coordinated movement patterns

## Customization

The visualizer is highly customizable through several mechanisms:

### Leva Controls
- **Global Effects**: Adjust blob count, bloom intensity, chromatic aberration
- **Blob Material**: Control distortion scale, roughness, metalness, emissive intensity

### Code Customization
- Modify color palettes in `AIVisualizer.tsx`
- Adjust animation parameters in `AnimatedBlob.tsx`
- Add new AI states by extending the state types and configurations

## Project Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Main application component
└── components/
    ├── AIVisualizer.tsx  # Main visualizer orchestrator
    ├── AnimatedBlob.tsx  # Individual blob component
    └── Controls.tsx      # UI controls for state switching
```

## Performance Considerations

- Uses efficient Three.js rendering with React Three Fiber
- Post-processing effects are optimized for real-time performance
- Geometry detail adapts based on AI state (higher detail for thinking state)
- Configurable blob count for performance tuning

## Browser Compatibility

- Modern browsers with WebGL support
- Optimized for Chrome, Firefox, Safari, and Edge
- Mobile devices with sufficient GPU capabilities

## Contributing

Feel free to contribute by:
- Adding new AI states
- Implementing additional visual effects
- Improving performance optimizations
- Enhancing the user interface

## License

This project is open source and available under the MIT License.
