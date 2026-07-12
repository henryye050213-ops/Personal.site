"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  r: number;
  color: string;
  alpha: number;
  phase: number;
  vx: number;
  vy: number;
};

export function ParticlePortrait({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const interactionTarget = canvas.parentElement;
    if (!interactionTarget) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const image = new Image();
    image.src = src;
    let frame = 0;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let hasBuilt = false;
    let canvasVisible = true;
    let documentVisible = !document.hidden;
    let animationStartedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (image.complete) buildParticles();
    };

    const buildParticles = () => {
      const sample = document.createElement("canvas");
      sample.width = width;
      sample.height = height;
      const sctx = sample.getContext("2d");
      if (!sctx) return;
      const imageRatio = image.width / image.height;
      const boxRatio = width / height;
      let drawW = width;
      let drawH = height;
      let dx = 0;
      let dy = 0;
      if (imageRatio > boxRatio) {
        drawW = width;
        drawH = width / imageRatio;
        dy = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imageRatio;
        dx = (width - drawW) / 2;
      }
      sctx.drawImage(image, dx, dy, drawW, drawH);
      const data = sctx.getImageData(0, 0, width, height).data;
      const gap = coarse || width < 420 ? 7 : 5;
      const next: Particle[] = [];
      const shouldAssemble = !reduced && !hasBuilt;
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const sourceAlpha = data[i + 3] / 255;
          if (sourceAlpha < 0.05) continue;
          const brightness = (r + g + b) / 3;
          if (brightness > 250) continue;
          const angle = Math.random() * Math.PI * 2;
          const scatter = shouldAssemble ? 42 + Math.random() * 96 : 0;
          next.push({
            x: x + Math.cos(angle) * scatter,
            y: y + Math.sin(angle) * scatter,
            homeX: x,
            homeY: y,
            r: Math.max(1.2, Math.min(2.2, gap * (brightness < 120 ? 0.24 : 0.2))),
            color: `rgb(${r}, ${g}, ${b})`,
            alpha: sourceAlpha,
            phase: Math.random() * Math.PI * 2,
            vx: 0,
            vy: 0,
          });
        }
      }
      particles = next;
      if (shouldAssemble) animationStartedAt = performance.now();
      hasBuilt = true;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const radius = coarse ? 96 : 148;
      const assembled = reduced || now - animationStartedAt > 2100;
      for (const particle of particles) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (mouse.active && distance < radius && !reduced) {
          const force = (radius - distance) / radius;
          const push = force * force * 2.35;
          const swirl = force * 0.42;
          particle.vx += (dx / distance) * push - (dy / distance) * swirl;
          particle.vy += (dy / distance) * push + (dx / distance) * swirl;
        }
        const driftX = assembled && !coarse ? Math.sin(now * 0.00055 + particle.phase) * 0.7 : 0;
        const driftY = assembled && !coarse ? Math.cos(now * 0.00048 + particle.phase) * 0.55 : 0;
        if (reduced) {
          particle.x = particle.homeX;
          particle.y = particle.homeY;
        } else {
          particle.vx += (particle.homeX + driftX - particle.x) * 0.024;
          particle.vy += (particle.homeY + driftY - particle.y) * 0.024;
          particle.vx *= 0.91;
          particle.vy *= 0.91;
          particle.x += particle.vx;
          particle.y += particle.vy;
        }
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced && canvasVisible && documentVisible) frame = requestAnimationFrame(draw);
    };

    const resume = () => {
      cancelAnimationFrame(frame);
      if (canvasVisible && documentVisible) frame = requestAnimationFrame(draw);
    };

    const pointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    };
    const pointerLeave = () => { mouse.active = false; };
    const pointerDown = (event: PointerEvent) => {
      pointerMove(event);
      window.setTimeout(() => { mouse.active = false; }, 500);
    };

    image.onload = () => { resize(); resume(); };
    image.onerror = () => { ctx.clearRect(0, 0, width, height); };
    const observer = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      canvasVisible = entry.isIntersecting;
      resume();
    }, { rootMargin: "120px" });
    const visibilityChange = () => {
      documentVisible = !document.hidden;
      resume();
    };
    observer.observe(canvas);
    visibilityObserver.observe(canvas);
    document.addEventListener("visibilitychange", visibilityChange);
    interactionTarget.addEventListener("pointermove", pointerMove);
    interactionTarget.addEventListener("pointerleave", pointerLeave);
    interactionTarget.addEventListener("pointerdown", pointerDown);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      interactionTarget.removeEventListener("pointermove", pointerMove);
      interactionTarget.removeEventListener("pointerleave", pointerLeave);
      interactionTarget.removeEventListener("pointerdown", pointerDown);
    };
  }, [src]);

  return <canvas ref={canvasRef} className="particle-portrait" role="img" aria-label="Henry Ye 的粒子交互头像" />;
}
