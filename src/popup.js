/**
 * Entrance Popup Component for Algofort
 * Displays on page load unless the visitor chooses "Don't show again"
 */

const POPUP_STORAGE_KEY = 'algofort_dont_show_popup';
const POPUP_COOKIE_NAME = 'algofort_dont_show_popup';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function hasSeenPopup() {
  try {
    if (localStorage.getItem(POPUP_STORAGE_KEY) === 'true') return true;
  } catch (e) {
    // LocalStorage might be restricted
  }
  return getCookie(POPUP_COOKIE_NAME) === 'true';
}

function markPopupAsSeen() {
  try {
    localStorage.setItem(POPUP_STORAGE_KEY, 'true');
  } catch (e) {
    // Ignore storage errors
  }
  setCookie(POPUP_COOKIE_NAME, 'true', 365);
}

function unmarkPopupAsSeen() {
  try {
    localStorage.removeItem(POPUP_STORAGE_KEY);
  } catch (e) {
    // Ignore storage errors
  }
  document.cookie = `${POPUP_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
}

export function initEntrancePopup() {
  const backdrop = document.getElementById('entrance-popup');
  if (!backdrop) return;

  // Clean legacy auto-dismiss key so users are not blocked by previous versions
  try {
    localStorage.removeItem('algofort_entrance_popup_seen');
  } catch (e) {}

  const modal = backdrop.querySelector('.entrance-popup-modal');
  const closeBtn = backdrop.querySelector('.entrance-popup-close');
  const form = backdrop.querySelector('.entrance-popup-form');
  const statusEl = backdrop.querySelector('.entrance-popup-status');
  const dontShowCheckbox = backdrop.querySelector('#popup-dont-show');

  let isOpen = false;

  function openPopup() {
    if (isOpen) return;
    isOpen = true;
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-locked');

    // Pause Lenis smooth scroll if present
    if (window.smoothScroll && typeof window.smoothScroll.stop === 'function') {
      window.smoothScroll.stop();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.classList.add('is-visible');
      });
    });
  }

  function handleDismiss() {
    if (dontShowCheckbox && dontShowCheckbox.checked) {
      markPopupAsSeen();
    }
    closePopup();
  }

  function closePopup() {
    if (!isOpen) return;
    isOpen = false;
    backdrop.classList.remove('is-visible');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-locked');

    // Resume Lenis smooth scroll
    if (window.smoothScroll && typeof window.smoothScroll.start === 'function') {
      window.smoothScroll.start();
    }
  }

  // Sync checkbox changes to storage immediately
  if (dontShowCheckbox) {
    dontShowCheckbox.addEventListener('change', () => {
      if (dontShowCheckbox.checked) {
        markPopupAsSeen();
      } else {
        unmarkPopupAsSeen();
      }
    });
  }

  // Event Listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleDismiss();
    });
  }

  // Close when clicking backdrop outside modal
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      handleDismiss();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      handleDismiss();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (dontShowCheckbox && dontShowCheckbox.checked) {
        markPopupAsSeen();
      }

      const submitBtn = form.querySelector('.entrance-popup-submit');
      const formData = new FormData(form);
      const name = formData.get('name');

      if (submitBtn) submitBtn.disabled = true;

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.className = 'entrance-popup-status';
        statusEl.textContent = 'Sending your enquiry...';
      }

      // Simulate polite submission feedback
      setTimeout(() => {
        if (statusEl) {
          statusEl.className = 'entrance-popup-status is-success';
          statusEl.textContent = `Thank you, ${name || 'there'}! Your enquiry has been received. We’ll get back to you shortly.`;
        }
        form.reset();

        setTimeout(() => {
          closePopup();
          if (submitBtn) submitBtn.disabled = false;
        }, 1800);
      }, 700);
    });
  }

  // Developer helpers for easy verification in console
  window.openEntrancePopup = openPopup;
  window.resetEntrancePopup = () => {
    try {
      localStorage.removeItem(POPUP_STORAGE_KEY);
      localStorage.removeItem('algofort_entrance_popup_seen');
    } catch (e) {}
    document.cookie = `${POPUP_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
    document.cookie = `algofort_entrance_popup_seen=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
    if (dontShowCheckbox) dontShowCheckbox.checked = false;
    console.log('Entrance popup preference reset. Refresh to see page-load popup.');
  };

  // Trigger entrance popup on page load if not opted out
  if (!hasSeenPopup()) {
    const triggerPopup = () => {
      setTimeout(openPopup, 200);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      triggerPopup();
    } else {
      window.addEventListener('DOMContentLoaded', triggerPopup, { once: true });
    }
  }
}
