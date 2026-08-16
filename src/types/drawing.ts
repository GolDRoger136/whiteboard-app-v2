export type Tool = 'pen' | 'eraser';

export type BrushSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: Tool;
}

export type HistoryAction =
  | { type: 'draw'; stroke: Stroke }
  | { type: 'erase'; stroke: Stroke; index: number }
  | { type: 'clear'; strokes: Stroke[] };
