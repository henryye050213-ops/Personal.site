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
    if (reduced.matches) revealItems.forEach((item) => item.classList.add("is-visible"));
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
    const navObserver = new IntersectionObserver((changes) => {
      const visible = changes.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const hash = entries.find((entry) => entry.section === visible.target)?.hash;
      navLinks.forEach((link) => link.classList.toggle("nav-active", link.hash === hash));
    }, { threshold: [0.18, 0.42, 0.68], rootMargin: "-12% 0px -58%" });
    entries.forEach(({ section }) => navObserver.observe(section));

    let pointerFrame = 0;
    addEventListener("pointermove", (event) => {
      if (!finePointer.matches || innerWidth <= 900 || reduced.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--parallax-x", `${((event.clientX / innerWidth - 0.5) * 12).toFixed(2)}px`);
        root.style.setProperty("--parallax-y", `${((event.clientY / innerHeight - 0.5) * 10).toFixed(2)}px`);
      });
    }, { passive: true });

    if (finePointer.matches && !reduced.matches) document.querySelectorAll("[data-magnetic]").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--magnetic-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
        item.style.setProperty("--magnetic-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 6}px`);
      });
      item.addEventListener("pointerleave", () => {
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
    const coarse = matchMedia("(pointer: coarse)").matches;
    const image = new Image();
    let frame = 0, particles = [], width = 0, height = 0, hasBuilt = false;
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
      const gap = coarse || width < 420 ? 7 : 5;
      const next = [], assemble = !reduced.matches && !hasBuilt;
      for (let y = 0; y < height; y += gap) for (let x = 0; x < width; x += gap) {
        const i = (y * width + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3] / 255;
        if (alpha < 0.05 || (r + g + b) / 3 > 250) continue;
        const brightness = (r + g + b) / 3, angle = Math.random() * Math.PI * 2, scatter = assemble ? 42 + Math.random() * 96 : 0;
        next.push({ x: x + Math.cos(angle) * scatter, y: y + Math.sin(angle) * scatter, homeX: x, homeY: y, r: Math.max(1.2, Math.min(2.2, gap * (brightness < 120 ? .24 : .2))), color: `rgb(${r},${g},${b})`, alpha, phase: Math.random() * Math.PI * 2, vx: 0, vy: 0 });
      }
      particles = next;
      if (assemble) animationStartedAt = performance.now();
      hasBuilt = true;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width)), nextH = Math.max(1, Math.round(rect.height));
      if (nextW === width && nextH === height && canvas.width) return;
      width = nextW; height = nextH;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      const radius = coarse ? 96 : 148, assembled = reduced.matches || now - animationStartedAt > 2100;
      for (const p of particles) {
        const mx = p.x - mouse.x, my = p.y - mouse.y, distance = Math.sqrt(mx * mx + my * my) || 1;
        if (mouse.active && distance < radius && !reduced.matches) {
          const force = (radius - distance) / radius, push = force * force * 2.35, swirl = force * .42;
          p.vx += mx / distance * push - my / distance * swirl; p.vy += my / distance * push + mx / distance * swirl;
        }
        const driftX = assembled && !coarse ? Math.sin(now * .00055 + p.phase) * .7 : 0;
        const driftY = assembled && !coarse ? Math.cos(now * .00048 + p.phase) * .55 : 0;
        if (reduced.matches) { p.x = p.homeX; p.y = p.homeY; }
        else { p.vx += (p.homeX + driftX - p.x) * .024; p.vy += (p.homeY + driftY - p.y) * .024; p.vx *= .91; p.vy *= .91; p.x += p.vx; p.y += p.vy; }
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (canvasVisible && documentVisible) frame = requestAnimationFrame(draw);
    }
    function resume() { cancelAnimationFrame(frame); if (canvasVisible && documentVisible) frame = requestAnimationFrame(draw); }
    target.addEventListener("pointermove", (event) => { const rect = canvas.getBoundingClientRect(); mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }; });
    target.addEventListener("pointerleave", () => { mouse.active = false; });
    target.addEventListener("pointerdown", (event) => { const rect = canvas.getBoundingClientRect(); mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }; setTimeout(() => { mouse.active = false; }, 500); });
    new ResizeObserver(() => { resize(); resume(); }).observe(canvas);
    new IntersectionObserver(([entry]) => { canvasVisible = entry.isIntersecting; resume(); }, { rootMargin: "120px" }).observe(canvas);
    document.addEventListener("visibilitychange", () => { documentVisible = !document.hidden; resume(); });
    image.onload = () => { resize(); buildParticles(); resume(); };
    image.src = "./public/assets/henry-avatar.png";
    if (image.complete && image.naturalWidth) { resize(); buildParticles(); resume(); }
  }

  initNavigation();
  initMotion();
  initParticlePortrait();
})();
