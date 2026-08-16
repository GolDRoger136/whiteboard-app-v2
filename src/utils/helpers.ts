import { Point, Stroke } from '../types/drawing';

let idCounter = 0;

/** Generates a unique-enough id for a stroke within a single app session. */
export function generateId(): string {
  idCounter += 1;
  return `stroke-${Date.now()}-${idCounter}`;
}

/** Converts a list of points into an SVG path "d" attribute using straight segments. */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y} L ${p.x} ${p.y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

/** Returns true if `point` is close enough to any segment of `stroke` to count as a hit. */
export function isPointNearStroke(point: Point, stroke: Stroke, threshold: number): boolean {
  const pts = stroke.points;
  if (pts.length === 0) return false;

  const effectiveThreshold = threshold + stroke.width / 2;

  if (pts.length === 1) {
    return Math.hypot(point.x - pts[0].x, point.y - pts[0].y) <= effectiveThreshold;
  }

  for (let i = 0; i < pts.length - 1; i += 1) {
    if (distanceToSegment(point, pts[i], pts[i + 1]) <= effectiveThreshold) {
      return true;
    }
  }
  return false;
}
