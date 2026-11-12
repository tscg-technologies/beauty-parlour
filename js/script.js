/**
 * BEAUTY PARLOUR - Global JavaScript
 * Handles: Mobile Navigation, Sticky Header, FAQ Accordion,
 * Service Filtering, Form Validations, Lightbox, Back to Top
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initFaqAccordion();
  initServiceFilters();
  initAppointmentForms();
  initLightbox();
  initBackToTop();
  highlightActiveNav();
});

/* --------------------------------------------------------------------------
   1. Highlight Active Nav Link
   -------------------------------------------------------------------------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '&#9776;';
    }
  });

  // Close when link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '&#9776;';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Sticky Header with Scroll Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs in the same container for clean accordion effect
      const parentContainer = item.closest('.faq-container');
      if (parentContainer) {
        parentContainer.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Service Category Filters (Services Page)
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  if (filterButtons.length === 0 || serviceCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Appointment & Contact Forms Handling
   -------------------------------------------------------------------------- */
function initAppointmentForms() {
  const forms = document.querySelectorAll('.appointment-form, .contact-form, .enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        const value = input.value.trim();
        let fieldValid = true;

        if (!value) {
          fieldValid = false;
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) fieldValid = false;
        } else if (input.type === 'tel') {
          // Indian phone format or general 10 digit check
          const phoneRegex = /^[0-9+\s-]{8,15}$/;
          if (!phoneRegex.test(value)) fieldValid = false;
        }

        if (!fieldValid) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }

        // Clear error on input
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
        }, { once: true });
      });

      const alertBox = form.querySelector('.form-alert') || createFormAlert(form);

      if (isValid) {
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = `
          <strong>Appointment Request Received (Demonstration Only)</strong><br>
          Thank you! This is a frontend demonstration website. No real booking has been submitted, 
          and no customer information has been sent or stored externally.
        `;
        alertBox.style.display = 'block';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
      } else {
        alertBox.className = 'form-alert warning';
        alertBox.innerHTML = `Please review and fill in all required fields accurately.`;
        alertBox.style.display = 'block';
      }
    });
  });
}

function createFormAlert(form) {
  const alert = document.createElement('div');
  alert.className = 'form-alert';
  form.prepend(alert);
  return alert;
}

/* --------------------------------------------------------------------------
   7. Reusable Placeholder Lightbox / Detail Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  if (!modal) return;

  const modalTitle = modal.querySelector('.lightbox-title');
  const modalDesc = modal.querySelector('.lightbox-desc');
  const imgContainer = document.getElementById('lightbox-img-container');
  const closeBtn = modal.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const galleryImages = {
    'beauty-parlour-hero': 'assets/images/beauty-parlour-hero.jpg',
    'beauty-facial-skincare': 'assets/images/beauty-facial-skincare.jpg',
    'beauty-hair-styling': 'assets/images/beauty-hair-styling.jpg',
    'beauty-bridal-makeup': 'assets/images/beauty-bridal-makeup.jpg',
    'beauty-manicure-pedicure': 'assets/images/beauty-manicure-pedicure.jpg',
    'beauty-waxing-threading': 'assets/images/beauty-waxing-threading.jpg',
    'beauty-spa-massage': 'assets/images/beauty-spa-massage.jpg',
    'beauty-parlour-interior': 'assets/images/beauty-parlour-interior.jpg'
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || 'BEAUTY PARLOUR Experience';
      const desc = item.getAttribute('data-desc') || 'Premium service presentation placeholder.';
      const placeholder = item.querySelector('.img-placeholder');
      let imageSrc = 'assets/images/beauty-parlour-hero.jpg';

      if (placeholder) {
        for (const key of Object.keys(galleryImages)) {
          if (placeholder.classList.contains(key)) {
            imageSrc = galleryImages[key];
            break;
          }
        }
      }

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      if (imgContainer) {
        imgContainer.style.backgroundImage = `url('${imageSrc}')`;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
