// Halftone mechanism renderer.
// Pass 1 raymarches the current figure at low resolution into a texture (ink amount).
// Pass 2 samples that texture at the centers of a 45deg dot grid and draws halftone dots.

import { SCENE_HEAD, SCENE_TAIL } from './shader-common';
import { FIGURES, type Figure } from './figures';

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const HALFTONE = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uCell;
uniform float uFade;
uniform float uRaw;
uniform vec3 uPaper;
uniform vec3 uInk;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 fc = gl_FragCoord.xy;
  const float a = 0.78539816;
  float c = cos(a), s = sin(a);
  vec2 g = vec2(c*fc.x + s*fc.y, -s*fc.x + c*fc.y) / uCell;
  vec2 id = floor(g) + 0.5;
  vec2 f = g - id;
  vec2 cc = id * uCell;
  vec2 center = vec2(c*cc.x - s*cc.y, s*cc.x + c*cc.y);

  // Tone is read per pixel so neighboring cells blend smoothly; the cell center
  // decides whether a dot exists at all (keeps whole dots along silhouettes).
  float inkCell = texture(uTex, center / uRes).r;
  float ink = max(texture(uTex, fc / uRes).r, 0.6*inkCell);

  // figure transitions: each dot shrinks / grows on its own slightly staggered clock
  float h = hash(id);
  ink *= smoothstep(h*0.55, h*0.55 + 0.45, uFade);

  // Euclidean spot: round dots in highlights, a clean checkerboard at 50%,
  // inverted (paper) dots in the shadows. Avoids blotchy merging in midtones.
  float spot = 0.5*(cos(6.2831853*f.x) + cos(6.2831853*f.y));
  float thr = 1.0 - 2.0*pow(clamp(ink, 0.0, 1.0), 1.2);
  float w = fwidth(spot) * 0.8;
  float dotMask = smoothstep(thr - w, thr + w, spot);
  dotMask *= step(0.015, ink) * step(0.01, inkCell);

  if (uRaw > 0.5) dotMask = texture(uTex, fc / uRes).r;
  vec3 col = mix(uPaper, uInk, dotMask);
  col += (hash(fc) - 0.5) * 0.018;
  outColor = vec4(col, 1.0);
}`;

type Program = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed');
  }
  return sh;
}

function program(gl: WebGL2RenderingContext, frag: string): Program {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? 'program link failed');
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const name = gl.getActiveUniform(p, i)!.name;
    uniforms[name] = gl.getUniformLocation(p, name);
  }
  return { p, u: uniforms };
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export interface GearboxOptions {
  onFigure?: (fig: Figure, index: number, total: number) => void;
}

export function startGearbox(canvas: HTMLCanvasElement, opts: GearboxOptions = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!gl) {
    canvas.remove();
    return null;
  }

  const halftone = program(gl, HALFTONE);
  const scenes: (Program | null)[] = FIGURES.map(() => null);
  const sceneProgram = (i: number) =>
    (scenes[i] ??= program(gl, SCENE_HEAD + '\n' + FIGURES[i].map + '\n' + SCENE_TAIL));

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer();

  let W = 0, H = 0, lw = 0, lh = 0, cell = 6;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(canvas.clientWidth * dpr);
    H = Math.floor(canvas.clientHeight * dpr);
    canvas.width = W;
    canvas.height = H;
    // finer dots on phones: figures are drawn smaller there, so detail needs a finer screen
    cell = (canvas.clientWidth < 700 ? 3.6 : 5.5) * dpr;
    const step = cell * 0.5;
    lw = Math.ceil(W / step);
    lh = Math.ceil(H / step);
    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, lw, lh, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mx = 0, my = 0, sx = 0, sy = 0;
  window.addEventListener('pointermove', (ev) => {
    mx = ev.clientX / window.innerWidth - 0.5;
    my = ev.clientY / window.innerHeight - 0.5;
  });

  // Click anywhere that isn't a link or control to toggle the exploded view. The first
  // click takes over from the automatic cycle for the rest of this figure, and toggles
  // relative to what is on screen, so every click visibly does something.
  let explodeKick = 0;
  let manual = false;
  let lastClick = -Infinity;
  const CLICK_HOLD = 6000; // ms after a click before the page may advance
  window.addEventListener('pointerdown', (ev) => {
    if ((ev.target as HTMLElement).closest('a, button')) return;
    explodeKick = explode > 0.5 ? 0 : 1;
    manual = true;
    lastClick = performance.now();
    wake();
  });

  // Debug / capture params:
  //   ?raw          show the raw render instead of halftone dots
  //   ?fig=N        start on figure N (0-based, among enabled figures; default random)
  //   ?t=SECONDS    freeze figure time (also freezes the camera orbit)
  //   ?e=0..1       freeze the event / explode phase
  // When t or e is given the page renders a still frame: no auto-advance, no mouse,
  // no fade, and sets document.body.dataset.frameReady = '1' once drawn.
  const params = new URLSearchParams(location.search);
  const RAW = params.has('raw');
  const FIX_T = params.has('t') ? parseFloat(params.get('t')!) : null;
  const FIX_E = params.has('e') ? parseFloat(params.get('e')!) : null;
  const STILL = FIX_T !== null || FIX_E !== null;
  const START = params.has('fig') ? Math.max(0, Math.min(FIGURES.length - 1, parseInt(params.get('fig')!, 10) || 0)) : Math.floor(Math.random() * FIGURES.length);
  let framesDrawn = 0;
  const PERIOD = 14;      // one assemble / explode / reassemble cycle per figure
  const FADE_TIME = 0.7;

  let index = 0;
  let figStart = performance.now();
  let explode = reduced ? 0.7 : 0;
  let fade = 0;           // 0 = no dots, 1 = fully drawn
  let fadeTarget = 1;
  let pending: number | null = null;
  let last = performance.now();
  let running = false;

  function goTo(i: number) {
    const n = FIGURES.length;
    pending = ((i % n) + n) % n;
    fadeTarget = 0;
    wake();
  }

  function show(i: number) {
    index = i;
    sceneProgram(i);
    figStart = performance.now();
    explode = reduced ? 0.7 : 0;
    explodeKick = 0;
    manual = false;
    opts.onFigure?.(FIGURES[i], i, FIGURES.length);
  }

  // Advance state and draw one frame. Returns true while something is still settling.
  function draw(now: number) {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.1);
    last = now;

    // fade bookkeeping
    const fstep = dt / FADE_TIME;
    fade = fadeTarget > fade ? Math.min(fade + fstep, 1) : Math.max(fade - fstep, 0);
    if (pending !== null && fade === 0) {
      show(pending);
      pending = null;
      fadeTarget = 1;
    }

    const fig = FIGURES[index];
    const t = FIX_T ?? (reduced ? 3 : (now - figStart) / 1000);

    if (!reduced && !STILL && pending === null && t > PERIOD &&
        now - lastClick > CLICK_HOLD) goTo(index + 1);

    const ph = Math.min(t / PERIOD, 1);
    const auto = smoothstep(0.3, 0.45, ph) - smoothstep(0.8, 0.95, ph);
    const goal = manual ? explodeKick : reduced ? 0.7 : auto;
    explode += (goal - explode) * (1 - Math.exp(-dt * 3.5));
    if (FIX_E !== null) explode = FIX_E;
    if (STILL) { fade = 1; sx = 0; sy = 0; mx = 0; my = 0; }

    sx += (mx - sx) * (1 - Math.exp(-dt * 2.5));
    sy += (my - sy) * (1 - Math.exp(-dt * 2.5));

    const wide = canvas.clientWidth / canvas.clientHeight > 1.15;
    // full-bleed: centered, sized to fill the viewport (the UI panels sit on top)
    const cx = wide ? 0.56 + (fig.offsetX ?? 0) : 0.5;
    // narrow: the text panel covers the bottom ~45%, so center in the open area above it
    const cy = wide ? 0.5 : (fig.narrow?.cy ?? 0.64);
    // on portrait screens size by width: the figure should span about the screen width
    const fit = wide ? 1 : Math.min(Math.max(canvas.clientHeight / canvas.clientWidth, 1), 2.4);
    const baseSpan = wide ? fig.span : (fig.narrow?.span ?? fig.span * fit);
    const spanE = wide ? fig.spanE : (fig.narrow?.spanE ?? fig.spanE);
    const span = baseSpan * (1 + spanE * explode);
    const az = fig.az0 + (fig.azSpeed ? t * fig.azSpeed : 0.22 * Math.sin(t * 0.25)) + sx * 0.9;
    const el = fig.el0 + (fig.el1 - fig.el0) * explode + sy * 0.3;

    const scene = sceneProgram(index);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.viewport(0, 0, lw, lh);
    gl!.useProgram(scene.p);
    gl!.uniform2f(scene.u.uRes, lw, lh);
    gl!.uniform2f(scene.u.uCenter, cx, cy);
    gl!.uniform1f(scene.u.uSpan, span);
    gl!.uniform1f(scene.u.uTime, t);
    gl!.uniform1f(scene.u.uExplode, explode);
    gl!.uniform1f(scene.u.uAz, az);
    gl!.uniform1f(scene.u.uEl, el);
    gl!.uniform1f(scene.u.uExposure, fig.exposure ?? 1);
    const tgt = !wide && fig.narrow?.target ? fig.narrow.target : fig.target;
    gl!.uniform3f(
      scene.u.uTarget,
      tgt[0] + fig.targetE[0] * explode,
      tgt[1] + fig.targetE[1] * explode,
      tgt[2] + fig.targetE[2] * explode,
    );
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, W, H);
    gl!.useProgram(halftone.p);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.uniform1i(halftone.u.uTex, 0);
    gl!.uniform2f(halftone.u.uRes, W, H);
    gl!.uniform1f(halftone.u.uCell, cell);
    gl!.uniform1f(halftone.u.uFade, fade);
    gl!.uniform1f(halftone.u.uRaw, RAW ? 1 : 0);
    gl!.uniform3f(halftone.u.uPaper, 0.937, 0.910, 0.906);
    gl!.uniform3f(halftone.u.uInk, 0.165, 0.161, 0.173);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    // with reduced motion, only keep drawing while something is still settling
    const settling = fade !== fadeTarget || pending !== null || Math.abs(goal - explode) > 0.002;
    if (STILL) {
      if (++framesDrawn === 3) document.body.dataset.frameReady = '1';
    }
    return settling;
  }

  function frame(now: number) {
    const settling = draw(now);
    if (!reduced || settling) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function wake() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  resize();
  // Track the canvas's own box, not just window resizes: layout can settle after
  // startup (fonts, UI panels, headless viewports), which left the drawing buffer
  // stale and stretched.
  // Resizing the canvas clears its drawing buffer, so redraw right here (ResizeObserver
  // runs after layout, before paint) instead of waiting a frame: otherwise every resize
  // step paints a blank canvas and dragging the window edge flickers.
  new ResizeObserver(() => {
    if (Math.floor(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2)) === W &&
        Math.floor(canvas.clientHeight * Math.min(window.devicePixelRatio || 1, 2)) === H) return;
    resize();
    draw(performance.now());
    wake();
  }).observe(canvas);

  show(START);
  wake();

  return {
    next: () => goTo((pending ?? index) + 1),
    prev: () => goTo((pending ?? index) - 1),
  };
}
