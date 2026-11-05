// ============================================================
// 个人主页 · 交互脚本
// 只做三件小事：年份、导航状态、滚动淡入，外加一个提示气泡
// ============================================================

// ---------- 页脚年份 ----------
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- 顶栏：页面滚动后出现细线阴影 ----------
const header = document.querySelector('.site-header');
if (header) {
  const syncHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

// ---------- 导航：高亮当前所在区块 ----------
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

if (navLinks.length && 'IntersectionObserver' in window) {
  const targets = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove('is-active'));
        const match = targets.find((item) => item.section === entry.target);
        if (match) match.link.classList.add('is-active');
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  targets.forEach((item) => navObserver.observe(item.section));
}

// ---------- 区块滚动淡入 ----------
// 先确认浏览器支持，并且用户没有要求减少动效，才隐藏内容等待淡入
const canAnimate =
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canAnimate) {
  document.documentElement.classList.add('js');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('reveal');
    revealObserver.observe(section);
  });
}

// ---------- 轻提示气泡 ----------
// 任何带 data-toast="文字" 的元素，点击后都会弹出那句话
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  // 连续点击时重新计时，而不是叠加多个定时器
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2400);
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast]');
  if (!trigger) return;

  event.preventDefault();
  showToast(trigger.dataset.toast);
});
