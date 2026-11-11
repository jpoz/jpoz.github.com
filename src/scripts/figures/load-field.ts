import type { Figure } from './types';

// Load field: a grid of columns around a hot cell. Load rings ripple outward from
// the hotspot; during the event phase the hot cell spikes and the rings swell.
const MAP = `
float map(vec3 p) {
  float e = uExplode, t = uTime;
  const float C = 0.4;
  const float H = 13.0;

  vec2 gi = p.xy / C;
  vec2 id = clamp(floor(gi + 0.5), -H, H);
  vec2 q = p.xy - id*C;
  vec3 hh = hash3(vec3(id, 3.0));
  float r = length(id);
  vec2 aid = abs(id);
  float rs = max(aid.x, aid.y);       // square rings, aligned with the grid
  float rm = mix(r, rs, 0.65);

  // hotspot: a stepped ziggurat of tall columns at the origin
  float core = exp(-rs*rs*0.16) * (1.5 + 0.2*sin(t*1.3) + 2.1*e);
  // load rings travelling outward, sharpened crests, decaying with distance
  float ring = 0.5 + 0.5*cos(rm*0.8 - t*2.2);
  ring *= ring*ring;
  float amp = (0.5 + 0.55*e) * exp(-rm*0.09) * (0.7 + 0.3*hh.y);
  // the hot cell itself: a spire that shoots up during the event
  float spire = (rs < 0.5) ? 0.5 + 1.8*e : 0.0;
  float ht = 0.035 + 0.035*hh.x + ring*amp + core + spire;
  ht *= 0.25 + 0.75*smoothstep(H + 1.0, H - 4.0, r);

  const float W = C*0.36;
  float d = sdRoundBox(vec3(q, p.z - ht*0.5), vec3(W, W, ht*0.5), 0.02);
  // rack-unit ledges on tall columns: lit tops on shadowed faces, dark undersides
  // on lit faces, so both sides of a tower keep their edges in halftone
  float zl = mod(p.z, 0.36) - 0.18;
  vec2 aq = abs(q);
  float ledge = max(max(aq.x, aq.y) - (W + 0.04), abs(zl) - 0.04);
  ledge = max(ledge, max(p.z - (ht - 0.16), 0.14 - p.z));
  d = min(d, ledge);

  if (gMarch && all(lessThan(abs(gi), vec2(H + 0.5)))) {
    // step limit at cell borders, relaxed above the tallest neighboring column (capped at one
    // cell, which can't reach a column two cells away) so rays over the field don't burn
    // their steps hopping cells; above the tallest column anywhere, steps are free
    vec2 b = C*0.5 - abs(q);
    float rn = max(rs - 1.0, 0.0);
    float hb = 0.16 + (0.5 + 0.55*e)*exp(-max(rm - 1.5, 0.0)*0.09)
             + (1.7 + 2.1*e)*exp(-rn*rn*0.16) + (rs < 1.5 ? 0.5 + 1.8*e : 0.0);
    float hg = 2.9 + 4.4*e;   // tallest column anywhere: free steps above it
    d = min(d, max(max(min(b.x, b.y), 0.0) + 0.015, max(min(p.z - hb, C), p.z - hg)));
  }
  return d;
}`;

export const LoadField: Figure = {
    title: 'Load field',
    rows: [['Cells', '27 x 27'], ['Hotspot', 'cell 0,0 / rippling']],
    map: MAP,
    target: [0, 0, 0.35], targetE: [0, 0, 0.6],
    span: 4.4, spanE: 0.12,
    el0: 0.9, el1: 0.98,
    az0: -0.8, azSpeed: 0.05,
    exposure: 1.15,
};
