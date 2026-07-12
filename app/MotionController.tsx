"use client";

import { useEffect } from "react";

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    root.classList.add("motion-enhanced");

    if (reduced.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("motion-enhanced");
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-nav a[href^='#']"));
    const sectionEntries = navLinks
      .map((link) => ({
        hash: link.hash,
        section: link.hash === "#top"
          ? document.querySelector<HTMLElement>(".hero")
          : document.querySelector<HTMLElement>(link.hash),
      }))
      .filter((entry): entry is { hash: string; section: HTMLElement } => Boolean(entry.section));
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const activeHash = sectionEntries.find((entry) => entry.section === visible.target)?.hash;
        navLinks.forEach((link) => link.classList.toggle("nav-active", link.hash === activeHash));
      },
      { threshold: [0.18, 0.42, 0.68], rootMargin: "-12% 0px -58%" },
    );
    sectionEntries.forEach(({ section }) => navObserver.observe(section));

    let pointerFrame = 0;
    const pointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || window.innerWidth <= 900) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 12;
        const y = (event.clientY / window.innerHeight - 0.5) * 10;
        root.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
        root.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", pointerMove, { passive: true });

    const magneticItems = finePointer.matches
      ? Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"))
      : [];
    const magneticCleanups = magneticItems.map((item) => {
      const move = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--magnetic-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
        item.style.setProperty("--magnetic-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 6}px`);
      };
      const leave = () => {
        item.style.setProperty("--magnetic-x", "0px");
        item.style.setProperty("--magnetic-y", "0px");
      };
      item.addEventListener("pointermove", move);
      item.addEventListener("pointerleave", leave);
      return () => {
        item.removeEventListener("pointermove", move);
        item.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      revealObserver.disconnect();
      navObserver.disconnect();
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener("pointermove", pointerMove);
      magneticCleanups.forEach((cleanup) => cleanup());
      root.style.removeProperty("--parallax-x");
      root.style.removeProperty("--parallax-y");
      root.classList.remove("motion-enhanced");
    };
  }, []);

  return null;
}
