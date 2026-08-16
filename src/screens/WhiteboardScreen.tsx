import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuestionPanel from '../components/QuestionPanel';
import DrawingCanvas from '../components/DrawingCanvas';
import FloatingToolbar from '../components/FloatingToolbar';
import { useDrawingState } from '../hooks/useDrawingState';

export default function WhiteboardScreen() {
  const {
    strokes,
    currentStroke,
    selectedTool,
    selectedColor,
    brushSize,
    canUndo,
    canRedo,
    startStroke,
    addPoint,
    endStroke,
    undo,
    redo,
    clearBoard,
    setColor,
    setBrushSize,
    setTool,
  } = useDrawingState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <QuestionPanel />

      <View style={styles.canvasContainer}>
        <DrawingCanvas
          strokes={strokes}
          currentStroke={currentStroke}
          onStart={startStroke}
          onMove={addPoint}
          onEnd={endStroke}
        />

        <FloatingToolbar
          selectedTool={selectedTool}
          selectedColor={selectedColor}
          brushSize={brushSize}
          canUndo={canUndo}
          canRedo={canRedo}
          onSelectTool={setTool}
          onSelectColor={setColor}
          onSelectBrushSize={setBrushSize}
          onUndo={undo}
          onRedo={redo}
          onClear={clearBoard}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvasContainer: {
    flex: 1,
    minHeight: 0,
  },
});
