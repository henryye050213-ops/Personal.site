/* Subtle motion traced over Henry's supplied X banner, without a particle library. */
(() => {
  "use strict";
  const canvases = document.querySelectorAll(".circuit-canvas");
  if (!canvases.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 900px)");
  const settings = { cycleSeconds: 14, desktopFps: 30, mobileFps: 20, desktopMotes: 22, mobileMotes: 9 };
  const source = { width: 2048, height: 683 };
  // Coordinates follow the actual diagonal and horizontal rails of the banner.
  const routes = [
    [[615, 513], [1078, 513], [1591, 0]],
    [[542, 536], [1140, 536], [1598, 78]],
    [[908, 591], [1220, 591], [1298, 514], [1656, 514], [1834, 337], [2048, 337]],
    [[1050, 644], [1348, 644], [1408, 584], [1683, 584], [1890, 377], [2048, 377]],
    [[1408, 158], [1408, 556]],
    [[1563, 80], [1563, 369]],
    [[970, 0], [970, 400]],
  ].map((points, index) => {
    let length = 0;
    const segments = points.slice(1).map((point, i) => {
      const previous = points[i], size = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
      const segment = { from: previous, to: point, start: length, size };
      length += size;
      return segment;
    });
    return { segments, length, offset: index * .147 };
  });

  // Each section owns its timing/visibility; geometry and visual settings are shared.
  function initCircuit(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let width = 0, height = 0, dpr = 1, scale = 1, offsetX = 0, offsetY = 0;
    let frame = 0, visible = true, lastTime = 0, renderedAt = 0, elapsed = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.round(rect.width); height = Math.round(rect.height);
      dpr = Math.min(devicePixelRatio || 1, mobile.matches ? 1.5 : 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      scale = Math.max(width / source.width, height / source.height);
      offsetX = (width - source.width * scale) / 2;
      offsetY = (height - source.height * scale) * (canvas.dataset.alignY === "bottom" ? 1 : .5);
    }

    function strokeRoute(route, start, end) {
      ctx.beginPath();
      for (const segment of route.segments) {
        const a = Math.max(start, segment.start), b = Math.min(end, segment.start + segment.size);
        if (b <= a) continue;
        const first = (a - segment.start) / segment.size, last = (b - segment.start) / segment.size;
        const dx = segment.to[0] - segment.from[0], dy = segment.to[1] - segment.from[1];
        ctx.moveTo(segment.from[0] + dx * first, segment.from[1] + dy * first);
        ctx.lineTo(segment.from[0] + dx * last, segment.from[1] + dy * last);
      }
      ctx.stroke();
    }

    function render() {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#9a68ff"; ctx.lineWidth = 1.8;
      ctx.shadowColor = "#894aff"; ctx.shadowBlur = mobile.matches ? 0 : 9;
      routes.forEach((route) => {
        const progress = (elapsed / settings.cycleSeconds + route.offset) % 1;
        const head = progress * (route.length + 110);
        ctx.globalAlpha = .38;
        strokeRoute(route, head - 100, head);
        ctx.globalAlpha = .75;
        strokeRoute(route, head - 9, head);
      });

      // A moving arc and a slow glow sit on the ring already present in the artwork.
      const angle = elapsed / 18 * Math.PI * 2;
      ctx.strokeStyle = "#b48aff";
      ctx.globalAlpha = .18 + (Math.sin(elapsed * .45) + 1) * .09;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(1195, 251, 204, angle, angle + .64); ctx.stroke();
      ctx.shadowBlur = 0;

      const count = mobile.matches ? settings.mobileMotes : settings.desktopMotes;
      for (let i = 0; i < count; i++) {
        const x = 590 + ((i * 173.7) % 1400);
        const y = ((i * 89.1 + elapsed * (7 + i % 4)) % 680);
        ctx.globalAlpha = .12 + (Math.sin(elapsed * .7 + i) + 1) * .13;
        ctx.fillStyle = i % 3 === 0 ? "#c59cff" : "#7946ff";
        ctx.fillRect(x, y, 1.5, i % 4 === 0 ? 7 : 2);
      }
      ctx.globalAlpha = 1;
    }

    function tick(now) {
      frame = 0;
      if (document.hidden || !visible || reduced.matches) return;
      if (lastTime) elapsed += Math.min((now - lastTime) / 1000, .1);
      lastTime = now;
      const interval = 1000 / (mobile.matches ? settings.mobileFps : settings.desktopFps);
      if (now - renderedAt >= interval) { render(); renderedAt = now; }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      document.documentElement.classList.toggle("page-paused", document.hidden);
      if (reduced.matches) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (!document.hidden && visible) frame = requestAnimationFrame(tick);
    }

    if ("ResizeObserver" in window) new ResizeObserver(() => { resize(); sync(); }).observe(canvas);
    else addEventListener("resize", () => { resize(); sync(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", () => { resize(); sync(); });
    addEventListener("pagehide", () => { cancelAnimationFrame(frame); frame = 0; });
    addEventListener("pageshow", sync);
    resize(); sync();
  }

  canvases.forEach(initCircuit);
})();
