import React, { useMemo, useRef } from 'react';
import { GestureResponderEvent, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Stroke } from '../types/drawing';
import { pointsToPath } from '../utils/helpers';

interface DrawingCanvasProps {
  strokes: Stroke[];
  currentStroke: Stroke | null;
  onStart: (x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

function StrokeShape({ stroke }: { stroke: Stroke }) {
  if (stroke.points.length === 1) {
    const p = stroke.points[0];
    return <Circle cx={p.x} cy={p.y} r={stroke.width / 2} fill={stroke.color} />;
  }

  return (
    <Path
      d={pointsToPath(stroke.points)}
      stroke={stroke.color}
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

const MemoStrokeShape = React.memo(StrokeShape);

export default function DrawingCanvas({
  strokes,
  currentStroke,
  onStart,
  onMove,
  onEnd,
}: DrawingCanvasProps) {
  // Keep latest callbacks in a ref so the PanResponder (created once) never
  // holds stale closures, and never needs to be re-created mid-gesture.
  const callbacksRef = useRef({ onStart, onMove, onEnd });
  callbacksRef.current = { onStart, onMove, onEnd };

  const isDrawingRef = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: (evt: GestureResponderEvent) => {
          isDrawingRef.current = true;
          const { locationX, locationY } = evt.nativeEvent;
          callbacksRef.current.onStart(locationX, locationY);
        },

        onPanResponderMove: (evt: GestureResponderEvent) => {
          if (!isDrawingRef.current) return;
          const { locationX, locationY } = evt.nativeEvent;
          callbacksRef.current.onMove(locationX, locationY);
        },

        onPanResponderRelease: () => {
          isDrawingRef.current = false;
          callbacksRef.current.onEnd();
        },

        onPanResponderTerminate: () => {
          isDrawingRef.current = false;
          callbacksRef.current.onEnd();
        },
      }),
    []
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {strokes.map((stroke) => (
          <MemoStrokeShape key={stroke.id} stroke={stroke} />
        ))}
        {currentStroke && <MemoStrokeShape stroke={currentStroke} />}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
