(() => {
  "use strict";

  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    toggle?.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav?.classList.toggle("is-open", open);
    });
    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      toggle?.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }

  function initMotion() {
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    root.classList.add("motion-enhanced");
    if (reduced.matches || !("IntersectionObserver" in window)) revealItems.forEach((item) => item.classList.add("is-visible"));
    else {
      const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }), { threshold: 0.14, rootMargin: "0px 0px -8%" });
      revealItems.forEach((item) => revealObserver.observe(item));
    }

    const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
    const entries = navLinks.map((link) => ({ hash: link.hash, section: link.hash === "#top" ? document.querySelector(".hero") : document.querySelector(link.hash) })).filter((entry) => entry.section);
    const navObserver = "IntersectionObserver" in window ? new IntersectionObserver((changes) => {
      const visible = changes.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const hash = entries.find((entry) => entry.section === visible.target)?.hash;
      navLinks.forEach((link) => link.classList.toggle("nav-active", link.hash === hash));
    }, { threshold: [0, 0.18, 0.42, 0.68], rootMargin: "-12% 0px -58%" }) : null;
    entries.forEach(({ section }) => navObserver?.observe(section));

    let pointerFrame = 0;
    addEventListener("pointermove", (event) => {
      if (!finePointer.matches || innerWidth <= 900 || reduced.matches || document.hidden) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--parallax-x", `${((event.clientX / innerWidth - 0.5) * 12).toFixed(2)}px`);
        root.style.setProperty("--parallax-y", `${((event.clientY / innerHeight - 0.5) * 10).toFixed(2)}px`);
      });
    }, { passive: true });

    if (finePointer.matches && !reduced.matches) document.querySelectorAll("[data-magnetic]").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        if (reduced.matches || !finePointer.matches || innerWidth <= 900) return;
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--magnetic-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
        item.style.setProperty("--magnetic-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 6}px`);
      });
      item.addEventListener("pointerleave", () => {
        item.style.setProperty("--magnetic-x", "0px");
        item.style.setProperty("--magnetic-y", "0px");
      });
    });

    reduced.addEventListener("change", () => {
      if (!reduced.matches) return;
      cancelAnimationFrame(pointerFrame);
      revealItems.forEach((item) => item.classList.add("is-visible"));
      root.style.setProperty("--parallax-x", "0px");
      root.style.setProperty("--parallax-y", "0px");
      document.querySelectorAll("[data-magnetic]").forEach((item) => {
        item.style.setProperty("--magnetic-x", "0px");
        item.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  function initParticlePortrait() {
    const canvas = document.querySelector(".particle-portrait");
    const target = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !target || !ctx) return;
    // Both layers use the same image and object-fit: contain geometry.
    const image = target.querySelector("img.faded-portrait");
    if (!image) return;
    const coarse = matchMedia("(pointer: coarse)");
    const settings = { desktopBudget: 11000, mobileBudget: 3400, spring: .024, friction: .91, radius: 148, push: 2.35 };
    let frame = 0, particles = [], width = 0, height = 0, currentDpr = 0, hasBuilt = false, imageReady = false;
    let previousTime = 0;
    let mouse = { x: -1000, y: -1000, active: false };
    let canvasVisible = true, documentVisible = !document.hidden, animationStartedAt = performance.now();

    function buildParticles() {
      if (!width || !height || !image.naturalWidth) return;
      const sample = document.createElement("canvas");
      sample.width = width; sample.height = height;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const boxRatio = width / height;
      let drawW = width, drawH = height, dx = 0, dy = 0;
      if (imageRatio > boxRatio) { drawH = width / imageRatio; dy = (height - drawH) / 2; }
      else { drawW = height * imageRatio; dx = (width - drawW) / 2; }
      sctx.drawImage(image, dx, dy, drawW, drawH);
      let data;
      try { data = sctx.getImageData(0, 0, width, height).data; }
      catch { return; }
      const budget = coarse.matches || width < 420 ? settings.mobileBudget : settings.desktopBudget;
      const gap = Math.max(5, Math.ceil(Math.sqrt(width * height / budget)));
      const next = [], assemble = !reduced.matches && !hasBuilt;
      for (let y = 0; y < height; y += gap) for (let x = 0; x < width; x += gap) {
        const i = (y * width + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3] / 255;
        if (alpha < 0.05) continue;
        const brightness = (r + g + b) / 3, angle = Math.random() * Math.PI * 2, scatter = assemble ? 42 + Math.random() * 96 : 0;
        next.push({ x: x + Math.cos(angle) * scatter, y: y + Math.sin(angle) * scatter, homeX: x, homeY: y, r: Math.max(1.2, Math.min(2.2, gap * (brightness < 120 ? .24 : .2))), color: `rgb(${r},${g},${b})`, alpha, phase: Math.random() * Math.PI * 2, vx: 0, vy: 0 });
      }
      particles = next;
      if (assemble) animationStartedAt = performance.now();
      hasBuilt = true;
      target.classList.toggle("particles-ready", particles.length > 0);
      return particles.length > 0;
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      // Layout dimensions exclude the entrance animation's temporary scale.
      const nextW = Math.max(1, canvas.clientWidth), nextH = Math.max(1, canvas.clientHeight);
      if (nextW === width && nextH === height && dpr === currentDpr && canvas.width) return false;
      width = nextW; height = nextH; currentDpr = dpr;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (imageReady) buildParticles();
      return true;
    }

    function draw(now) {
      frame = 0;
      const dt = previousTime ? Math.min((now - previousTime) / (1000 / 60), 2) : 1;
      previousTime = now;
      const damping = Math.pow(settings.friction, dt);
      ctx.clearRect(0, 0, width, height);
      const radius = coarse.matches ? 96 : settings.radius, assembled = reduced.matches || now - animationStartedAt > 2100;
      for (const p of particles) {
        if (mouse.active && !reduced.matches) {
          const mx = p.x - mouse.x, my = p.y - mouse.y, squared = mx * mx + my * my;
          if (squared < radius * radius) {
            const distance = Math.sqrt(squared) || 1;
            const force = (radius - distance) / radius, push = force * force * settings.push, swirl = force * .42;
            p.vx += (mx / distance * push - my / distance * swirl) * dt;
            p.vy += (my / distance * push + mx / distance * swirl) * dt;
          }
        }
        const driftX = assembled && !coarse.matches ? Math.sin(now * .00055 + p.phase) * .7 : 0;
        const driftY = assembled && !coarse.matches ? Math.cos(now * .00048 + p.phase) * .55 : 0;
        if (reduced.matches) { p.x = p.homeX; p.y = p.homeY; p.vx = 0; p.vy = 0; }
        else { p.vx += (p.homeX + driftX - p.x) * settings.spring * dt; p.vy += (p.homeY + driftY - p.y) * settings.spring * dt; p.vx *= damping; p.vy *= damping; p.x += p.vx * dt; p.y += p.vy * dt; }
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (canvasVisible && documentVisible && !reduced.matches) frame = requestAnimationFrame(draw);
    }
    function resume() {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      if (canvasVisible && documentVisible && particles.length) frame = requestAnimationFrame(draw);
    }
    function clearPointer() { mouse.active = false; }
    function updatePointer(event) {
      if (reduced.matches) return;
      const rect = canvas.getBoundingClientRect();
      mouse = { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height, active: true };
    }
    target.addEventListener("pointermove", (event) => { if (event.pointerType === "mouse") updatePointer(event); }, { passive: true });
    target.addEventListener("pointerdown", updatePointer, { passive: true });
    target.addEventListener("pointerleave", clearPointer);
    target.addEventListener("pointercancel", clearPointer);
    addEventListener("pointerup", (event) => { if (event.pointerType !== "mouse") clearPointer(); });
    addEventListener("blur", clearPointer);
    if ("ResizeObserver" in window) new ResizeObserver(() => { resize(); resume(); }).observe(canvas);
    else addEventListener("resize", () => { resize(); resume(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(([entry]) => { canvasVisible = entry.isIntersecting; resume(); }, { rootMargin: "60px" }).observe(canvas);
    document.addEventListener("visibilitychange", () => { documentVisible = !document.hidden; clearPointer(); resume(); });
    reduced.addEventListener("change", () => { clearPointer(); resume(); });
    coarse.addEventListener("change", () => { if (imageReady) buildParticles(); resume(); });
    addEventListener("pagehide", () => { documentVisible = false; resume(); });
    addEventListener("pageshow", () => { documentVisible = !document.hidden; resume(); });
    function ready() {
      if (imageReady || !image.naturalWidth) return;
      imageReady = true;
      if (!resize()) buildParticles();
      resume();
    }
    image.addEventListener("load", ready, { once: true });
    image.addEventListener("error", () => { particles = []; target.classList.remove("particles-ready"); resume(); }, { once: true });
    if (image.complete) ready();
  }

  initNavigation();
  initMotion();
  initParticlePortrait();
})();

;
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
