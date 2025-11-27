# Live Maps Tracking Component

Clean and modular implementation of Strava-like live tracking maps.

## Structure

```
liveMaps/
├── liveMapslayoutt.tsx          # Main component
├── hooks/
│   └── useLocationTracking.ts   # Custom hook for GPS tracking logic
└── components/
    ├── StatsDisplay.tsx         # Stats overlay component
    └── ControlButtons.tsx       # Control buttons component
```

## Features

- ✅ Real-time GPS tracking with high accuracy
- ✅ Live stats display (duration, distance, speed, pace)
- ✅ Route visualization with polyline
- ✅ Start/end markers
- ✅ Auto-centering camera on user location
- ✅ Distance calculation using Haversine formula
- ✅ Outlier filtering for GPS accuracy
- ✅ Clean Strava-inspired UI

## Usage

```tsx
import LiveMapslayoutt from "@/components/liveMaps/liveMapslayoutt";

export default function TrackingScreen() {
  return <LiveMapslayoutt />;
}
```

## Key Logic

### Distance Calculation

Uses Haversine formula for accurate distance between GPS coordinates:

```typescript
distance = 2 * R * arctan2(√a, √(1-a))
```

### Outlier Filtering

- Filters points with accuracy > 50 meters
- Rejects jumps with implied speed > 20 m/s (72 km/h)
- Prevents GPS drift from affecting stats

### Stats Calculation

- **Duration**: Elapsed time from start
- **Distance**: Cumulative haversine distance
- **Current Speed**: From GPS provider or calculated
- **Avg Pace**: Total duration / distance (min/km format)

## Configuration

### Android (app.json)

```json
{
  "android": {
    "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}
```

### iOS (app.json)

```json
{
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "...",
      "NSLocationAlwaysAndWhenInUseUsageDescription": "..."
    },
    "config": {
      "googleMapsApiKey": "YOUR_API_KEY"
    }
  }
}
```

## Dependencies

- `react-native-maps` - Map rendering
- `expo-location` - GPS tracking
- `react-native-config` - Environment variables

## Best Practices Applied

1. **Separation of Concerns**: Logic separated into custom hooks
2. **Component Modularity**: Small, reusable components
3. **Clean Code**: Self-documenting with clear naming
4. **Performance**: Efficient state updates and filtering
5. **User Experience**: Smooth animations and clear feedback
6. **Type Safety**: Full TypeScript support

## Future Enhancements

- [ ] Save tracking history to backend
- [ ] Offline mode with local storage
- [ ] Snap-to-roads API integration
- [ ] Elevation gain tracking
- [ ] Segment detection
- [ ] Social sharing features
