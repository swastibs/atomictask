import { useRef, useEffect } from "react";
import usePerformance from "@/hooks/usePerformance";
import "./CursorGrid.css";

const FALLOFF_CURVES = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

// Resolve any CSS color (including variables) to { r, g, b }
const resolveColorToRGB = (colorInput) => {
  // Neutral grey fallback – visible in both light and dark modes
  const fallback = { r: 180, g: 180, b: 180 };

  if (!colorInput) return fallback;

  // Helper to get RGB from a color string by applying it to a temporary element
  const getRGBFromColorString = (colorStr) => {
    const el = document.createElement("div");
    el.style.color = colorStr;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color; // e.g., "rgb(200, 100, 50)"
    document.body.removeChild(el);
    if (rgb && rgb.startsWith("rgb")) {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return { r, g, b };
    }
    return null;
  };

  // If it's a CSS variable reference, extract the variable name
  const match = colorInput.match(/var\((--[^)]+)\)/);
  if (match) {
    const varName = match[1];
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (computed) {
      const result = getRGBFromColorString(computed);
      if (result) return result;
    }
  }

  // Try directly as a plain color (hex, named, rgb, oklch, etc.)
  const directResult = getRGBFromColorString(colorInput);
  if (directResult) return directResult;

  return fallback;
};

const CursorGrid = ({
  cellSize = 70,
  color = "var(--accent-atomic)",
  radius = 140,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0,
  cellRadius = 0,
  clickPulse = true,
  pulseSpeed = 600,
  className = "",
  global = false,
  scrollEffect = false,
}) => {
  const { lowSpec, reducedMotion } = usePerformance();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const propsRef = useRef({});
  const wakeRef = useRef(null);
  const colorRef = useRef(resolveColorToRGB(color));

  // Re-resolve color when it changes (prop or theme)
  useEffect(() => {
    const updateColor = () => {
      colorRef.current = resolveColorToRGB(color);
    };
    updateColor();

    // Watch for theme changes (dark class toggled on html)
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      updateColor();
      // Trigger a redraw if the grid is idle
      wakeRef.current?.();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [color]);

  useEffect(() => {
    propsRef.current = {
      cellSize,
      radius,
      falloff,
      holdTime,
      fadeDuration,
      lineWidth,
      maxOpacity,
      fillOpacity,
      gridOpacity,
      cellRadius,
      clickPulse,
      pulseSpeed,
      scrollEffect,
    };
  }, [cellSize, radius, falloff, holdTime, fadeDuration, lineWidth, maxOpacity, fillOpacity, gridOpacity, cellRadius, clickPulse, pulseSpeed, scrollEffect]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || reducedMotion || lowSpec) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cols = 0,
      rows = 0,
      offX = 0,
      offY = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    let w = 0,
      h = 0;
    const pulses = [];
    let raf = 0,
      running = false,
      lastFrame = 0,
      isVisible = true;

    const rebuild = () => {
      const p = propsRef.current;
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / p.cellSize) + 1;
      rows = Math.ceil(h / p.cellSize) + 1;
      offX = (w - cols * p.cellSize) / 2;
      offY = (h - rows * p.cellSize) / 2;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
    };

    const cellCenter = (i) => {
      const p = propsRef.current;
      const cx = offX + (i % cols) * p.cellSize + p.cellSize / 2;
      const cy = offY + Math.floor(i / cols) * p.cellSize + p.cellSize / 2;
      return [cx, cy];
    };

    const energize = (x, y, boost) => {
      const p = propsRef.current;
      const r = Math.max(p.radius, 1);
      const ease = FALLOFF_CURVES[p.falloff] ?? FALLOFF_CURVES.linear;
      const now = performance.now();
      const minCol = Math.max(0, Math.floor((x - r - offX) / p.cellSize));
      const maxCol = Math.min(
        cols - 1,
        Math.floor((x + r - offX) / p.cellSize),
      );
      const minRow = Math.max(0, Math.floor((y - r - offY) / p.cellSize));
      const maxRow = Math.min(
        rows - 1,
        Math.floor((y + r - offY) / p.cellSize),
      );
      for (let cRow = minRow; cRow <= maxRow; cRow++) {
        for (let cCol = minCol; cCol <= maxCol; cCol++) {
          const i = cRow * cols + cCol;
          const [cx, cy] = cellCenter(i);
          const dist = Math.hypot(cx - x, cy - y);
          if (dist > r) continue;
          const level = ease(1 - dist / r) * p.maxOpacity * (boost ?? 1);
          if (level > alphas[i]) {
            alphas[i] = level;
            touched[i] = now;
          } else if (level > 0) {
            touched[i] = now;
          }
        }
      }
    };

    const draw = (now) => {
      const p = propsRef.current;
      const dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      const { r, g, b } = colorRef.current;

      // Grid lines
      if (p.gridOpacity > 0) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.gridOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let cCol = 0; cCol <= cols; cCol++) {
          const x = Math.round(offX + cCol * p.cellSize) + 0.5;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let cRow = 0; cRow <= rows; cRow++) {
          const y = Math.round(offY + cRow * p.cellSize) + 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
      }

      // Click pulses
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pulse = pulses[pi];
        const age = (now - pulse.t0) / 1000;
        const ringR = age * p.pulseSpeed;
        if (ringR > Math.hypot(w, h)) {
          pulses.splice(pi, 1);
          continue;
        }
        const band = p.cellSize;
        const minCol = Math.max(
          0,
          Math.floor((pulse.x - ringR - band - offX) / p.cellSize),
        );
        const maxCol = Math.min(
          cols - 1,
          Math.floor((pulse.x + ringR + band - offX) / p.cellSize),
        );
        const minRow = Math.max(
          0,
          Math.floor((pulse.y - ringR - band - offY) / p.cellSize),
        );
        const maxRow = Math.min(
          rows - 1,
          Math.floor((pulse.y + ringR + band - offY) / p.cellSize),
        );
        for (let cRow = minRow; cRow <= maxRow; cRow++) {
          for (let cCol = minCol; cCol <= maxCol; cCol++) {
            const i = cRow * cols + cCol;
            const [cx, cy] = cellCenter(i);
            const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
            if (Math.abs(dist - ringR) < band / 2 && p.maxOpacity > alphas[i]) {
              alphas[i] = p.maxOpacity;
              touched[i] = now;
            }
          }
        }
      }

      let anyVisible = pulses.length > 0;
      const fadeStep = dt / Math.max(p.fadeDuration, 16);
      const half = p.cellSize / 2;

      for (let i = 0; i < alphas.length; i++) {
        let a = alphas[i];
        if (a <= 0) continue;
        if (now - touched[i] > p.holdTime) {
          a = Math.max(0, a - fadeStep);
          alphas[i] = a;
          if (a <= 0) continue;
        }
        anyVisible = true;

        const [cx, cy] = cellCenter(i);
        const gradient = ctx.createRadialGradient(
          cx,
          cy,
          half * 0.1,
          cx,
          cy,
          p.cellSize,
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        const x = cx - half + 0.5;
        const y = cy - half + 0.5;
        const s = p.cellSize - 1;

        ctx.beginPath();
        if (p.cellRadius > 0) {
          ctx.roundRect(x, y, s, s, p.cellRadius);
        } else {
          ctx.rect(x, y, s, s);
        }
        if (p.fillOpacity > 0) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * p.fillOpacity})`;
          ctx.fill();
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.lineWidth;
        ctx.stroke();
      }

      if (anyVisible) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        if (propsRef.current.gridOpacity <= 0) ctx.clearRect(0, 0, w, h);
      }
    };

    const wake = () => {
      if (running || !isVisible) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    };
    wakeRef.current = wake;

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) wake();
      else cancelAnimationFrame(raf);
    }, { threshold: 0 });
    visibilityObserver.observe(container);

    const toLocal = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return [clientX - rect.left, clientY - rect.top];
    };

    const onPointerMove = (e) => {
      const [x, y] = toLocal(e.clientX, e.clientY);
      energize(x, y);
      wake();
    };

    const onPointerDown = (e) => {
      if (!propsRef.current.clickPulse) return;
      const [x, y] = toLocal(e.clientX, e.clientY);
      pulses.push({ x, y, t0: performance.now() });
      wake();
    };

    const onScroll = () => {
      if (!propsRef.current.scrollEffect) return;
      const centerX = w / 2;
      const centerY = h / 2;
      const originalRadius = propsRef.current.radius;
      propsRef.current.radius = 100;
      energize(centerX, centerY, 0.5);
      propsRef.current.radius = originalRadius;
      wake();
    };

    const target = global ? document : container;
    const eventOptions = global ? { passive: true } : undefined;

    target.addEventListener("pointermove", onPointerMove, eventOptions);
    target.addEventListener("pointerdown", onPointerDown, eventOptions);
    if (scrollEffect) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      rebuild();
      wake();
    });
    ro.observe(container);
    rebuild();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      visibilityObserver.disconnect();
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerdown", onPointerDown);
      if (scrollEffect) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [cellSize, global, lowSpec, reducedMotion, scrollEffect]);

  useEffect(() => {
    wakeRef.current?.();
  }, [gridOpacity, lineWidth, maxOpacity, fillOpacity, cellRadius]);

  return (
    <div
      ref={containerRef}
      className={`cursor-grid${className ? ` ${className}` : ""}`}
      style={global ? { pointerEvents: "none" } : undefined}
    >
      <canvas ref={canvasRef} className="cursor-grid__canvas" />
    </div>
  );
};

export default CursorGrid;
