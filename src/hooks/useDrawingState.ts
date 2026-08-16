import { useCallback, useState } from 'react';
import { BrushSize, HistoryAction, Stroke, Tool } from '../types/drawing';
import { BRUSH_SIZES, DEFAULT_BRUSH_SIZE, DEFAULT_COLOR, ERASER_HIT_DISTANCE } from '../constants/drawing';
import { generateId, isPointNearStroke } from '../utils/helpers';

export function useDrawingState() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<BrushSize>(DEFAULT_BRUSH_SIZE);

  const [undoStack, setUndoStack] = useState<HistoryAction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([]);

  // Tracks which strokes have already been erased during the current
  // finger-down gesture, so dragging over the same stroke twice doesn't
  // push duplicate undo entries.
  const [erasedInGesture, setErasedInGesture] = useState<Set<string>>(new Set());

  const eraseStrokeAt = useCallback(
    (x: number, y: number, alreadyErased: Set<string>) => {
      const hit = strokes.find(
        (s) => !alreadyErased.has(s.id) && isPointNearStroke({ x, y }, s, ERASER_HIT_DISTANCE)
      );
      if (!hit) return;

      const index = strokes.indexOf(hit);
      setErasedInGesture((prev) => new Set(prev).add(hit.id));
      setStrokes((prev) => prev.filter((s) => s.id !== hit.id));
      setUndoStack((prev) => [...prev, { type: 'erase', stroke: hit, index }]);
      setRedoStack([]);
    },
    [strokes]
  );

  const startStroke = useCallback(
    (x: number, y: number) => {
      if (selectedTool === 'eraser') {
        setErasedInGesture(new Set());
        eraseStrokeAt(x, y, new Set());
        return;
      }

      setCurrentStroke({
        id: generateId(),
        points: [{ x, y }],
        color: selectedColor,
        width: BRUSH_SIZES[brushSize],
        tool: 'pen',
      });
    },
    [selectedTool, selectedColor, brushSize, eraseStrokeAt]
  );

  const addPoint = useCallback(
    (x: number, y: number) => {
      if (selectedTool === 'eraser') {
        eraseStrokeAt(x, y, erasedInGesture);
        return;
      }

      setCurrentStroke((prev) => {
        if (!prev) return prev;
        return { ...prev, points: [...prev.points, { x, y }] };
      });
    },
    [selectedTool, eraseStrokeAt, erasedInGesture]
  );

  const endStroke = useCallback(() => {
    if (selectedTool === 'eraser') {
      setErasedInGesture(new Set());
      return;
    }

    if (currentStroke && currentStroke.points.length > 0) {
      const finished = currentStroke;
      setStrokes((prev) => [...prev, finished]);
      setUndoStack((prev) => [...prev, { type: 'draw', stroke: finished }]);
      setRedoStack([]);
    }
    setCurrentStroke(null);
  }, [selectedTool, currentStroke]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, action]);

    if (action.type === 'draw') {
      setStrokes((prev) => prev.filter((s) => s.id !== action.stroke.id));
    } else if (action.type === 'erase') {
      setStrokes((prev) => {
        const next = [...prev];
        const idx = Math.min(action.index, next.length);
        next.splice(idx, 0, action.stroke);
        return next;
      });
    } else if (action.type === 'clear') {
      setStrokes(action.strokes);
    }
  }, [undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, action]);

    if (action.type === 'draw') {
      setStrokes((prev) => [...prev, action.stroke]);
    } else if (action.type === 'erase') {
      setStrokes((prev) => prev.filter((s) => s.id !== action.stroke.id));
    } else if (action.type === 'clear') {
      setStrokes([]);
    }
  }, [redoStack]);

  const clearBoard = useCallback(() => {
    if (strokes.length === 0) return;
    setUndoStack((prev) => [...prev, { type: 'clear', strokes }]);
    setRedoStack([]);
    setStrokes([]);
  }, [strokes]);

  return {
    strokes,
    currentStroke,
    selectedTool,
    selectedColor,
    brushSize,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    startStroke,
    addPoint,
    endStroke,
    undo,
    redo,
    clearBoard,
    setColor: setSelectedColor,
    setBrushSize,
    setTool: setSelectedTool,
  };
}
