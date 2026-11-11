import type { Figure } from './types';

// Event loop: a (2, 5) torus knot track with discrete message packets riding along it.
// The distance is measured to the true space curve (closest point refined with
// Gauss-Newton per strand), so the tube keeps an even thickness and crossings stay clean.
// Event phase: the packets are dispatched off the track onto a wider orbit
// (a second torus knot sharing the parameter), while the track lifts slightly.
const MAP = `
const float KP = 2.0, KQ = 5.0;

vec3 knotC(float u, float R, float r, float h) {
  float a = KP*u, s = KQ*u;
  float rr = R + r*cos(s);
  return vec3(rr*cos(a), rr*sin(a), h*sin(s));
}
vec3 knotD(float u, float R, float r, float h) {
  float a = KP*u, s = KQ*u;
  float rr = R + r*cos(s);
  float dr = -r*KQ*sin(s);
  return vec3(dr*cos(a) - rr*KP*sin(a), dr*sin(a) + rr*KP*cos(a), h*KQ*cos(s));
}
// refine the knot parameter u toward the closest point to p; returns (u, dist, speed)
vec3 knotNear(vec3 p, float u, float R, float r, float h) {
  for (int i = 0; i < 2; i++) {
    vec3 c = knotC(u, R, r, h), d = knotD(u, R, r, h);
    u -= clamp(dot(c - p, d)/dot(d, d), -0.25, 0.25);
  }
  return vec3(u, length(p - knotC(u, R, r, h)), length(knotD(u, R, r, h)));
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  float ee = e*e*(3.0 - 2.0*e);
  p.xy = rot(p.xy, -t*0.12);

  float R = 1.45, r = 0.62, h = 0.45 + 0.1*ee;
  float bound = length(p) - (R + r + 1.2);
  if (bound > 0.4) return bound;

  // message orbit: same knot, pushed out and up during the event
  float Rm = R + 0.75*ee, rm = r - 0.1*ee, hm = h + 0.2*ee;

  float a = atan(p.y, p.x);
  float N = 16.0;                          // packets around the loop
  float ph = t*0.6;                        // packets passing a point per second
  float d = 1e9;
  for (int k = 0; k < 2; k++) {
    float u0 = (a + TAU*float(k)) / KP;
    vec3 tr = knotNear(p, u0, R, r, h);
    // track: a plain tube, thick enough to hold dots
    d = min(d, (tr.y - 0.105)*0.9);

    // packets: rounded cylinders centered on the (possibly lifted) message curve
    vec3 ms = (e > 0.002) ? knotNear(p, tr.x, Rm, rm, hm) : tr;
    float cell = ms.x*N/TAU - ph;
    float f = fract(cell) - 0.5;
    float id = floor(cell);
    float big = 0.5 + 0.5*sin(id*2.7);   // a little size variety
    float len = (0.06 + 0.07*big)*(1.0 + 0.6*ee);
    float rad = (0.16 + 0.05*big)*(1.0 + 0.4*ee);
    vec2 q = vec2(abs(f*TAU/N*ms.z) - len, ms.y - rad);
    float pk = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - 0.06;
    d = min(d, pk*0.8);
  }
  return d;
}`;

export const EventLoop: Figure = {
    disabled: true,
    title: 'Event loop',
    rows: [['Knot', '(2, 5) torus'], ['Queue', '16 in flight']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0.25],
    span: 4.0, spanE: 0.25,
    el0: 0.55, el1: 0.7,
    exposure: 0.86,
    narrow: { span: 9.4 },
    az0: -0.8, azSpeed: 0.05,
};
