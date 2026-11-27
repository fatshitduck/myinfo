const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Kinetic Erist Title — cycles smoothly every 3 seconds across 6 display modes
(function initKineticErist() {
  const stage = document.getElementById("erist-stage");
  if (!stage) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let timers = [];
  let modeIndex = 0;

  function clearAllTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function resetClasses() {
    stage.className = "";
  }

  // Mode 0: Typewriter
  function runTypewriter() {
    resetClasses();
    stage.classList.add("font-bricolage");
    const target = "Erist";
    let len = 0;

    function tick() {
      len += 1;
      stage.innerHTML = `${target.slice(0, len)}<span class="erist-caret" aria-hidden="true"></span>`;
      if (len < target.length) {
        later(tick, 175);
      }
    }
    stage.innerHTML = `<span class="erist-caret" aria-hidden="true"></span>`;
    later(tick, 140);
  }

  // Mode 1: Continuous Font Morph
  function runFontMorph() {
    const fonts = [
      "font-bricolage",
      "font-playfair",
      "font-orbitron",
      "font-silkscreen",
      "font-caveat",
      "font-mono",
    ];
    let step = 0;

    function tick() {
      resetClasses();
      stage.classList.add(fonts[step % fonts.length]);
      stage.textContent = "Erist";
      step += 1;
      if (step < 9) {
        later(tick, 280);
      }
    }
    tick();
  }

  // Mode 2: International Morse Code (E R I S T)
  function runMorse() {
    resetClasses();
    stage.classList.add("font-mono", "is-compact");
    const groups = ["·", "·−·", "··", "···", "−"];
    stage.innerHTML = `<span class="morse-line">${groups
      .map((g, i) => `<span class="morse-group" data-morse="${i}">${g}</span>`)
      .join("")}</span>`;

    const els = Array.from(stage.querySelectorAll(".morse-group"));
    let idx = 0;

    function pulse() {
      els.forEach((el, i) => el.classList.toggle("is-lit", i === idx));
      idx += 1;
      if (idx < els.length) {
        later(pulse, 360);
      } else {
        later(() => els.forEach((el) => el.classList.add("is-lit")), 360);
      }
    }
    later(pulse, 120);
  }

  // Mode 3: Glyph Scramble Decode
  function runScramble() {
    resetClasses();
    stage.classList.add("font-mono");
    const target = "Erist";
    const glyphs = "#/01*_+=-";
    let frame = 0;

    function tick() {
      const locked = Math.floor(frame / 4);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (i < locked) {
          out += target[i];
        } else {
          out += glyphs[(frame * 3 + i * 5) % glyphs.length];
        }
      }
      stage.textContent = out;
      frame += 1;
      if (locked <= target.length) {
        later(tick, 65);
      } else {
        resetClasses();
        stage.classList.add("font-bricolage");
        stage.textContent = target;
      }
    }
    tick();
  }

  // Mode 4: Staggered Wave Letters
  function runWave() {
    resetClasses();
    stage.classList.add("font-bricolage");
    const chars = ["E", "r", "i", "s", "t"];
    stage.innerHTML = chars
      .map(
        (ch, i) =>
          `<span class="erist-wave-char" style="--delay:${i * 70}ms">${ch}</span>`
      )
      .join("");
  }

  // Mode 5: Binary Flash -> ERIST -> Erist
  function runBinaryFlash() {
    resetClasses();
    stage.classList.add("font-mono", "is-compact");
    stage.textContent = "01000101 01110010";
    later(() => {
      resetClasses();
      stage.classList.add("font-orbitron", "is-wide-track");
      stage.textContent = "ERIST";
    }, 750);
    later(() => {
      resetClasses();
      stage.classList.add("font-bricolage");
      stage.textContent = "Erist";
    }, 1900);
  }

  const modes = [
    runTypewriter,
    runFontMorph,
    runMorse,
    runScramble,
    runWave,
    runBinaryFlash,
  ];

  modes[modeIndex]();
  setInterval(() => {
    clearAllTimers();
    modeIndex = (modeIndex + 1) % modes.length;
    modes[modeIndex]();
  }, 3000);
})();

// Animated Water-Blowing Faded-Yellow Liquid WebGL Shader
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
    uniform vec2 u_vel;
    uniform float u_scroll;
    uniform vec4 u_ripples[28];

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

    float baseLiquidHeight(vec2 p, float t) {
      vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0) + t * 0.165),
        fbm(p + vec2(5.2, 1.3) - t * 0.14)
      );
      vec2 r = vec2(
        fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.115),
        fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.125)
      );
      return fbm(p + 1.9 * r);
    }

    vec3 evalSurface(vec2 p, vec2 mPos, float aspect, float t) {
      float h = baseLiquidHeight(p, t);
      float hx = baseLiquidHeight(p + vec2(0.016, 0.0), t);
      float hy = baseLiquidHeight(p + vec2(0.0, 0.016), t);
      vec2 grad = vec2((hx - h) / 0.016, (hy - h) / 0.016);

      // Cursor air-blow wake: smooth radial depression + directional push
      vec2 toCursor = p - mPos;
      float distC = length(toCursor);
      float blowEnv = exp(-distC * 5.8);
      float wake = -0.14 * blowEnv + dot(toCursor, u_vel) * 0.45 * blowEnv;
      h += wake;
      if (distC > 0.0005) {
        vec2 dirC = toCursor / distC;
        grad += dirC * (0.14 * 5.8 * blowEnv) + u_vel * (0.45 * blowEnv);
      }

      // 28-point expanding water ripples along pointer trail
      for (int i = 0; i < 28; i++) {
        vec4 rp = u_ripples[i];
        float age = t - rp.z;
        if (rp.w > 0.001 && age > 0.0 && age < 2.6) {
          vec2 dVec = p - rp.xy;
          float d = length(dVec);
          float phase = d * 24.0 - age * 11.0;
          float env = exp(-age * 1.95) * exp(-d * 4.4) * rp.w;
          float wave = sin(phase) * env * 0.055;
          h += wave;
          if (d > 0.0005) {
            vec2 rDir = dVec / d;
            float dWave = (cos(phase) * 24.0 - sin(phase) * 4.4) * env * 0.055;
            grad += rDir * dWave;
          }
        }
      }

      return vec3(h, grad);
    }

    void main() {
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 uv = v_uv;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.65;
      p.y -= u_scroll * 0.35;

      vec2 mPos = (u_mouse - 0.5) * vec2(aspect, 1.0) * 1.65;
      mPos.y -= u_scroll * 0.35;

      vec3 surf = evalSurface(p, mPos, aspect, u_time);
      float h = surf.x;
      vec3 normal = normalize(vec3(-surf.y * 1.35, -surf.z * 1.35, 1.0));

      vec3 ivory   = vec3(1.000, 0.992, 0.960); // #FFFDF5
      vec3 butter  = vec3(0.996, 0.945, 0.686); // #FEF1AF
      vec3 sunGold = vec3(0.969, 0.824, 0.298); // #F7D24C
      vec3 amber   = vec3(0.890, 0.663, 0.110); // #E3A91C

      vec3 base = mix(amber, sunGold, smoothstep(0.18, 0.45, h));
      base = mix(base, butter, smoothstep(0.42, 0.70, h));
      base = mix(base, ivory, smoothstep(0.68, 0.96, h));

      vec3 lightDir = normalize(vec3(-0.35, 0.58, 0.74));
      float spec = pow(max(dot(normal, lightDir), 0.0), 14.0);
      vec3 col = mix(base, ivory, clamp(spec * 0.58, 0.0, 0.72));

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
  const uVel = gl.getUniformLocation(program, "u_vel");
  const uScroll = gl.getUniformLocation(program, "u_scroll");
  const uRipples = gl.getUniformLocation(program, "u_ripples");

  const MAX_RIPPLES = 28;
  const ripples = new Float32Array(MAX_RIPPLES * 4);
  for (let i = 0; i < MAX_RIPPLES; i++) {
    ripples[i * 4 + 2] = -99.0;
  }
  let rippleHead = 0;

  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let velX = 0;
  let velY = 0;
  let lastSpawnX = 0.5;
  let lastSpawnY = 0.5;
  let lastSpawnTime = 0;

  const startTime = performance.now();

  function currentTimeSec() {
    return (performance.now() - startTime) * 0.001;
  }

  function toShaderSpace(uvX, uvY) {
    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    const scrollFrac =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const px = (uvX - 0.5) * aspect * 1.65;
    const py = (uvY - 0.5) * 1.65 - scrollFrac * 0.35;
    return [px, py];
  }

  function pushRipple(uvX, uvY, strength) {
    const [px, py] = toShaderSpace(uvX, uvY);
    const base = rippleHead * 4;
    ripples[base] = px;
    ripples[base + 1] = py;
    ripples[base + 2] = currentTimeSec();
    ripples[base + 3] = strength;
    rippleHead = (rippleHead + 1) % MAX_RIPPLES;
  }

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
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);

      const dx = nx - targetMouseX;
      const dy = ny - targetMouseY;
      velX = Math.max(-0.85, Math.min(0.85, velX * 0.5 + dx * 18.0));
      velY = Math.max(-0.85, Math.min(0.85, velY * 0.5 + dy * 18.0));

      targetMouseX = nx;
      targetMouseY = ny;

      const distMoved = Math.hypot(nx - lastSpawnX, ny - lastSpawnY);
      const now = performance.now();
      if (distMoved >= 0.014 || (distMoved >= 0.004 && now - lastSpawnTime >= 28)) {
        const strength = Math.max(0.55, Math.min(1.25, distMoved * 26.0));
        pushRipple(nx, ny, strength);
        lastSpawnX = nx;
        lastSpawnY = ny;
        lastSpawnTime = now;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
      pushRipple(nx, ny, 1.45);
    },
    { passive: true }
  );

  resize();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    mouseX += (targetMouseX - mouseX) * 0.14;
    mouseY += (targetMouseY - mouseY) * 0.14;
    velX *= 0.9;
    velY *= 0.9;

    const scrollFrac =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, currentTimeSec());
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform2f(uVel, velX, velY);
    gl.uniform1f(uScroll, scrollFrac);
    gl.uniform4fv(uRipples, ripples);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
})();
