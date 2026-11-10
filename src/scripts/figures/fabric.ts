import type { Figure } from './types';

// Fabric: a porous gyroid ball around a floating core. During the event the ball splits
// into two halves that slide apart, showing the labyrinth cross-section and the core.
const MAP = `
float map(vec3 p) {
  float e = smoothstep(0.0, 1.0, uExplode), t = uTime;
  // split plane through the center; turns with the camera orbit so the gap stays open
  float na = 0.52 + 0.05*t;
  vec3 n = vec3(cos(na), sin(na), 0.0);
  float k = dot(p, n);
  float side = k < 0.0 ? -1.0 : 1.0;
  float d = 0.95*e;
  vec3 h = p - n*(side*d);
  float hs = -side*dot(h, n);

  vec3 q = h;
  q.xy = rot(q.xy, t*0.07);
  const float s = 3.4;
  vec3 g = q*s + vec3(0.0, 0.0, t*0.3);
  float gy = (abs(dot(sin(g), cos(g.zxy))) - 0.3) / s;
  float r = length(h);
  float body = max(max(gy*0.6, r - 2.5), 1.35 - r);
  body = max(body, hs);
  // smooth core: stays put in the gap, the focal point of the split
  float core = length(p) - 1.05;
  return min(body, core);
}`;

export const Fabric: Figure = {
    title: 'Fabric',
    rows: [['Surface', 'gyroid'], ['Core', 'exposed']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0],
    span: 4.2, spanE: 0.12,
    el0: 1.0, el1: 0.9,
    az0: -0.8, azSpeed: 0.05,
    exposure: 1.1,
};
