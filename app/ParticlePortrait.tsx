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
};

export function ParticlePortrait({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
        drawH = height;
        drawW = height * imageRatio;
        dx = (width - drawW) / 2;
      } else {
        drawW = width;
        drawH = width / imageRatio;
        dy = (height - drawH) / 2;
      }
      sctx.drawImage(image, dx, dy, drawW, drawH);
      const data = sctx.getImageData(0, 0, width, height).data;
      const gap = coarse ? 6 : 4;
      const next: Particle[] = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const sourceAlpha = data[i + 3] / 255;
          const brightness = (r + g + b) / 3;
          if (brightness > 246 && Math.random() > 0.08) continue;
          next.push({
            x: reduced ? x : x + (Math.random() - 0.5) * 28,
            y: reduced ? y : y + (Math.random() - 0.5) * 28,
            homeX: x,
            homeY: y,
            r: gap * (brightness < 120 ? 0.42 : 0.32),
            color: `rgb(${r}, ${g}, ${b})`,
            alpha: sourceAlpha,
          });
        }
      }
      particles = next;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const radius = coarse ? 55 : 76;
      for (const particle of particles) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (mouse.active && distance < radius && !reduced) {
          const force = (radius - distance) / radius;
          particle.x += (dx / distance) * force * 5.8;
          particle.y += (dy / distance) * force * 5.8;
        }
        particle.x += (particle.homeX - particle.x) * (reduced ? 1 : 0.075);
        particle.y += (particle.homeY - particle.y) * (reduced ? 1 : 0.075);
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
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

    image.onload = () => { resize(); draw(); };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerleave", pointerLeave);
    canvas.addEventListener("pointerdown", pointerDown);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerleave", pointerLeave);
      canvas.removeEventListener("pointerdown", pointerDown);
    };
  }, [src]);

  return <canvas ref={canvasRef} className="particle-portrait" role="img" aria-label="Henry Ye 的粒子交互头像" />;
}
