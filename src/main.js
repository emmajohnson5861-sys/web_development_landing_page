import './index.css';
import './estimate.js';
import './footer.js';
import { initEntrancePopup } from './popup.js';
import Lenis from 'lenis';

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('is-open');
  setTimeout(() => {
    if (menuButton.getAttribute('aria-expanded') === 'false') {
      mobileMenu.hidden = true;
    }
  }, 550);
}

function openMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close menu');
  mobileMenu.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open');
    });
  });
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.querySelectorAll('a').forEach((l) => l.classList.remove('is-active'));
    link.classList.add('is-active');
    closeMenu();
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const smoothScroll = new Lenis({
  autoRaf: true,
  anchors: true,
  smoothWheel: true,
  wheelMultiplier: .9,
  lerp: .085,
});
window.smoothScroll = smoothScroll;
const videos = document.querySelectorAll('.shared-video');

const whoSection = document.querySelector('.who');
const whoStatement = document.querySelector('.who-statement');
const whoWords = whoStatement.textContent.trim().split(/\s+/);
whoStatement.replaceChildren(...whoWords.flatMap((word, index) => {
  const span = document.createElement('span');
  span.className = 'who-word';
  span.textContent = word;
  return index === whoWords.length - 1 ? [span] : [span, document.createTextNode(' ')];
}));
const whoWordElements = [...whoStatement.querySelectorAll('.who-word')];
let whoFrame = 0;

function measureWhoStatement() {
  const centeredTop = Math.max(20, (window.innerHeight - whoStatement.offsetHeight) / 2);
  whoStatement.style.setProperty('--who-sticky-top', `${centeredTop}px`);
  queueWhoUpdate();
}

function updateWhoWords() {
  whoFrame = 0;
  if (reduceMotion.matches) {
    whoWordElements.forEach((word) => word.classList.add('is-revealed'));
    return;
  }

  const sectionTop = whoSection.getBoundingClientRect().top;
  const start = window.innerHeight * .625;
  const end = -window.innerHeight * .25;
  const progress = Math.max(0, Math.min(1, (start - sectionTop) / (start - end)));
  whoWordElements.forEach((word, index) => {
    word.classList.toggle('is-revealed', progress >= (index + .5) / whoWordElements.length);
  });
}

function queueWhoUpdate() {
  if (!whoFrame) whoFrame = requestAnimationFrame(updateWhoWords);
}

window.addEventListener('scroll', queueWhoUpdate, { passive: true });
window.addEventListener('resize', measureWhoStatement);
smoothScroll.on('scroll', queueWhoUpdate);
reduceMotion.addEventListener('change', queueWhoUpdate);
measureWhoStatement();
document.fonts?.ready.then(measureWhoStatement);

const whoImageTrack = document.querySelector('.who-image-track');
const whoImageStage = document.querySelector('.who-image-stage');
const whoImage = whoImageStage.querySelector('img');
let whoImageFrame = 0;

function updateWhoImage() {
  whoImageFrame = 0;
  const viewportWidth = whoImageStage.clientWidth;
  const viewportHeight = whoImageStage.clientHeight;
  const startSize = Math.min(562, viewportWidth - 34, viewportHeight * .78);
  const startRadius = viewportWidth <= 620 ? 9 : 12;
  const trackTop = whoImageTrack.getBoundingClientRect().top;
  const progress = reduceMotion.matches ? 0 : Math.max(0, Math.min(1, -trackTop / (viewportHeight * .95)));
  const eased = progress * progress * (3 - 2 * progress);
  const width = startSize + (viewportWidth - startSize) * eased;
  const height = startSize + (viewportHeight - startSize) * eased;
  whoImage.style.width = `${width.toFixed(2)}px`;
  whoImage.style.height = `${height.toFixed(2)}px`;
  whoImage.style.borderRadius = `${(startRadius * (1 - eased)).toFixed(2)}px`;
}

function queueWhoImageUpdate() {
  if (!whoImageFrame) whoImageFrame = requestAnimationFrame(updateWhoImage);
}

window.addEventListener('scroll', queueWhoImageUpdate, { passive: true });
window.addEventListener('resize', queueWhoImageUpdate);
smoothScroll.on('scroll', queueWhoImageUpdate);
reduceMotion.addEventListener('change', queueWhoImageUpdate);
queueWhoImageUpdate();

if (reduceMotion.matches) {
  videos.forEach((video) => {
    video.addEventListener('loadeddata', () => video.pause(), { once: true });
  });
}

const serviceRows = [...document.querySelectorAll('.service-row')];
const serviceList = document.querySelector('.services-list');
const serviceImages = [...document.querySelectorAll('.services-feature-image')];

function setServiceImage(index) {
  serviceImages.forEach((image, imageIndex) => {
    image.classList.toggle('is-current', imageIndex === index);
  });
}

serviceList.addEventListener('pointerleave', () => {
  if (!serviceList.querySelector(':focus-visible')) setServiceImage(0);
});

serviceRows.forEach((row, index) => {
  row.addEventListener('pointerenter', () => setServiceImage(index));
  row.addEventListener('focus', () => setServiceImage(index));
  row.addEventListener('blur', () => {
    if (!serviceList.matches(':hover')) setServiceImage(0);
  });
});

const processSection = document.querySelector('.process');
const processGrid = document.querySelector('.process-grid');
let processFrame = 0;
let processShift = 0;
let processInitialized = false;

function updateProcessCards() {
  processFrame = 0;
  if (window.innerWidth <= 760 || reduceMotion.matches) {
    processGrid.style.removeProperty('--process-shift');
    processGrid.style.removeProperty('--process-shift-reverse');
    processInitialized = false;
    return;
  }

  const sectionTop = processSection.getBoundingClientRect().top;
  const target = Math.max(0, Math.min(100,
    ((sectionTop + window.innerHeight * .27) / window.innerHeight) * 95
  ));

  processShift = processInitialized ? processShift + (target - processShift) * .2 : target;
  processInitialized = true;
  if (Math.abs(target - processShift) < .02) processShift = target;
  processGrid.style.setProperty('--process-shift', `${processShift.toFixed(3)}%`);
  processGrid.style.setProperty('--process-shift-reverse', `${(-processShift).toFixed(3)}%`);
  if (processShift !== target) processFrame = requestAnimationFrame(updateProcessCards);
}

function queueProcessUpdate() {
  if (!processFrame) processFrame = requestAnimationFrame(updateProcessCards);
}

window.addEventListener('scroll', queueProcessUpdate, { passive: true });
window.addEventListener('resize', queueProcessUpdate);
smoothScroll.on('scroll', queueProcessUpdate);
reduceMotion.addEventListener('change', queueProcessUpdate);
updateProcessCards();

const workStack = document.querySelector('.work-stack');
const workCards = workStack ? [...workStack.querySelectorAll('.work-card')] : [];
const workTitle = document.getElementById('work-title');
let workFrame = 0;
let workBlurTimer = 0;
let lastWorkScroll = window.scrollY;
let lastWorkTime = performance.now();

function updateWorkCards() {
  workFrame = 0;
  if (!workStack || !workCards.length) return;

  if (window.innerWidth <= 760 || window.innerHeight <= 600 || reduceMotion.matches) {
    workCards.forEach((card) => {
      card.style.removeProperty('--work-card-scale');
      card.style.removeProperty('--work-motion-blur');
    });
    if (workTitle) {
      workTitle.style.removeProperty('--work-title-scale');
    }
    return;
  }

  const now = performance.now();
  const velocity = Math.abs(window.scrollY - lastWorkScroll) / Math.max(16, now - lastWorkTime);
  const motionBlur = Math.min(3.8, velocity * 3.4);
  lastWorkScroll = window.scrollY;
  lastWorkTime = now;
  const stackTop = workStack.getBoundingClientRect().top;
  const stickyTop = parseFloat(getComputedStyle(workCards[0]).top);
  const stackGap = parseFloat(getComputedStyle(workStack).rowGap) || 0;

  if (workTitle) {
    const scrolledPastSticky = stickyTop - stackTop;
    if (scrolledPastSticky <= 0) {
      workTitle.style.setProperty('--work-title-scale', '1');
    } else {
      const scrollRange = Math.max(250, (workCards[0].offsetHeight || 380) * 0.9);
      const progress = Math.min(1, scrolledPastSticky / scrollRange);
      const smoothProgress = progress * progress * (3 - 2 * progress);
      const minScale = 0.7;
      const titleScale = 1 - (1 - minScale) * smoothProgress;
      workTitle.style.setProperty('--work-title-scale', titleScale.toFixed(4));
    }
  }

  let naturalOffset = 0;
  workCards.forEach((card) => {
    const naturalTop = stackTop + naturalOffset;
    const entryProgress = Math.min(1, Math.max(0,
      (naturalTop - stickyTop) / Math.max(1, window.innerHeight - stickyTop)
    ));
    const scale = 1 - .2 * Math.pow(entryProgress, 1.3);
    card.style.setProperty('--work-card-scale', scale.toFixed(4));
    card.style.setProperty('--work-motion-blur', `${motionBlur.toFixed(2)}px`);
    naturalOffset += card.offsetHeight + stackGap;
  });

  window.clearTimeout(workBlurTimer);
  workBlurTimer = window.setTimeout(() => {
    workCards.forEach((card) => card.style.removeProperty('--work-motion-blur'));
  }, 120);
}

function queueWorkUpdate() {
  if (!workFrame) workFrame = requestAnimationFrame(updateWorkCards);
}

window.addEventListener('scroll', queueWorkUpdate, { passive: true });
window.addEventListener('resize', queueWorkUpdate);
smoothScroll.on('scroll', queueWorkUpdate);
reduceMotion.addEventListener('change', queueWorkUpdate);
queueWorkUpdate();

const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
testimonialCards.forEach((card) => {
  const quote = card.querySelector('.testimonial-quote');
  const words = quote.textContent.trim().split(/\s+/);
  quote.replaceChildren(...words.flatMap((word, index) => {
    const span = document.createElement('span');
    span.className = 'testimonial-word';
    span.textContent = word;
    return index === words.length - 1 ? [span] : [span, document.createTextNode(' ')];
  }));
  card.reviewWords = [...quote.querySelectorAll('.testimonial-word')];
});

let testimonialFrame = 0;
function updateTestimonialWords() {
  testimonialFrame = 0;
  const start = window.innerHeight * .86;
  const end = window.innerHeight * .22;
  testimonialCards.forEach((card) => {
    const progress = reduceMotion.matches ? 1 : Math.max(0, Math.min(1, (start - card.getBoundingClientRect().top) / (start - end)));
    const litCount = Math.round(progress * card.reviewWords.length);
    card.reviewWords.forEach((word, index) => word.classList.toggle('is-lit', index < litCount));
  });
}

function queueTestimonialUpdate() {
  if (!testimonialFrame) testimonialFrame = requestAnimationFrame(updateTestimonialWords);
}

window.addEventListener('scroll', queueTestimonialUpdate, { passive: true });
window.addEventListener('resize', queueTestimonialUpdate);
smoothScroll.on('scroll', queueTestimonialUpdate);
reduceMotion.addEventListener('change', queueTestimonialUpdate);
queueTestimonialUpdate();

// The SVG clip uses objectBoundingBox coordinates. Convert pixel radii for both
// axes so its curved corners stay circular as the video changes size.
const showcaseMask = document.querySelector('.showcase-video-mask');
const showcaseAction = document.querySelector('.showcase-action');
const showcasePath = document.querySelector('#showcase-clip path');
const bezier = 0.55228475;

function updateShowcaseMask() {
  const width = showcaseMask.clientWidth;
  const height = showcaseMask.clientHeight;
  if (!width || !height) return;

  const actionHeight = showcaseAction.offsetHeight;
  const tailX = width - showcaseAction.offsetWidth;
  const mainBottom = height - actionHeight;
  const topRadius = Math.min(38, width * 0.055, height * 0.1);
  const rightRadius = Math.min(38, width * 0.06, height * 0.1);
  const innerRadius = Math.min(55, width * 0.08, actionHeight * 0.55);
  const tailRadius = Math.min(40, width * 0.06, actionHeight * 0.4);
  // The left edge forms a short upper ledge, then steps inward for the
  // remaining height, matching the rounded silhouette in the reference.
  const leftX = width * 0.12;
  const leftRadius = Math.min(40, width * 0.05, height * 0.1);
  const leftBottom = Math.max(topRadius + leftRadius + 18, height * 0.24);
  const leftInner = Math.min(50, width * 0.06, height * 0.12, leftX - leftRadius - 10);
  const bottomRadius = Math.min(34, width * 0.05, height * 0.08);

  const x = (value) => (value / width).toFixed(6);
  const y = (value) => (value / height).toFixed(6);
  const point = (px, py) => `${x(px)} ${y(py)}`;

  showcasePath.setAttribute('d', [
    `M ${point(topRadius, 0)}`,
    `H ${x(width - topRadius)}`,
    `C ${point(width - topRadius + bezier * topRadius, 0)} ${point(width, topRadius - bezier * topRadius)} ${point(width, topRadius)}`,
    `V ${y(mainBottom - rightRadius)}`,
    `C ${point(width, mainBottom - rightRadius + bezier * rightRadius)} ${point(width - rightRadius + bezier * rightRadius, mainBottom)} ${point(width - rightRadius, mainBottom)}`,
    `H ${x(tailX + innerRadius)}`,
    `C ${point(tailX + innerRadius - bezier * innerRadius, mainBottom)} ${point(tailX, mainBottom + innerRadius - bezier * innerRadius)} ${point(tailX, mainBottom + innerRadius)}`,
    `V ${y(height - tailRadius)}`,
    `C ${point(tailX, height - tailRadius + bezier * tailRadius)} ${point(tailX - tailRadius + bezier * tailRadius, height)} ${point(tailX - tailRadius, height)}`,
    `H ${x(leftX + bottomRadius)}`,
    `C ${point(leftX + bottomRadius - bezier * bottomRadius, height)} ${point(leftX, height - bottomRadius + bezier * bottomRadius)} ${point(leftX, height - bottomRadius)}`,
    `V ${y(leftBottom + leftInner)}`,
    `C ${point(leftX, leftBottom + leftInner - bezier * leftInner)} ${point(leftX - leftInner + bezier * leftInner, leftBottom)} ${point(leftX - leftInner, leftBottom)}`,
    `H ${x(leftRadius)}`,
    `C ${point(leftRadius - bezier * leftRadius, leftBottom)} ${point(0, leftBottom - leftRadius + bezier * leftRadius)} ${point(0, leftBottom - leftRadius)}`,
    `V ${y(topRadius)}`,
    `C ${point(0, topRadius - bezier * topRadius)} ${point(topRadius - bezier * topRadius, 0)} ${point(topRadius, 0)} Z`,
  ].join(' '));
}

updateShowcaseMask();
if ('ResizeObserver' in window) {
  new ResizeObserver(updateShowcaseMask).observe(showcaseMask);
} else {
  window.addEventListener('resize', updateShowcaseMask);
}

function animateCount(element) {
  if (element.dataset.animated) return;
  element.dataset.animated = 'true';
  const finalValue = Number(element.dataset.count);
  if (reduceMotion.matches) return;
  const duration = 1300;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(finalValue * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  element.textContent = '0';
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.count').forEach(animateCount);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));
}

/* ==========================================================================
   Heading Entrance Reveal Animations (matching algofort-ten.vercel.app)
   ========================================================================== */
function splitTextIntoChars(el) {
  if (!el || el.dataset.splitDone) return;
  el.classList.add('title-reveal');
  
  let charIndex = 0;
  
  function split(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text) return null;
      const fragment = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part.length > 0) {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'word-wrap';
          
          for (const ch of part) {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.style.setProperty('--char-index', charIndex++);
            charSpan.textContent = ch;
            wordWrap.appendChild(charSpan);
          }
          
          fragment.appendChild(wordWrap);
        }
      });
      return fragment;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') return null;
      Array.from(node.childNodes).forEach((child) => {
        const replacement = split(child);
        if (replacement) node.replaceChild(replacement, child);
      });
    }
    return null;
  }
  
  split(el);
  el.dataset.splitDone = 'true';
}

function initHeadingAnimations() {
  const targetElements = document.querySelectorAll([
    '#services-title',
    '#process-title',
    '#work-title',
    '#trust-title',
    '#why-trust h3',
    '#testimonials-title',
    '#estimate-title'
  ].join(', '));

  if (!targetElements.length) return;

  targetElements.forEach(splitTextIntoChars);

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    targetElements.forEach((el) => el.classList.add('is-title-visible'));
    return;
  }

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-title-visible');
      titleObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

  targetElements.forEach((el) => {
    titleObserver.observe(el);
  });
}

initHeadingAnimations();
initEntrancePopup();

