import { BrushSize } from '../types/drawing';

export interface ColorOption {
  name: string;
  value: string;
}

export const COLORS: ColorOption[] = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#E53935' },
  { name: 'Blue', value: '#1E88E5' },
  { name: 'Green', value: '#43A047' },
  { name: 'Yellow', value: '#FDD835' },
];

export const BRUSH_SIZES: Record<BrushSize, number> = {
  small: 2,
  medium: 5,
  large: 10,
  xlarge: 18,
};

export const BRUSH_SIZE_ORDER: BrushSize[] = ['small', 'medium', 'large', 'xlarge'];

export const DEFAULT_COLOR = COLORS[0].value;
export const DEFAULT_BRUSH_SIZE: BrushSize = 'medium';

// Distance (px) within which a touch point counts as "on" a stroke, for the eraser.
export const ERASER_HIT_DISTANCE = 18;
