import { animate, inView, stagger, scroll } from "motion";

/**
 * Scroll-reveal system that mimics Framer's "appear" animations.
 *
 * Usage in markup:
 *   data-reveal            → fade + rise (default)
 *   data-reveal="left"     → fade + slide from left
 *   data-reveal="right"    → fade + slide from right
 *   data-reveal="scale"    → fade + scale up
 *   data-reveal-delay="0.2"→ extra delay (seconds)
 *   data-stagger           → on a parent, its [data-reveal] children run staggered
 */

const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 1 };
const EASE = [0.22, 1, 0.36, 1]; // easeOutExpo-ish, close to Framer default

function hiddenState(kind) {
  switch (kind) {
    case "left":
      return { opacity: 0, x: -60 };
    case "right":
      return { opacity: 0, x: 60 };
    case "scale":
      return { opacity: 0, scale: 0.9 };
    case "down":
      return { opacity: 0, y: -40 };
    default:
      return { opacity: 0, y: 48 };
  }
}

function shownState(kind) {
  switch (kind) {
    case "left":
    case "right":
      return { opacity: 1, x: 0 };
    case "scale":
      return { opacity: 1, scale: 1 };
    default:
      return { opacity: 1, y: 0 };
  }
}

function revealSingle(el) {
  const kind = el.getAttribute("data-reveal") || "up";
  const delay = parseFloat(el.getAttribute("data-reveal-delay") || "0");
  animate(el, hiddenState(kind), { duration: 0 });
  inView(
    el,
    () => {
      animate(el, shownState(kind), {
        duration: 0.8,
        delay,
        ease: EASE,
      });
    },
    { amount: 0.2, margin: "0px 0px -10% 0px" }
  );
}

function revealGroup(parent) {
  const children = parent.querySelectorAll(":scope [data-reveal]");
  children.forEach((c) => animate(c, hiddenState(c.getAttribute("data-reveal") || "up"), { duration: 0 }));
  inView(
    parent,
    () => {
      children.forEach((c, i) => {
        const kind = c.getAttribute("data-reveal") || "up";
        animate(c, shownState(kind), {
          duration: 0.75,
          delay: i * 0.1,
          ease: EASE,
        });
      });
    },
    { amount: 0.15 }
  );
}

export function initReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
    });
    return;
  }
  // Grouped/staggered first (so children aren't double-bound)
  const grouped = new Set();
  document.querySelectorAll("[data-stagger]").forEach((p) => {
    revealGroup(p);
    p.querySelectorAll(":scope [data-reveal]").forEach((c) => grouped.add(c));
  });
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (!grouped.has(el)) revealSingle(el);
  });
}

/**
 * Seamless marquee. Container [data-marquee] with a single track child
 * [data-marquee-track]; the track is duplicated for a continuous loop.
 * data-marquee-speed = pixels per second (default 60).
 */
export function initMarquees() {
  document.querySelectorAll("[data-marquee]").forEach((wrap) => {
    const track = wrap.querySelector("[data-marquee-track]");
    if (!track) return;
    const speed = parseFloat(wrap.getAttribute("data-marquee-speed") || "60");
    const reverse = wrap.hasAttribute("data-marquee-reverse");

    // Duplicate the items into the SAME flex row for a seamless horizontal loop
    const originals = [...track.children];
    const setWidth = track.scrollWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    originals.forEach((it) => {
      const c = it.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });

    const duration = setWidth / speed;
    const from = reverse ? -setWidth : 0;
    const to = reverse ? 0 : -setWidth;
    animate(
      track,
      { transform: [`translateX(${from}px)`, `translateX(${to}px)`] },
      { duration, ease: "linear", repeat: Infinity }
    );
  });
}

/**
 * Countdown to a target date. Element [data-countdown="YYYY-MM-DD"]
 * with a child [data-count-days] to fill with the number of days.
 */
export function initCountdown() {
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    const target = new Date(el.getAttribute("data-countdown") + "T00:00:00");
    const out = el.querySelector("[data-count-days]");
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, Math.ceil((target - now) / 86400000));
      if (out) out.textContent = String(diff).padStart(2, "0");
    };
    tick();
    setInterval(tick, 60000);
  });
}

/**
 * Scroll-linked timeline fill. Container [data-timeline] with a fill
 * element [data-timeline-fill] (origin-left) and dots [data-timeline-dot].
 * The lime line grows and dots activate as the section passes through view.
 */
export function initTimelines() {
  document.querySelectorAll("[data-timeline]").forEach((el) => {
    const fill = el.querySelector("[data-timeline-fill]");
    const dots = [...el.querySelectorAll("[data-timeline-dot]")];
    // Each dot's centre as a fraction of the track width, so it lights up
    // exactly when the growing line reaches it.
    let fractions = [];
    const measure = () => {
      const r = el.getBoundingClientRect();
      fractions = dots.map((d) => {
        const dr = d.getBoundingClientRect();
        return r.width ? (dr.left + dr.width / 2 - r.left) / r.width : 0;
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const apply = (p) => {
      if (fill) fill.style.transform = `scaleX(${Math.max(0.02, p)})`;
      dots.forEach((d, i) => d.classList.toggle("on", p >= fractions[i] - 0.01));
    };

    // On mobile the horizontal line is hidden and steps stack vertically, so
    // just mark everything complete. Same for reduced-motion.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 1024px)").matches
    ) {
      apply(1);
      return;
    }
    // Scroll-driven through the pinned track: while the section is pinned, the
    // green line grows to the very end (right edge); progress completes right as
    // the pin releases and normal scroll resumes.
    apply(0);
    const track = el.closest("[data-timeline-pin]") || el;
    scroll(apply, { target: track, offset: ["start start", "end end"] });
  });
}

/**
 * Infinite, draggable horizontal carousel with a custom "Glisser" cursor.
 * Wrapper [data-drag] contains a track [data-drag-track]; the track auto-drifts
 * forever and can be grabbed and thrown. A sibling [data-drag-cursor] follows
 * the pointer on fine-pointer devices.
 */
export function initDragCarousels() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-drag]").forEach((wrap) => {
    const track = wrap.querySelector("[data-drag-track]");
    if (!track) return;
    const cursor = wrap.parentElement?.querySelector("[data-drag-cursor]");

    // Duplicate the cards once so the loop is seamless in both directions.
    const originals = [...track.children];
    originals.forEach((c) => {
      const clone = c.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    let setWidth = 0;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setWidth = originals.reduce(
        (w, c) => w + c.getBoundingClientRect().width + gap,
        0
      );
    };
    measure();
    window.addEventListener("resize", measure);

    let offset = 0;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let moved = false;
    const speed = 40; // px/s auto drift

    // Drag to scroll (adds directly to the offset)
    wrap.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startOffset = offset;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {}
      cursor?.classList.add("is-dragging");
    });
    wrap.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      offset = startOffset + dx;
    });
    const end = () => {
      dragging = false;
      cursor?.classList.remove("is-dragging");
    };
    wrap.addEventListener("pointerup", end);
    wrap.addEventListener("pointercancel", end);
    wrap.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    // Auto-drift + wrap loop
    let last = null;
    const raf = (now) => {
      if (last == null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging && !reduce) offset -= speed * dt;
      if (setWidth > 0) {
        while (offset <= -setWidth) offset += setWidth;
        while (offset > 0) offset -= setWidth;
      }
      track.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Custom cursor follow (fine pointers only)
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
      let mx = 0;
      let my = 0;
      let cx = 0;
      let cy = 0;
      let shown = false;
      wrap.addEventListener("pointerenter", (e) => {
        // snap to the pointer on entry so it doesn't fly in from a corner
        mx = cx = e.clientX;
        my = cy = e.clientY;
      });
      wrap.addEventListener("pointermove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!shown) {
          shown = true;
          cx = mx;
          cy = my;
        }
        cursor.style.opacity = "1";
      });
      wrap.addEventListener("pointerleave", () => {
        shown = false;
        cursor.style.opacity = "0";
      });
      const loop = () => {
        cx += (mx - cx) * 0.2;
        cy += (my - cy) * 0.2;
        cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  });
}

/**
 * Mobile hamburger menu. Toggle [data-mobile-toggle] opens/closes the
 * fullscreen panel [data-mobile-menu].
 */
export function initMobileMenu() {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;
  const iconMenu = toggle.querySelector("[data-icon-menu]");
  const iconClose = toggle.querySelector("[data-icon-close]");
  let open = false;
  const setOpen = (v) => {
    open = v;
    menu.classList.toggle("hidden", !v);
    document.body.style.overflow = v ? "hidden" : "";
    toggle.setAttribute("aria-expanded", v ? "true" : "false");
    iconMenu?.classList.toggle("hidden", v);
    iconClose?.classList.toggle("hidden", !v);
  };
  toggle.addEventListener("click", () => setOpen(!open));
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setOpen(false))
  );
}

function boot() {
  initReveals();
  initMarquees();
  initCountdown();
  initTimelines();
  initDragCarousels();
  initMobileMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
