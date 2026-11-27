const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.querySelectorAll("[data-copy]").forEach((el) => {
  el.addEventListener("click", async () => {
    const text = el.getAttribute("data-copy");
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast(`Đã sao chép: ${text}`);
    } catch {
      showToast("Không thể tự sao chép, hãy copy thủ công.");
    }
  });
});

// Interactive Dorito Beat: spring bounce + subtle drum hi-hat tap on explicit click
const doritoBtn = document.getElementById("dorito-btn");
const beatCountEl = document.getElementById("beat-count");
let beatCount = 0;
let audioCtx = null;

function playDrumTap() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.085);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Audio playback is optional
  }
}

if (doritoBtn && beatCountEl) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  doritoBtn.addEventListener("click", () => {
    beatCount += 1;
    beatCountEl.textContent = `${beatCount} ${beatCount === 1 ? "hit" : "hits"}`;
    playDrumTap();

    if (!prefersReducedMotion) {
      doritoBtn.classList.remove("is-bouncing");
      void doritoBtn.offsetWidth;
      doritoBtn.classList.add("is-bouncing");
    }
  });
}
