import type { Figure } from './types';

// Agents: one coordinator at the center, streams of agents orbiting it on tilted
// lanes. During the event phase the lanes snap into a single plane and speed up.
const MAP = `
// one lane of agents: a ring of radius R in the xy plane of q, n slots
float agentLane(vec3 q, float R, float n, float spd, float seed, float rad, float zo, float e) {
  zo += e*0.18*(R - 1.6);   // event: lanes terrace into a shallow bowl
  float r = length(q.xy);
  float tb = length(vec2(r - R, q.z - zo)) - (rad*1.8 + 0.2);
  if (tb > 0.25) return tb;
  float s = TAU/n;
  float a = atan(q.y, q.x) - uTime*spd;
  float id = floor(a/s + 0.5);
  float la = a - id*s;
  vec3 h = hash3(vec3(mod(id, n), seed, seed*1.37 + 3.0));
  vec3 lp = vec3(r*cos(la), r*sin(la), q.z);
  // loose formation at rest, tight orderly lanes during the event
  float j = 1.0 - e;
  vec3 c = vec3(R + (h.x - 0.5)*0.14*j, (h.y - 0.5)*s*R*0.25*j, zo + (h.z - 0.5)*0.14*j);
  float rr = rad*(1.0 + (h.y - 0.5)*0.6*j - 0.12*e);
  float d = 1e9;
  if (h.x > 0.26 - 0.12*j) {
    float L = e*max(0.5*s*R - rr - 0.07, 0.0);  // event: agents stretch into packets
    vec3 w = lp - c;
    w.y -= clamp(w.y, -L, L);
    d = length(w) - rr;
  }
  // never step past the current slot (looser for shadows / AO)
  float bnd = r*sin(max(0.5*s - abs(la), 0.0));
  d = min(d, bnd + (gMarch ? 0.02 : 0.2));
  return d;
}

vec3 laneFrame(vec3 p, float tilt, float phi) {
  p.xy = rot(p.xy, -phi);
  p.yz = rot(p.yz, -tilt);
  return p;
}

float map(vec3 p) {
  float e = uExplode, t = uTime;
  p.xy = rot(p.xy, t*0.05);

  float bound = length(p) - 3.9;
  if (bound > 0.3) return bound;

  float k = 1.0 - 0.95*e;   // lane tilts collapse toward one plane
  float pulse = 0.03*sin(t*2.2)*(0.4 + e);

  // coordinator: a heavy sphere with a carved equator and a slow halo
  float core = length(p) - (0.92 + 0.06*e + pulse);
  core = max(core, -(abs(p.z) - 0.06));
  core = max(core, -(abs(abs(p.z) - 0.48) - 0.04));
  vec3 hq = laneFrame(p, 0.35*k, t*0.3);
  float halo = length(vec2(length(hq.xy) - 1.22, hq.z)) - 0.075;
  float d = min(core, halo);

  d = min(d, agentLane(laneFrame(p,  1.15*k, 0.3), 1.6, 17.0,  0.50, 1.0, 0.12, 0.0, e));
  d = min(d, agentLane(laneFrame(p, -0.85*k, 2.2), 2.0, 21.0, -0.40, 2.0, 0.12, 0.0, e));
  d = min(d, agentLane(laneFrame(p,  0.55*k, 4.1), 2.4, 25.0,  0.33, 3.0, 0.13, 0.0, e));
  d = min(d, agentLane(laneFrame(p, -1.25*k, 5.3), 2.8, 29.0, -0.27, 4.0, 0.13, 0.0, e));
  d = min(d, agentLane(laneFrame(p,  0.95*k, 1.2), 3.2, 33.0,  0.23, 5.0, 0.14, 0.0, e));
  d = min(d, agentLane(laneFrame(p, -0.4*k, 3.3), 3.6, 37.0, -0.19, 6.0, 0.14, 0.0, e));
  return d;
}`;

export const Agents: Figure = {
    disabled: true,
    title: 'Agents',
    rows: [['Count', '1 + 128'], ['Mode', 'orbit / align']],
    map: MAP,
    target: [0, 0, 0], targetE: [0, 0, 0],
    span: 4.9, spanE: 0.06,
    el0: 1.05, el1: 0.8,
    az0: -0.8, azSpeed: 0.05,
    exposure: 1.0,
};
