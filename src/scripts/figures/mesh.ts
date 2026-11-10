import type { Figure } from './types';

// Service mesh: a 5x5x5 lattice of nodes around a control-plane hub, some links down,
// packets in flight. Event phase: the lattice spreads and its layers twist apart,
// shearing the vertical links (a partition), then heals.
const MAP = `
const float NM = 4.0; // max cell index (5 per side)

float nodeOn(vec3 id) {
  if (abs(id.x - 2.0) + abs(id.y - 2.0) < 0.5) return 1.0;
  return step(0.28, hash3(id + 3.7).y);
}

float linkUp(vec3 id, vec3 ax) {
  vec3 j = id + ax;
  if (any(lessThan(j, vec3(0.0))) || any(greaterThan(j, vec3(NM)))) return 0.0;
  return step(0.36, hash3(id*1.7 + ax*13.1).x) * nodeOn(id) * nodeOn(j);
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  float H = 0.5*NM;
  float S = 1.0 + 0.12*e;        // spacing in the layer
  float Z = 1.0 + 0.45*e;        // spacing between layers

  // control plane spine: one column through every layer
  float zTop = H*Z + 0.75;
  float spine = cylZ(p, 0.16, -zTop, zTop);
  spine = min(spine, cylZ(p, 0.26, zTop - 0.12, zTop));
  spine = min(spine, cylZ(p, 0.26, -zTop, -zTop + 0.12));

  // layer along z, each one twisted about the spine during the event
  float k = clamp(floor(p.z/Z + H + 0.5), 0.0, NM);
  float tw = e*(k - 2.0)*0.55;
  p.xy = rot(p.xy, tw);

  vec3 g = vec3(p.xy/S, p.z/Z) + H;
  vec3 id = clamp(floor(g + 0.5), 0.0, NM);
  id.z = k;
  vec3 q = p - (id - H)*vec3(S, S, Z);
  vec3 h = hash3(id);
  float pulse = 0.5 + 0.5*sin(t*2.2 + h.y*6.283);

  float d = 1e3;
  bool hub = abs(id.x - 2.0) + abs(id.y - 2.0) < 0.5;
  if (hub) {
    // per-layer hub disc around the spine, notched so its spin reads
    vec3 r = q;
    r.xy = rot(r.xy, t*0.4*(mod(k, 2.0)*2.0 - 1.0));
    float disc = cylZ(r, 0.44, -0.06, 0.06) - 0.03;
    vec2 f = polarFold(r.xy, 6.0);
    disc = max(disc, -(length(f - vec2(0.5, 0.0)) - 0.12));
    d = disc;
  } else if (nodeOn(id) > 0.5) {
    d = h.x > 0.66
      ? sdRoundBox(q, vec3(0.12 + 0.025*pulse), 0.035)
      : length(q) - (0.1 + 0.06*h.z + 0.03*pulse);
  }

  float lr = 0.05;
  float spd = 1.0 + 1.5*e;
  for (int i = 0; i < 3; i++) {
    vec3 ax = vec3(i == 0, i == 1, i == 2);
    // vertical links (between layers) shear apart during the event
    float L = (i == 2) ? Z*0.5*(1.0 - 0.75*e) : S*0.5;
    float C = (i == 2) ? Z : S;
    if (linkUp(id, ax) > 0.5) {
      d = min(d, sdCapsule(q, vec3(0.0), ax*L, lr));
      vec3 hp = hash3(id + ax*7.0);
      float s = fract(t*(0.25 + 0.3*hp.y)*spd + hp.x) * C;
      if (s < L + 0.05) d = min(d, length(q - ax*s) - 0.075);
    }
    vec3 nb = id - ax;
    if (linkUp(nb, ax) > 0.5) {
      d = min(d, sdCapsule(q, vec3(0.0), -ax*L, lr));
      vec3 hp = hash3(nb + ax*7.0);
      float s = fract(t*(0.25 + 0.3*hp.y)*spd + hp.x) * C - C;
      if (s > -L - 0.05) d = min(d, length(q - ax*s) - 0.075);
    }
  }

  if (gMarch) {
    // never step past the current layer slab (layers rotate independently)
    float bz = Z*0.5 - abs(q.z);
    if (abs(g.z - H) < H + 0.5) d = min(d, max(bz, 0.0) + 0.02);
    // inside the lattice, never step past the current cell
    if (all(lessThan(abs(g - H), vec3(H + 0.5)))) {
      vec3 b = vec3(S, S, Z)*0.5 - abs(q);
      d = min(d, max(min(b.x, min(b.y, b.z)), 0.0) + 0.02);
    }
  }
  return min(d, spine);
}`;

export const Mesh: Figure = {
    title: 'Service mesh',
    rows: [['Topology', '5 x 5 x 5 lattice'], ['Traffic', 'packets in flight']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0],
    span: 6.0, spanE: 0.18,
    el0: 1.05, el1: 0.85,
    az0: 0.35, azSpeed: 0.07,
    exposure: 1.3,
};
