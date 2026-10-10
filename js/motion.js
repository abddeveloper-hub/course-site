/**
 * NEXVION AI — Motion & 3D Engine  (js/motion.js)
 * ---------------------------------------------------------------------------
 * One shared, dependency-free engine that layers depth and motion on top of
 * the existing site. Loaded by index.html, course.html, dashboard.html and
 * register.html.
 *
 *   • Aurora depth background + pointer light
 *   • Scroll reveal with automatic, staggered tagging of every card
 *   • Real 3D tilt on mouse-driven cards
 *   • Scroll parallax
 *   • Magnetic buttons + sheen (sheen handled in CSS)
 *   • Accessible social-proof carousel with 3D coverflow, autoplay, swipe
 *     and keyboard support
 *
 * Everything degrades gracefully: respects prefers-reduced-motion, requires
 * no library, and never hides content if the script fails to run.
 */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');
  var IS_MOBILE = window.matchMedia('(max-width: 768px), (pointer: coarse)');

  var isMobile = function () {
    return IS_MOBILE.matches;
  };

  /* Reveal targets — every card-ish block across all four pages. */
  var REVEAL_HEADERS =
    '.section-header, .course-section-header, .testimonials-header, .dash-welcome-bar';

  var REVEAL_CARDS = [
    '.topic-card',
    '.audience-card',
    '.feature-item-card',
    '.why-bento-card',
    '.learn-card-6',
    '.project-card',
    '.roadmap-step-card',
    '.roadmap-apex-card',
    '.progression-step-card',
    '.tier-card',
    '.module-card',
    '.experience-card',
    '.exp-card',
    '.course-stat-item',
    '.certificate-preview-card',
    '.mobile-comp-card',
    '.requirements-card-wrapper',
    '.metric-card',
    '.dash-section-box',
    '.current-course-card',
    '.continue-class-card',
    '.about-pillar-item',
    '.faq-item',
    '.class-item-row',
    '.review-data-item',
    '.cta-banner-card',
    '.testimonials-placeholder-card',
    '.review-card',
    '.consent-box',
    '.register-trust-box'
  ].join(', ');

  /* Cards that feel good under a 3D tilt. Large layout containers are excluded. */
  var TILT_SELECTORS = [
    '.topic-card',
    '.audience-card',
    '.feature-item-card',
    '.why-bento-card',
    '.learn-card-6',
    '.project-card',
    '.roadmap-step-card',
    '.progression-step-card',
    '.tier-card',
    '.module-card',
    '.experience-card',
    '.exp-card',
    '.certificate-preview-card',
    '.metric-card',
    '.current-course-card',
    '.continue-class-card',
    '.cta-banner-card',
    '.review-card'
  ].join(', ');

  /* Never animate chrome, overlays or third-party widgets. */
  var EXCLUDE_ZONE =
    '.navbar, .mobile-drawer, .drawer-backdrop, .modal, .modal-overlay, ' +
    '.dash-sidebar, .dash-topbar, .nxv-carousel, .sentinel-widget, .chatbot-widget, [data-nxv-no-motion]';

  var TILT_MAX_DEG = 7;
  var TILT_LIFT = 18;

  var isReduced = function () {
    return REDUCED.matches;
  };

  var inExcludedZone = function (el) {
    return !!(el.closest && el.closest(EXCLUDE_ZONE));
  };

  /* =========================================================================
     1. Aurora depth background
     ========================================================================= */
  function injectAurora() {
    if (isMobile() || document.querySelector('.nxv-aurora') || isReduced()) return;

    var aurora = document.createElement('div');
    aurora.className = 'nxv-aurora';
    aurora.setAttribute('aria-hidden', 'true');
    aurora.innerHTML =
      '<div class="nxv-aurora__blob nxv-aurora__blob--violet"></div>' +
      '<div class="nxv-aurora__blob nxv-aurora__blob--cyan"></div>' +
      '<div class="nxv-aurora__blob nxv-aurora__blob--indigo"></div>' +
      '<div class="nxv-aurora__grain"></div>';

    document.body.insertBefore(aurora, document.body.firstChild);

    requestAnimationFrame(function () {
      aurora.classList.add('nxv-aurora-in');
    });
  }

  /* =========================================================================
     2. Pointer light
     ========================================================================= */
  function initCursorAurora() {
    if (isReduced() || !FINE_POINTER.matches) return;

    var light = document.createElement('div');
    light.id = 'nxv-cursor-aurora';
    light.setAttribute('aria-hidden', 'true');
    document.body.appendChild(light);

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var x = targetX;
    var y = targetY;
    var running = false;

    var loop = function () {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      light.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';

      if (Math.abs(targetX - x) > 0.4 || Math.abs(targetY - y) > 0.4) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    window.addEventListener(
      'pointermove',
      function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        light.classList.add('nxv-on');
        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', function () {
      light.classList.remove('nxv-on');
    });
  }

  /* =========================================================================
     3. Scroll reveal — automatic staggered tagging
     ========================================================================= */
  var revealObserver = null;

  function observeReveal(el) {
    if (!revealObserver) return;
    revealObserver.observe(el);
  }

  function tagRevealTargets(root) {
    var scope = root || document;

    if (isMobile()) {
      // Mobile performance fast-path: immediately unhide without delayed scroll stutters
      scope.querySelectorAll('[data-nxv-reveal], ' + REVEAL_HEADERS + ', ' + REVEAL_CARDS).forEach(function (el) {
        el.classList.add('nxv-in', 'nxv-settled');
        el.removeAttribute('data-nxv-reveal');
      });
      return;
    }

    // Explicit author opt-ins are respected as-is.
    scope.querySelectorAll('[data-nxv-reveal]').forEach(function (el) {
      if (!el.classList.contains('nxv-reveal-armed')) {
        el.dataset.nxvReveal = el.dataset.nxvReveal || 'up';
        el.classList.add('nxv-reveal-armed');
      }
      observeReveal(el);
    });

    var groups = [
      { sel: REVEAL_HEADERS, variant: 'up' },
      { sel: REVEAL_CARDS, variant: 'up' }
    ];

    groups.forEach(function (group) {
      scope.querySelectorAll(group.sel).forEach(function (el) {
        if (el.hasAttribute('data-nxv-reveal')) return;
        if (inExcludedZone(el)) return;
        if (el.closest('.nxv-slide')) return;

        el.setAttribute('data-nxv-reveal', group.variant);
        el.classList.add('nxv-reveal-armed');
        observeReveal(el);
      });
    });

    // Stagger siblings that share a parent so grids cascade instead of popping.
    scope.querySelectorAll('[data-nxv-reveal]').forEach(function (el) {
      if (el.dataset.nxvDelayed === '1') return;
      var parent = el.parentElement;
      if (!parent) return;

      var siblings = Array.prototype.filter.call(parent.children, function (child) {
        return child.hasAttribute && child.hasAttribute('data-nxv-reveal');
      });

      if (siblings.length < 2) {
        el.dataset.nxvDelayed = '1';
        return;
      }

      var index = siblings.indexOf(el);
      el.style.setProperty('--nxv-delay', Math.min(index, 6) * 80 + 'ms');
      el.dataset.nxvDelayed = '1';
    });
  }

  function initReveal() {
    if (isReduced() || isMobile()) {
      tagRevealTargets(document);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      return; // content stays visible; no motion
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add('nxv-in');
          window.setTimeout(function () {
            el.classList.add('nxv-settled');
          }, 1400);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    tagRevealTargets(document);
  }

  /* =========================================================================
     4. 3D tilt
     ========================================================================= */
  function attachTilt(el) {
    var raf = null;
    var rect = null;

    var apply = function (rx, ry, tz, live, hover) {
      el.style.setProperty('--nxv-rx', rx.toFixed(2) + 'deg');
      el.style.setProperty('--nxv-ry', ry.toFixed(2) + 'deg');
      el.style.setProperty('--nxv-tz', tz.toFixed(1) + 'px');
      el.classList.toggle('nxv-tilt-live', !!live);
      el.classList.toggle('nxv-tilt-hover', !!hover);
    };

    el.addEventListener(
      'pointerenter',
      function () {
        rect = el.getBoundingClientRect();
        if (rect.height < 60) return;
        el.classList.add('nxv-tilt-armed');
        apply(0, 0, TILT_LIFT, false, true);
      },
      { passive: true }
    );

    el.addEventListener(
      'pointermove',
      function (e) {
        if (!el.classList.contains('nxv-tilt-armed')) return;
        if (raf) return;

        raf = requestAnimationFrame(function () {
          raf = null;
          rect = rect || el.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;

          apply(py * -2 * TILT_MAX_DEG, px * 2 * TILT_MAX_DEG, TILT_LIFT, true, true);
        });
      },
      { passive: true }
    );

    el.addEventListener(
      'pointerleave',
      function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        rect = null;
        el.classList.remove('nxv-tilt-armed');
        apply(0, 0, 0, false, false);
      },
      { passive: true }
    );
  }

  function tagTiltTargets(root) {
    if (isReduced() || isMobile() || !FINE_POINTER.matches) return;

    (root || document).querySelectorAll(TILT_SELECTORS + ', [data-nxv-tilt]').forEach(function (el) {
      if (el.dataset.nxvTiltArmed === '1') return;
      if (inExcludedZone(el)) return;
      if (el.closest('.nxv-slide')) return;

      el.dataset.nxvTiltArmed = '1';
      el.classList.add('nxv-tilt');
      attachTilt(el);
    });
  }

  /* =========================================================================
     5. Scroll parallax
     ========================================================================= */
  function initParallax() {
    if (isReduced() || isMobile()) return;

    var items = [];

    document.querySelectorAll('[data-nxv-parallax]').forEach(function (el) {
      items.push({ el: el, speed: parseFloat(el.dataset.nxvParallax) || 0.12 });
    });

    var aurora = document.querySelector('.nxv-aurora');
    if (aurora) items.push({ el: aurora, speed: 0.035, isFixed: true });

    if (!items.length) return;

    var ticking = false;

    var update = function () {
      ticking = false;
      var vh = window.innerHeight;

      items.forEach(function (item) {
        if (item.isFixed) {
          item.el.style.transform = 'translate3d(0,' + (-window.scrollY * item.speed).toFixed(1) + 'px,0)';
          return;
        }

        var rect = item.el.getBoundingClientRect();
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1 .. 1
        var offset = -progress * item.speed * 160;

        item.el.style.setProperty('--nxv-parallax', offset.toFixed(1) + 'px');
        item.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* =========================================================================
     6. Magnetic buttons
     ========================================================================= */
  function initMagnetic() {
    if (isReduced() || isMobile() || !FINE_POINTER.matches) return;

    document.querySelectorAll('.btn, .nxv-carousel__btn').forEach(function (el) {
      if (el.dataset.nxvMagnetic === '1') return;
      el.dataset.nxvMagnetic = '1';

      // Established up front so the very first pointer move already eases.
      el.classList.add('nxv-magnetic');

      var raf = null;

      el.addEventListener(
        'pointermove',
        function (e) {
          var rect = el.getBoundingClientRect();
          if (rect.width < 140) return;
          if (raf) return;

          raf = requestAnimationFrame(function () {
            raf = null;
            var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            el.style.transform =
              'translate3d(' + (dx * 5).toFixed(1) + 'px,' + (dy * 4 - 1).toFixed(1) + 'px,0)';
          });
        },
        { passive: true }
      );

      el.addEventListener(
        'pointerleave',
        function () {
          if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
          el.style.transform = '';
        },
        { passive: true }
      );
    });
  }

  /* =========================================================================
     7. Social-proof carousel
     ========================================================================= */
  function initCarousel(root) {
    var track = root.querySelector('.nxv-carousel__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.nxv-slide'));
    var prevBtn = root.querySelector('[data-nxv-prev]');
    var nextBtn = root.querySelector('[data-nxv-next]');
    var dotsWrap = root.querySelector('.nxv-carousel__dots');

    if (!track || slides.length === 0) return;

    var index = slides.findIndex(function (s) {
      return s.classList.contains('nxv-slide--active');
    });
    if (index < 0) index = 0;

    var timer = null;
    var autoplayPaused = isReduced();
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function (slide, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'nxv-dot';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1) + ' of ' + slides.length);
        dot.addEventListener('click', function () {
          goTo(i);
          pauseAutoplay(true);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function layout() {
      var viewport = root.querySelector('.nxv-carousel__viewport');
      if (!viewport) return;

      var slideWidth = slides[0].offsetWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      var step = slideWidth + gap;
      var centre = (viewport.clientWidth - slideWidth) / 2;

      track.style.transform = 'translate3d(' + (centre - index * step).toFixed(1) + 'px,0,0)';

      slides.forEach(function (slide, i) {
        var d = i - index;
        var abs = Math.abs(d);
        var visible = abs <= 2;

        if (isMobile()) {
          slide.style.setProperty('--nxv-slide-ry', '0deg');
          slide.style.setProperty('--nxv-slide-z', '0px');
          slide.style.setProperty('--nxv-slide-s', abs === 0 ? '1' : '0.95');
          slide.style.setProperty('--nxv-slide-o', abs === 0 ? '1' : '0.45');
          slide.style.setProperty('--nxv-slide-blur', '0px');
          slide.style.setProperty('--nxv-slide-sat', '1');
        } else {
          slide.style.setProperty('--nxv-slide-ry', Math.max(-32, Math.min(32, d * -13)).toFixed(2) + 'deg');
          slide.style.setProperty('--nxv-slide-z', (-abs * 70).toFixed(0) + 'px');
          slide.style.setProperty('--nxv-slide-s', (1 - Math.min(abs * 0.06, 0.2)).toFixed(3));
          slide.style.setProperty('--nxv-slide-o', d === 0 ? '1' : abs === 1 ? '0.6' : '0.25');
          slide.style.setProperty('--nxv-slide-blur', d === 0 ? '0px' : '2.5px');
          slide.style.setProperty('--nxv-slide-sat', d === 0 ? '1' : '0.65');
        }

        slide.classList.toggle('nxv-slide--active', d === 0);
        slide.setAttribute('aria-hidden', visible && d !== 0 ? 'true' : 'false');
        if (visible) {
          slide.removeAttribute('inert');
        } else {
          slide.setAttribute('inert', '');
        }
      });

      if (dots.length) {
        dots.forEach(function (dot, i) {
          if (i === index) {
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.removeAttribute('aria-current');
          }
        });
      }
    }

    function goTo(next) {
      index = (next + slides.length) % slides.length;
      layout();
    }

    function startAutoplay() {
      if (autoplayPaused) return;
      stopAutoplay();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, 6500);
    }

    function stopAutoplay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function pauseAutoplay(permanent) {
      stopAutoplay();
      if (permanent) autoplayPaused = true;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(index - 1);
        pauseAutoplay(true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(index + 1);
        pauseAutoplay(true);
      });
    }

    // Click a side slide to bring it forward.
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () {
        if (i !== index) {
          goTo(i);
          pauseAutoplay(true);
        }
      });
    });

    // Keyboard
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        goTo(index - 1);
        pauseAutoplay(true);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        goTo(index + 1);
        pauseAutoplay(true);
        e.preventDefault();
      }
    });

    // Pause while hovered or focused
    root.addEventListener('pointerenter', stopAutoplay);
    root.addEventListener('pointerleave', function () {
      if (!autoplayPaused) startAutoplay();
    });
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function () {
      if (!autoplayPaused) startAutoplay();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else if (!autoplayPaused) {
        startAutoplay();
      }
    });

    // Swipe / drag
    var startX = 0;
    var dragging = false;

    track.addEventListener(
      'pointerdown',
      function (e) {
        dragging = true;
        startX = e.clientX;
        track.style.transition = 'none';
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerup',
      function (e) {
        if (!dragging) return;
        dragging = false;
        track.style.transition = '';

        var delta = e.clientX - startX;
        if (Math.abs(delta) > 45) {
          goTo(index + (delta < 0 ? 1 : -1));
          pauseAutoplay(true);
        } else {
          layout();
        }
      },
      { passive: true }
    );

    var resizeTimer = null;
    window.addEventListener(
      'resize',
      function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(layout, 150);
      },
      { passive: true }
    );

    layout();
    startAutoplay();

    // Re-measure once webfonts settle so the centring stays exact.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout).catch(function () {});
    }
  }

  function initCarousels() {
    document.querySelectorAll('[data-nxv-carousel]').forEach(function (root) {
      if (root.dataset.nxvCarouselReady === '1') return;
      root.dataset.nxvCarouselReady = '1';
      initCarousel(root);
    });
  }

  /* =========================================================================
     8. Boot
     ========================================================================= */
  function boot() {
    injectAurora();
    initReveal();
    tagTiltTargets(document);
    initCarousels();
    initParallax();
    initMagnetic();
    initCursorAurora();

    // Catch content rendered asynchronously by page scripts (dashboard, etc.).
    [500, 1400, 2600].forEach(function (delay) {
      window.setTimeout(function () {
        tagRevealTargets(document);
        tagTiltTargets(document);
        initMagnetic();
      }, delay);
    });

    // If the user flips the reduced-motion preference, honour it immediately.
    if (REDUCED.addEventListener) {
      REDUCED.addEventListener('change', function (e) {
        if (e.matches) {
          document.querySelectorAll('[data-nxv-reveal]').forEach(function (el) {
            el.classList.add('nxv-in');
          });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Public API — lets page scripts re-scan after they inject markup. */
  window.NEXVION = window.NEXVION || {};
  window.NEXVION.motion = {
    refresh: function () {
      tagRevealTargets(document);
      tagTiltTargets(document);
      initMagnetic();
      initCarousels();
    },
    reducedMotion: isReduced
  };
})();
