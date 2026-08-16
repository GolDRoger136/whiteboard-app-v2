import React, { useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { BRUSH_SIZE_ORDER, BRUSH_SIZES, COLORS } from '../constants/drawing';
import { BrushSize, Tool } from '../types/drawing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FloatingToolbarProps {
  selectedTool: Tool;
  selectedColor: string;
  brushSize: BrushSize;
  canUndo: boolean;
  canRedo: boolean;
  onSelectTool: (tool: Tool) => void;
  onSelectColor: (color: string) => void;
  onSelectBrushSize: (size: BrushSize) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const SIZE_LABELS: Record<BrushSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  xlarge: 'XL',
};

function ToolButton({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.toolButton, active && styles.toolButtonActive, disabled && styles.toolButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.toolButtonText,
          active && styles.toolButtonTextActive,
          disabled && styles.toolButtonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function FloatingToolbar({
  selectedTool,
  selectedColor,
  brushSize,
  canUndo,
  canRedo,
  onSelectTool,
  onSelectColor,
  onSelectBrushSize,
  onUndo,
  onRedo,
  onClear,
}: FloatingToolbarProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleClearPress = () => {
    Alert.alert('Clear Board', 'Are you sure you want to clear all drawings?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: onClear },
    ]);
  };

  if (!expanded) {
    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        <TouchableOpacity style={styles.collapsedButton} onPress={toggleExpanded} activeOpacity={0.7}>
          <Text style={styles.collapsedIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.panel}>
        <TouchableOpacity style={styles.collapseHandle} onPress={toggleExpanded} activeOpacity={0.7}>
          <Text style={styles.collapseHandleText}>▾ collapse</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <ToolButton label="✏️ Pen" active={selectedTool === 'pen'} onPress={() => onSelectTool('pen')} />
          <ToolButton
            label="🧹 Eraser"
            active={selectedTool === 'eraser'}
            onPress={() => onSelectTool('eraser')}
          />
        </View>

        <View style={styles.row}>
          <ToolButton label="↶ Undo" disabled={!canUndo} onPress={onUndo} />
          <ToolButton label="↷ Redo" disabled={!canRedo} onPress={onRedo} />
        </View>

        <View style={styles.row}>
          <ToolButton label="🗑️ Clear" onPress={handleClearPress} />
        </View>

        <View style={styles.divider} />

        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => onSelectColor(c.value)}
              activeOpacity={0.7}
              style={[
                styles.colorSwatch,
                { backgroundColor: c.value },
                selectedColor === c.value && styles.colorSwatchSelected,
              ]}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.sizeRow}>
          {BRUSH_SIZE_ORDER.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => onSelectBrushSize(size)}
              activeOpacity={0.7}
              style={[styles.sizeButton, brushSize === size && styles.sizeButtonSelected]}
            >
              <View
                style={{
                  width: Math.min(BRUSH_SIZES[size], 16),
                  height: Math.min(BRUSH_SIZES[size], 16),
                  borderRadius: 8,
                  backgroundColor: brushSize === size ? '#1E88E5' : '#777777',
                }}
              />
              <Text style={styles.sizeLabel}>{SIZE_LABELS[size]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 15,
    bottom: 20,
    alignItems: 'flex-end',
  },
  collapsedButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  collapsedIcon: {
    fontSize: 24,
  },
  panel: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  collapseHandle: {
    alignSelf: 'center',
    paddingVertical: 4,
    marginBottom: 4,
  },
  collapseHandleText: {
    fontSize: 12,
    color: '#888888',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  toolButton: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  toolButtonActive: {
    backgroundColor: '#1E88E5',
  },
  toolButtonDisabled: {
    opacity: 0.4,
  },
  toolButtonText: {
    fontSize: 12,
    color: '#333333',
  },
  toolButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  toolButtonTextDisabled: {
    color: '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 6,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorSwatch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#1E88E5',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: '#E3F2FD',
  },
  sizeLabel: {
    fontSize: 10,
    color: '#555555',
    marginTop: 2,
  },
});
