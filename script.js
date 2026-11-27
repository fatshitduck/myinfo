const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Toast notifications + Copy to Clipboard
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

// Minimal Transparent Tab Selector
const tabBar = document.querySelector(".tab-bar");
const tabs = Array.from(document.querySelectorAll(".tab-item"));
const tabIndicator = document.querySelector(".tab-indicator");
const sections = Array.from(document.querySelectorAll("[data-section]"));

function moveIndicator(activeTab) {
  if (!tabIndicator || !activeTab) return;
  tabIndicator.style.width = `${activeTab.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

function selectTab(targetTab) {
  const key = targetTab.getAttribute("data-tab") || "all";

  tabs.forEach((tab) => {
    const active = tab === targetTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });

  moveIndicator(targetTab);

  sections.forEach((sec) => {
    const secKey = sec.getAttribute("data-section");
    const shouldShow = key === "all" || secKey === key;
    if (shouldShow) {
      sec.hidden = false;
      sec.classList.remove("is-entering");
      void sec.offsetWidth;
      sec.classList.add("is-entering");
    } else {
      sec.hidden = true;
      sec.classList.remove("is-entering");
    }
  });
}

if (tabs.length > 0) {
  const initialActive = tabs.find((t) => t.classList.contains("is-active")) || tabs[0];
  moveIndicator(initialActive);

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));

    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = tabs[(index + 1) % tabs.length];
        next.focus();
        selectTab(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        selectTab(prev);
      }
    });
  });

  if (typeof ResizeObserver !== "undefined" && tabBar) {
    const ro = new ResizeObserver(() => {
      const current = tabs.find((t) => t.classList.contains("is-active"));
      if (current) moveIndicator(current);
    });
    ro.observe(tabBar);
  }
  window.addEventListener("resize", () => {
    const current = tabs.find((t) => t.classList.contains("is-active"));
    if (current) moveIndicator(current);
  });
}

// Animated Faded-Yellow Liquid Silk WebGL Shader
(function initLiquidBackground() {
  const canvas = document.getElementById("liquid-bg");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });

  if (!gl) return;

  const vertexSrc = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.52;
      mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 1.95;
        a *= 0.5;
      }
      return v;
    }

    float liquidHeight(vec2 p, float t) {
      vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + t * 0.075),
        fbm(p + vec2(5.2, 1.3) - t * 0.06)
      );
      vec2 r = vec2(
        fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.045),
        fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.05)
      );
      return fbm(p + 1.85 * r);
    }

    void main() {
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 uv = v_uv;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.65;
      p.y -= u_scroll * 0.35;

      vec2 mouseWarp = (u_mouse - 0.5) * 0.28;
      p += mouseWarp * exp(-length(uv - u_mouse) * 1.8);

      float h = liquidHeight(p, u_time);
      float hx = liquidHeight(p + vec2(0.018, 0.0), u_time);
      float hy = liquidHeight(p + vec2(0.0, 0.018), u_time);
      vec3 normal = normalize(vec3((h - hx) * 14.0, (h - hy) * 14.0, 1.0));

      vec3 ivory   = vec3(1.000, 0.992, 0.953); // #FFFDF3
      vec3 butter  = vec3(0.996, 0.953, 0.745); // #FEF3BE
      vec3 sunGold = vec3(0.984, 0.878, 0.482); // #FBE07B
      vec3 honey   = vec3(0.945, 0.780, 0.267); // #F1C744

      vec3 base = mix(honey, sunGold, smoothstep(0.22, 0.48, h));
      base = mix(base, butter, smoothstep(0.45, 0.72, h));
      base = mix(base, ivory, smoothstep(0.68, 0.92, h));

      vec3 lightDir = normalize(vec3(-0.35, 0.55, 0.75));
      float spec = pow(max(dot(normal, lightDir), 0.0), 10.0);
      vec3 col = mix(base, ivory, spec * 0.42);

      // Gentle faded atmospheric wash so ink stays crisp across the screen
      col = mix(col, butter, 0.18);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_resolution");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uMouse = gl.getUniformLocation(program, "u_mouse");
  const uScroll = gl.getUniformLocation(program, "u_scroll");

  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let mouseX = 0.5;
  let mouseY = 0.5;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (e) => {
      targetMouseX = e.clientX / Math.max(window.innerWidth, 1);
      targetMouseY = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
    },
    { passive: true }
  );

  resize();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startTime = performance.now();

  function render(now) {
    mouseX += (targetMouseX - mouseX) * 0.045;
    mouseY += (targetMouseY - mouseY) * 0.045;
    const scrollFrac =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) * 0.001);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform1f(uScroll, scrollFrac);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
})();
