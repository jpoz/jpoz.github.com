import type { Figure } from './types';

// Flowchart: a 3D process graph. The main flow runs along x; the hub decision fans out
// into three lanes that sit on different (y, z) levels, so the graph has real depth from
// every orbit angle. Orthogonal pipes carry packets, arrowheads mark node inputs, and a
// retry loop arcs over the top. During the event the lanes peel apart and the hub spins.
// Node kinds: 0 terminal (stadium), 1 process (box), 2 decision (diamond), 3 store (cylinder)
const MAP = `
const int NN = 9;
const vec3 NODE[NN] = vec3[NN](
  vec3(-1.8,-1.35, 0.0),  // 0 start (enters from the front)
  vec3(-1.8, 0.0, 0.0),   // 1 process
  vec3(-0.6, 0.0, 0.0),   // 2 decision (hub)
  vec3( 0.6, 1.3, 0.75),  // 3 process, upper back lane
  vec3( 0.6,-1.3,-0.75),  // 4 process, lower front lane
  vec3( 0.6, 0.0, 0.0),   // 5 store, main lane
  vec3( 1.8, 0.0, 0.0),   // 6 process (merge)
  vec3( 3.0, 0.0, 0.0),   // 7 decision (check)
  vec3( 3.0, 0.0,-1.3)    // 8 end
);
const int KIND[NN] = int[NN](0, 1, 2, 1, 1, 3, 1, 2, 0);

const int NS = 21;
const vec3 SA[NS] = vec3[NS](
  vec3(-1.8,-1.35, 0.0), vec3(-1.8, 0.0, 0.0), vec3(-0.6, 0.0, 0.0), vec3(0.6, 0.0, 0.0),
  vec3(-0.6, 0.0, 0.0), vec3(-0.6, 0.0, 0.75), vec3(-0.6, 1.3, 0.75),
  vec3( 0.6, 1.3, 0.75), vec3(1.8, 1.3, 0.75), vec3(1.8, 0.0, 0.75),
  vec3(-0.6, 0.0, 0.0), vec3(-0.6, 0.0,-0.75), vec3(-0.6,-1.3,-0.75),
  vec3( 0.6,-1.3,-0.75), vec3(1.8,-1.3,-0.75), vec3(1.8, 0.0,-0.75),
  vec3( 1.8, 0.0, 0.0), vec3(3.0, 0.0, 0.0),
  vec3( 3.0, 0.0, 0.0), vec3(3.0, 0.0, 1.6), vec3(-1.8, 0.0, 1.6)
);
const vec3 SB[NS] = vec3[NS](
  vec3(-1.8, 0.0, 0.0), vec3(-0.6, 0.0, 0.0), vec3(0.6, 0.0, 0.0), vec3(1.8, 0.0, 0.0),
  vec3(-0.6, 0.0, 0.75), vec3(-0.6, 1.3, 0.75), vec3(0.6, 1.3, 0.75),
  vec3( 1.8, 1.3, 0.75), vec3(1.8, 0.0, 0.75), vec3(1.8, 0.0, 0.0),
  vec3(-0.6, 0.0,-0.75), vec3(-0.6,-1.3,-0.75), vec3(0.6,-1.3,-0.75),
  vec3( 1.8,-1.3,-0.75), vec3(1.8, 0.0,-0.75), vec3(1.8, 0.0, 0.0),
  vec3( 3.0, 0.0, 0.0), vec3(3.0, 0.0,-1.3),
  vec3( 3.0, 0.0, 1.6), vec3(-1.8, 0.0, 1.6), vec3(-1.8, 0.0, 0.0)
);
// arrowhead tip offset back from the segment end (0 = no arrowhead)
const float ARW[NS] = float[NS](
  0.4, 0.5, 0.4, 0.42,
  0.0, 0.0, 0.42,
  0.0, 0.0, 0.3,
  0.0, 0.0, 0.42,
  0.0, 0.0, 0.3,
  0.5, 0.26,
  0.0, 0.0, 0.3
);

float node(vec3 q, int kind, float spin) {
  if (kind == 0) {
    return sdCapsule(q, vec3(-0.16, 0.0, 0.0), vec3(0.16, 0.0, 0.0), 0.24);
  }
  if (kind == 1) {
    float d = sdRoundBox(q, vec3(0.32, 0.3, 0.2), 0.05);
    // recessed label panel on the top face
    float panel = sdRoundBox(q - vec3(0.0, 0.0, 0.25), vec3(0.2, 0.18, 0.06), 0.02);
    return max(d, -panel);
  }
  if (kind == 2) {
    q.xy = rot(q.xy, spin);
    vec3 a = abs(q);
    return (a.x + a.y + a.z - 0.5) * 0.57735 - 0.015;
  }
  float d = cylZ(q, 0.34, -0.26, 0.26) - 0.02;
  float band = max(abs(abs(q.z) - 0.09) - 0.03, 0.335 - length(q.xy));
  return max(d, -band);
}

// cone arrowhead, tip at the origin pointing along unit vector n
float arrow(vec3 q, vec3 n) {
  float h = -dot(q, n);              // distance behind the tip
  float r = length(q + n*h);         // radial distance from the axis
  const float H = 0.28, R = 0.16;
  return max((H*r - R*h) * inversesqrt(H*H + R*R), h - H);
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  vec3 spread = vec3(0.92 + 0.08*e, 1.0 + 0.75*e, 1.0 + 0.3*e);
  // decisions turn a quarter (a symmetry of the diamond) as the lanes open, then back
  float spin = 1.5708*e*e*(3.0 - 2.0*e);

  float d = 1e9;
  for (int i = 0; i < NN; i++) {
    vec3 c = NODE[i] * spread;
    float bob = 0.04*sin(t*1.3 + float(i)*1.7);
    float sp = (i == 2) ? spin : ((i == 7) ? -spin : 0.0);
    vec3 q = p - c - vec3(0.0, 0.0, bob);
    if (i == 0) q = q.yxz;   // start terminal faces along y
    d = min(d, node(q, KIND[i], sp));
  }

  float flow = 0.65*t;   // constant speed: scaling by e would run packets backwards as e falls
  for (int i = 0; i < NS; i++) {
    vec3 a = SA[i] * spread, b = SB[i] * spread;
    vec3 ab = b - a;
    float len = length(ab);
    vec3 n = ab / len;
    d = min(d, sdCapsule(p, a, b, 0.06));
    d = min(d, length(p - b) - 0.085);
    if (ARW[i] > 0.0) d = min(d, arrow(p - (b - n*ARW[i]), n));
    float u = fract(flow/len + 0.37*float(i));
    d = min(d, sdRoundBox(p - mix(a, b, u), vec3(0.08), 0.03));
  }
  return d;
}`;

export const Pipeline: Figure = {
    title: 'Pipeline',
    rows: [['Stages', '9 / 3-lane fan-out'], ['Flow', 'retry loop on fail']],
    map: MAP,
    target: [-0.45, 0.2, 0.0], targetE: [0, 0, -0.1],
    // on phones there is no side panel to clear: center the whole graph
    narrow: { target: [0.6, 0, 0.1], span: 9.5 },
    span: 5.6, spanE: 0.22,
    el0: 1.05, el1: 0.8,
    az0: -2.4, azSpeed: 0.05,
};
