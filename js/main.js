/**
 * Smarta Estate — Marketing Website
 * Main JavaScript — Vanilla JS, no dependencies
 */

(function () {
  'use strict';

  // ============================================
  // Header scroll behavior
  // ============================================
  const header = document.querySelector('.header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ============================================
  // Mobile menu
  // ============================================
  const menuToggle = document.querySelector('.header__toggle');
  const mobileNav = document.querySelector('.header__nav');
  const overlay = document.querySelector('.header__overlay');
  const mobileLinks = document.querySelectorAll('.header__link');

  function openMenu() {
    menuToggle.classList.add('header__toggle--active');
    mobileNav.classList.add('header__nav--open');
    overlay.classList.add('header__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuToggle.classList.remove('header__toggle--active');
    mobileNav.classList.remove('header__nav--open');
    overlay.classList.remove('header__overlay--visible');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (mobileNav.classList.contains('header__nav--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on link click (mobile)
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // Scroll animations (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;

            if (el.classList.contains('animate-on-scroll')) {
              el.classList.add('animate-on-scroll--visible');
            }
            if (el.classList.contains('animate-slide-left')) {
              el.classList.add('animate-slide-left--visible');
            }
            if (el.classList.contains('animate-slide-right')) {
              el.classList.add('animate-slide-right--visible');
            }
            if (el.classList.contains('animate-scale')) {
              el.classList.add('animate-scale--visible');
            }

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    animatedElements.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ============================================
  // Contact form handler (mailto fallback)
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const estate = formData.get('estate') || '';
      const message = formData.get('message') || '';

      const subject = encodeURIComponent(
        'Smarta Estate Enquiry' + (estate ? ' — ' + estate : '')
      );
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (estate ? 'Estate: ' + estate + '\n' : '') +
        '\n' + message
      );

      window.location.href = 'mailto:info@smarta.co.za?subject=' + subject + '&body=' + body;

      // Show confirmation
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Opening email client...';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
    });
  }

  // ============================================
  // Active nav link on scroll
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.style.opacity = '0.7';
          if (link.getAttribute('href') === '#' + sectionId) {
            link.style.opacity = '1';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ============================================
  // Counter animation for stats
  // ============================================
  function animateCounter(el, target, suffix) {
    suffix = suffix || '';
    var current = 0;
    var increment = Math.ceil(target / 40);
    var duration = 1500;
    var stepTime = duration / (target / increment);

    function step() {
      current += increment;
      if (current >= target) {
        current = target;
        el.textContent = current + suffix;
        return;
      }
      el.textContent = current + suffix;
      setTimeout(step, stepTime);
    }

    step();
  }

  // Observe stat elements
  var statElements = document.querySelectorAll('[data-counter]');

  if ('IntersectionObserver' in window && statElements.length > 0) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-counter'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ============================================
  // Keyboard accessibility
  // ============================================
  document.addEventListener('keydown', function (e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Initial header state check
  handleHeaderScroll();

})();
