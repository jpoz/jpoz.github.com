import type { Figure } from './types';

// Hypercube: a tesseract rotating through the fourth dimension, projected to 3D.
// Struts taper with 4D depth (near cell fat, far cell slim but never thinner than
// about two halftone cells). The event phase turns it inside out: an extra half turn
// in the xw plane drags the inner cell through the outer one while the 4D camera
// pushes in, so the near cell swells past the frame and the far cell shrinks to a
// tight core. Vertices are crisp cube nodes.
const MAP = `
float sdTaper(vec3 p, vec3 a, vec3 b, float ra, float rb) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
  return length(pa - ba*h) - mix(ra, rb, h);
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  float flip = smoothstep(0.0, 1.0, e);
  float a = t*0.34 + PI*flip;
  float b = t*0.21 + 0.6;
  float dist = 3.1 - 0.55*flip;

  vec3 P[16];
  float R[16];
  float bound = 0.0;
  for (int i = 0; i < 16; i++) {
    vec4 v = vec4(float(i & 1), float((i >> 1) & 1), float((i >> 2) & 1), float((i >> 3) & 1))*2.0 - 1.0;
    v.xw = rot(v.xw, a);
    v.yz = rot(v.yz, 0.5);
    v.zw = rot(v.zw, b);
    float w = 1.0 / (dist - v.w);
    P[i] = v.xyz * w * 1.75;
    R[i] = 0.036 + 0.085*min(w, 1.25);   // strut radius at this vertex
    bound = max(bound, length(P[i]) + 0.1 + 0.3*w);
  }

  float lp = length(p);
  if (lp > bound + 0.3) return lp - bound;

  float d = 1e9;
  for (int i = 0; i < 16; i++) {
    // vertex hub: a crisp cube node, fatter than its struts (flat faces read as clean tone)
    d = min(d, sdRoundBox(p - P[i], vec3(1.35*R[i]), 0.3*R[i]));
    for (int k = 0; k < 4; k++) {
      int j = i ^ (1 << k);
      if (j > i) d = min(d, sdTaper(p, P[i], P[j], R[i], R[j]));
    }
  }
  return d;
}`;

export const Hypercube: Figure = {
    disabled: true,
    title: 'Hypercube',
    rows: [['Dimensions', '4'], ['Cells', '8 / edges 32']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0],
    span: 2.9, spanE: 0.1,
    el0: 1.05, el1: 0.85,
    az0: -0.8, azSpeed: 0.08,
    exposure: 1.12,
};
