// ---------- 页脚年份：自动取当前年，不用每年手动改 ----------
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- 轻提示气泡 ----------
// 任何带 data-toast="文字" 的元素，点击后都会弹出那句话
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  // 如果连续点击，重新计时，而不是叠加多个定时器
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
