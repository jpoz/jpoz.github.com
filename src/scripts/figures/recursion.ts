import type { Figure } from './types';

// Recursion: a Menger sponge. During the event the sponge scales 3x about the corner
// facing the camera (the sponge is self-similar there), so the camera seems to fall one
// level deeper while the next level of holes opens up to keep the detail constant.
const MAP = `
float map(vec3 p) {
  float e = smoothstep(0.0, 1.0, uExplode);
  p.yz = rot(p.yz, 0.45);
  p.xz = rot(p.xz, 0.4);

  const float S = 1.6;
  const vec3 C = vec3(1.0, -1.0, 1.0);   // the corner facing the camera mid-cycle
  float Z = exp2(1.5849625*e);           // 3^e
  vec3 x = C + (p/S - C)/Z;

  vec3 b = abs(x) - 1.0;
  float d = length(max(b, 0.0)) + min(max(b.x, max(b.y, b.z)), 0.0);
  float s = 1.0;
  for (int m = 0; m < 4; m++) {
    vec3 a = mod(x*s, 2.0) - 1.0;
    s *= 3.0;
    vec3 r = abs(1.0 - 3.0*abs(a));
    float da = max(r.x, r.y), db = max(r.y, r.z), dc = max(r.z, r.x);
    // the finest level grows in from nothing (k = 2 carves no hole) as we zoom
    float k = m == 3 ? mix(2.0, 1.0, smoothstep(0.1, 0.9, e)) : 1.0;
    d = max(d, (min(da, min(db, dc)) - k) / s);
  }
  return d*S*Z;
}`;

export const Recursion: Figure = {
    title: 'Recursion',
    rows: [['Depth', '3 > 4'], ['Scale', '1:3']],
    map: MAP,
    // targetE is corner C in world space (inverse of the two rotations, times S)
    target: [0, 0, 0], targetE: [2.097, -1.071, 1.462],
    span: 4.0, spanE: 0.0,
    el0: 1.0, el1: 1.0,
    az0: -0.8, azSpeed: 0.05,
    exposure: 0.8,
};
