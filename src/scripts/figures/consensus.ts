import type { Figure } from './types';

// Consensus: replica rings drift independently, then all snap into one plane and their
// beads line up into radial spokes around a leader core.
const MAP = `
// ring of radius R: radial half-width th, axial half-height w
float band(vec3 p, float R, float th, float w) {
  vec2 q = vec2(length(p.xy) - R, p.z);
  vec2 a = abs(q) - vec2(th, w);
  return min(max(a.x, a.y), 0.0) + length(max(a, 0.0)) - 0.012;
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  float k = 1.0 - e;
  float spin = 0.22*t;                       // shared rotation once agreed

  // leader core: split sphere on an axial pin
  float r = length(p);
  float d = max(r - 0.5, -(abs(p.z) - 0.04));
  d = min(d, r - 0.36);
  float pz = 0.8 + 0.4*e;
  d = min(d, cylZ(p, 0.085, -pz, pz) - 0.01);
  d = min(d, length(vec3(p.xy, abs(p.z) - pz)) - 0.15);   // beacons
  d = min(d, band(p, 0.62, 0.05, 0.035));    // collar

  // quorum spokes: grow out from the core once the rings agree
  float L = 2.2*smoothstep(0.35, 1.0, e);
  vec2 sp = polarFold(rot(p.xy, spin), 6.0);
  d = min(d, sdCapsule(vec3(sp, p.z - 0.075), vec3(0.55, 0.0, 0.0), vec3(0.55 + L, 0.0, 0.0), 0.075));

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float R = 0.95 + 0.42*fi;
    vec3 q = p;
    q.yz = rot(q.yz, k*(t*(0.30 + 0.09*fi) + fi*1.3));
    q.xz = rot(q.xz, k*(t*(0.21 - 0.08*fi) + fi*0.7));

    bool plate = (i % 2 == 0);
    float th = plate ? 0.10 : 0.045;
    float w  = plate ? 0.035 : 0.10;
    float b = band(q, R, th, w);
    // castellated top on the flat plates
    if (plate) {
      float n = 16.0 + 6.0*fi;
      vec2 g = polarFold(q.xy, n);
      float slot = max(abs(g.y) - 0.05, -(q.z - 0.005));
      b = max(b, -slot);
    }
    d = min(d, b);

    // six beads per ring; their phases converge so they form radial spokes
    float ph = spin + k*(t*(0.5 - 0.17*fi) + fi*1.9);
    vec2 f = polarFold(rot(q.xy, ph), 6.0);
    vec3 bq = vec3(f.x - R, f.y, q.z);
    float bead = plate ? sdRoundBox(bq, vec3(0.13, 0.07, 0.07), 0.025)
                      : length(bq) - 0.115;
    d = min(d, bead);
  }
  return d;
}`;

export const Consensus: Figure = {
    title: 'Consensus',
    rows: [['Replicas', '5 / 5'], ['State', 'drift / agree']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0],
    span: 3.5, spanE: 0.06,
    el0: 1.0, el1: 0.8,
    az0: -0.9, azSpeed: 0.06,
    exposure: 1.05,
    narrow: { span: 7.5 },
};
