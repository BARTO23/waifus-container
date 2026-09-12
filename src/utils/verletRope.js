/**
 * Verlet-integration rope physics for the character-detail modal's fact
 * callouts (pin on the portrait -> fact block). Position-based dynamics per
 * Jakobsen's "Advanced Character Physics": both ends are pinned, gravity
 * pulls the interior points down each tick, and iterative distance-constraint
 * solving keeps adjacent points a fixed distance apart, so the chain settles
 * into a natural hanging sag on its own instead of an eased/keyframed curve.
 *
 * Ported verbatim (constants included) from the design-canvas prototype,
 * where gravity/damping/wind/segment count were already tuned and visually
 * verified — do not re-tune these without re-verifying the modal by eye.
 */

export const ROPE_SEGMENTS = 7; // 8 points: 2 pinned anchors + 6 simulated links
export const GRAVITY = 0.44; // px per tick^2
export const DAMPING = 0.985; // velocity retained per tick (loses energy -> settles)
export const CONSTRAINT_ITERATIONS = 6;
export const WIND_AMPLITUDE = 0.036; // tiny perpetual perturbation so it never fully sleeps

// Snaps the rendered line to a 3px grid — the simulated points still move
// continuously underneath; only the drawn path looks stepped/blocky.
const PIXEL_GRID = 3;
function snapPx(v) {
  return Math.round(v / PIXEL_GRID) * PIXEL_GRID;
}

export class Rope {
  constructor() {
    this.points = [];
    this.oldPoints = [];
    this.pinned = [];
    this.restLength = 0;
    this.start = { x: 0, y: 0 };
    this.end = { x: 0, y: 0 };
  }

  /**
   * Reinitializes the rope along the straight line between `start` and
   * `end`. With `sagOnly` true, applies a closed-form parabolic sag instead
   * of relying on simulation — used for the reduced-motion static pose,
   * where no per-frame stepping ever runs.
   */
  reset(start, end, sagOnly) {
    this.start = start;
    this.end = end;
    this.points = [];
    this.oldPoints = [];
    this.pinned = [];
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    this.restLength = Math.max(dist / ROPE_SEGMENTS, 1);
    for (let i = 0; i <= ROPE_SEGMENTS; i++) {
      const t = i / ROPE_SEGMENTS;
      let x = start.x + (end.x - start.x) * t;
      let y = start.y + (end.y - start.y) * t;
      if (sagOnly) y += Math.sin(t * Math.PI) * (dist * 0.072);
      this.points.push({ x, y });
      this.oldPoints.push({ x, y });
      this.pinned.push(i === 0 || i === ROPE_SEGMENTS);
    }
  }

  /** Moves the anchors without resetting the simulated shape (e.g. on resize). */
  updateAnchors(start, end) {
    this.start = start;
    this.end = end;
  }

  /** Advances the simulation by one tick. */
  step(windPhase, ropeIndex, impulseX, impulseY) {
    const pts = this.points;
    const old = this.oldPoints;
    for (let i = 0; i < pts.length; i++) {
      if (this.pinned[i]) continue;
      const p = pts[i];
      const o = old[i];
      const vx = (p.x - o.x) * DAMPING;
      const vy = (p.y - o.y) * DAMPING;
      const wind = Math.sin(windPhase + i * 0.9 + ropeIndex * 2.1) * WIND_AMPLITUDE;
      const nx = p.x + vx + wind + (impulseX || 0);
      const ny = p.y + vy + GRAVITY + (impulseY || 0);
      old[i] = { x: p.x, y: p.y };
      p.x = nx;
      p.y = ny;
    }
    pts[0].x = this.start.x;
    pts[0].y = this.start.y;
    const last = pts.length - 1;
    pts[last].x = this.end.x;
    pts[last].y = this.end.y;
    for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
      for (let s = 0; s < pts.length - 1; s++) {
        const a = pts[s];
        const b = pts[s + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (dist - this.restLength) / dist;
        const ax = dx * 0.5 * diff;
        const ay = dy * 0.5 * diff;
        if (!this.pinned[s]) {
          a.x += ax;
          a.y += ay;
        }
        if (!this.pinned[s + 1]) {
          b.x -= ax;
          b.y -= ay;
        }
      }
      pts[0].x = this.start.x;
      pts[0].y = this.start.y;
      pts[last].x = this.end.x;
      pts[last].y = this.end.y;
    }
  }

  /** Serializes the current point set to an SVG path `d` string. */
  toPathD() {
    let d = `M ${snapPx(this.points[0].x)} ${snapPx(this.points[0].y)}`;
    for (let i = 1; i < this.points.length; i++) {
      d += ` L ${snapPx(this.points[i].x)} ${snapPx(this.points[i].y)}`;
    }
    return d;
  }
}

// Scales a raw per-frame window/scroll-position delta down to something a
// chain can absorb as an impulse rather than a teleport, and clamps it so a
// window snapping to another monitor (or a fast wheel scroll) can't launch
// the rope off-screen.
const WINDOW_IMPULSE_SCALE = 0.176;
const WINDOW_IMPULSE_MAX = 5.6;
export function clampImpulse(v) {
  const scaled = v * WINDOW_IMPULSE_SCALE;
  return Math.max(-WINDOW_IMPULSE_MAX, Math.min(WINDOW_IMPULSE_MAX, scaled));
}
