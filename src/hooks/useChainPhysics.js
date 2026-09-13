import { useCallback, useEffect, useRef } from 'react';
import { Rope, clampImpulse } from '../utils/verletRope';

/**
 * Orchestrates the character-detail modal's Verlet-rope chains: drops them
 * into a fresh sag whenever the modal opens, runs the per-frame simulation
 * (or a single static pose under reduced motion), and reacts to layout
 * changes and to the window/scroll "jostle" impulses — mirrors the
 * design-canvas prototype's `_startPhysics`/`_stopPhysics`/`_dropRopes`/
 * `_remeasure`/`_paintOnce`/`_windowImpulse`/`_scrollImpulse`/`_tick`.
 *
 * @param {boolean} isOpen - Whether the modal is currently mounted (not the
 *   fade-visible flag — physics starts as soon as the DOM anchors exist, the
 *   same timing the canvas used from `componentDidUpdate`).
 * @param {number} count - Number of ropes (one per rendered fact callout).
 * @param {object} scrollSourceRef - Ref to the element whose `scrollTop`
 *   drives the scroll-reactivity impulse (the modal panel's own scrollable
 *   body, not `window`).
 */
export function useChainPhysics(isOpen, count, scrollSourceRef) {
  const pinRefs = useRef([]);
  const factRefs = useRef([]);
  const pathRefs = useRef([]);
  const stageWrapRef = useRef(null);
  const svgRef = useRef(null);
  const ropesRef = useRef([]);
  const rafRef = useRef(null);
  const roRef = useRef(null);
  const windPhaseRef = useRef(0);
  const lastScreenRef = useRef({ x: null, y: null });
  const lastScrollYRef = useRef(null);

  if (ropesRef.current.length !== count) {
    ropesRef.current = Array.from({ length: count }, () => new Rope());
  }

  const getPinRef = useCallback((i) => (el) => { pinRefs.current[i] = el; }, []);
  const getFactRef = useCallback((i) => (el) => { factRefs.current[i] = el; }, []);
  const getPathRef = useCallback((i) => (el) => { pathRefs.current[i] = el; }, []);

  const anchorsFor = useCallback((i) => {
    const pin = pinRefs.current[i];
    const fact = factRefs.current[i];
    const svg = svgRef.current;
    if (!pin || !fact || !svg) return null;
    const svgRect = svg.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const factRect = fact.getBoundingClientRect();
    return {
      start: {
        x: pinRect.left + pinRect.width / 2 - svgRect.left,
        y: pinRect.top + pinRect.height / 2 - svgRect.top,
      },
      end: {
        x: factRect.left - svgRect.left + 4,
        y: factRect.top + factRect.height / 2 - svgRect.top,
      },
    };
  }, []);

  // Re-drop: reinitialize each rope along the straight line between its
  // (freshly measured) anchors and let physics settle it from scratch — this
  // is what gives the visible "falls and catches" moment on open.
  const dropRopes = useCallback(() => {
    for (let i = 0; i < ropesRef.current.length; i++) {
      const anchors = anchorsFor(i);
      if (!anchors) continue;
      ropesRef.current[i].reset(anchors.start, anchors.end, false);
    }
  }, [anchorsFor]);

  // Resize: move the anchors without resetting the simulated shape, so the
  // chain visibly reacts to the new geometry instead of snapping. Re-seeds
  // the scroll baseline too — a ResizeObserver-triggered reflow can clamp
  // `scrollTop`, which would otherwise inject a spurious one-frame impulse
  // from stale vs. new scrollTop.
  const remeasure = useCallback(() => {
    for (let i = 0; i < ropesRef.current.length; i++) {
      const anchors = anchorsFor(i);
      if (anchors) ropesRef.current[i].updateAnchors(anchors.start, anchors.end);
    }
    lastScrollYRef.current = null;
  }, [anchorsFor]);

  const paintOnce = useCallback(() => {
    for (let i = 0; i < ropesRef.current.length; i++) {
      const anchors = anchorsFor(i);
      if (!anchors) continue;
      ropesRef.current[i].reset(anchors.start, anchors.end, true);
      if (pathRefs.current[i]) {
        pathRefs.current[i].setAttribute('d', ropesRef.current[i].toPathD());
      }
    }
  }, [anchorsFor]);

  // Reads the browser window's real screen position each frame and turns its
  // frame-to-frame delta into an impulse — dragging the actual OS window
  // jostles the chain, on top of the ongoing gravity simulation.
  const windowImpulse = useCallback(() => {
    const sx = typeof window.screenX === 'number' ? window.screenX : null;
    const sy = typeof window.screenY === 'number' ? window.screenY : null;
    if (sx === null || sy === null) return { x: 0, y: 0 };
    if (lastScreenRef.current.x === null) {
      lastScreenRef.current = { x: sx, y: sy };
      return { x: 0, y: 0 };
    }
    const dx = sx - lastScreenRef.current.x;
    const dy = sy - lastScreenRef.current.y;
    lastScreenRef.current = { x: sx, y: sy };
    return { x: clampImpulse(dx), y: clampImpulse(dy) };
  }, []);

  // The actual "move the panel" gesture a viewer will try: scrolling the
  // modal's own scrollable body. Reads `scrollSourceRef.current.scrollTop`
  // (the panel body), not `window.scrollY` — the page behind the modal is
  // locked, and the chain must react to the panel's own scroll only.
  const scrollImpulse = useCallback(() => {
    const sy = scrollSourceRef?.current?.scrollTop ?? 0;
    if (lastScrollYRef.current === null) {
      lastScrollYRef.current = sy;
      return 0;
    }
    const dy = sy - lastScrollYRef.current;
    lastScrollYRef.current = sy;
    return clampImpulse(dy * 1.9);
  }, [scrollSourceRef]);

  const tick = useCallback(() => {
    windPhaseRef.current += 0.02;
    // Read all input sources (window position, panel scroll) before any
    // rope.step()/setAttribute('d') writes below — reading scrollTop after
    // writing SVG attributes would force a synchronous layout flush.
    const impulse = windowImpulse();
    const scrollKick = scrollImpulse();
    for (let i = 0; i < ropesRef.current.length; i++) {
      ropesRef.current[i].step(windPhaseRef.current, i, impulse.x, impulse.y + scrollKick);
      if (pathRefs.current[i]) {
        pathRefs.current[i].setAttribute('d', ropesRef.current[i].toPathD());
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [windowImpulse, scrollImpulse]);

  useEffect(() => {
    if (!isOpen || count === 0) return undefined;

    const reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lastScreenRef.current = { x: null, y: null };
    lastScrollYRef.current = null;

    dropRopes();
    if (reducedMotion) {
      paintOnce();
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    if (window.ResizeObserver && stageWrapRef.current) {
      roRef.current = new ResizeObserver(() => remeasure());
      roRef.current.observe(stageWrapRef.current);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
    };
  }, [isOpen, count, scrollSourceRef, dropRopes, paintOnce, remeasure, tick]);

  return { stageWrapRef, svgRef, getPinRef, getFactRef, getPathRef };
}
