import type { Figure } from './types';

// Recursion: a Menger sponge, zoomed toward the corner facing the camera (the sponge is
// self-similar there). At rest it sits ZBASE levels in; the event (or a click) falls one
// more level deeper while the next level of holes opens up to keep the detail constant.
const MAP = `
float map(vec3 p) {
  float e = smoothstep(0.0, 1.0, uExplode);
  p.yz = rot(p.yz, 0.45);
  p.xz = rot(p.xz, 0.4);

  const float S = 1.6;
  const vec3 C = vec3(1.0, -1.0, 1.0);   // the corner facing the camera mid-cycle
  const float ZBASE = 0.6;
  float z = ZBASE + e;                   // zoom depth, in sponge levels
  float Z = exp2(1.5849625*z);           // 3^z
  vec3 x = C + (p/S - C)/Z;

  vec3 b = abs(x) - 1.0;
  float d = length(max(b, 0.0)) + min(max(b.x, max(b.y, b.z)), 0.0);
  float s = 1.0;
  for (int m = 0; m < 5; m++) {
    vec3 a = mod(x*s, 2.0) - 1.0;
    s *= 3.0;
    vec3 r = abs(1.0 - 3.0*abs(a));
    float da = max(r.x, r.y), db = max(r.y, r.z), dc = max(r.z, r.x);
    // the two finest levels grow in from nothing (k = 2 carves no hole) as we zoom
    float fm = float(m) - 3.0;
    float k = m >= 3 ? mix(2.0, 1.0, smoothstep(fm + 0.1, fm + 0.9, z)) : 1.0;
    d = max(d, (min(da, min(db, dc)) - k) / s);
  }
  return d*S*Z;
}`;

export const Recursion: Figure = {
    title: 'Recursion',
    rows: [['Depth', '4 > 5'], ['Scale', '1:3']],
    map: MAP,
    // corner C in world space is [2.097, -1.071, 1.462] (inverse of the two rotations,
    // times S). The camera rests ZBASE (0.6) of the way there and reaches it at full zoom.
    target: [1.258, -0.643, 0.877], targetE: [0.839, -0.428, 0.585],
    span: 4.0, spanE: 0.0,
    el0: 1.0, el1: 1.0,
    az0: -0.8, azSpeed: 0.05,
    exposure: 1.0,
    narrow: { span: 9.2 },   // fixed, so short phones (375x667) keep the cube clear of the header and panel
};
