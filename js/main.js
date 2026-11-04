/* =========================================================================
   El Medico Brujito — behaviors
   IntersectionObserver reveals, smooth scroll, nav state, mobile menu.
   All guarded so content is never stranded when JS is off, and the
   finished state is the reduced-motion state.
   ========================================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Hero load choreography ---- */
  var hero = document.querySelector(".hero");
  if (hero) {
    // next frame so the initial hidden state is painted first
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add("loaded"); });
    });
  }

  /* ---- IntersectionObserver fade-up reveals ---- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function revealAll() {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings inside the same grid for a choreographed feel
        var siblings = el.parentElement
          ? Array.prototype.slice.call(el.parentElement.querySelectorAll(":scope > [data-reveal]"))
          : [];
        var idx = siblings.indexOf(el);
        if (idx > 0) { el.style.setProperty("--reveal-delay", (idx * 80) + "ms"); }
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Nav opacity on scroll (rAF-throttled) ---- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 24);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.querySelector(".site-nav");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!toggle || !nav) return;
    nav.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menu");
    document.body.classList.add("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) { closeMenu(); } else { openMenu(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---- Smooth anchor scrolling + focus move + close menu ---- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  Array.prototype.forEach.call(anchorLinks, function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      // move focus to the target for keyboard users without an extra visible outline jump
      var hadTabindex = target.hasAttribute("tabindex");
      if (!hadTabindex) { target.setAttribute("tabindex", "-1"); }
      target.focus({ preventScroll: true });
      if (!hadTabindex) {
        target.addEventListener("blur", function handler() {
          target.removeAttribute("tabindex");
          target.removeEventListener("blur", handler);
        });
      }
      // keep the hash in the URL for shareability
      if (history.replaceState) { history.replaceState(null, "", id); }
    });
  });
})();
