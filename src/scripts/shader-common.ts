// Shared raymarching code: uniforms + SDF helpers (head), normals/lighting/main (tail).
// Each figure supplies its own `float map(vec3 p)` in between.

export const SCENE_HEAD = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uCenter;   // object center, fraction of viewport
uniform float uSpan;    // world units across viewport height
uniform float uTime;
uniform float uExplode;
uniform float uAz;
uniform float uEl;
uniform vec3 uTarget;
uniform float uExposure;
out vec4 outColor;

const float PI = 3.14159265;
const float TAU = 6.28318531;

vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c*p.x - s*p.y, s*p.x + c*p.y); }

vec2 polarFold(vec2 p, float n) {
  float s = TAU / n;
  float a = atan(p.y, p.x);
  a = mod(a + 0.5*s, s) - 0.5*s;
  return length(p) * vec2(cos(a), sin(a));
}

float sdTrap(vec2 p, float r1, float r2, float he) {
  vec2 k1 = vec2(r2, he);
  vec2 k2 = vec2(r2 - r1, 2.0*he);
  p.x = abs(p.x);
  vec2 ca = vec2(p.x - min(p.x, (p.y < 0.0) ? r1 : r2), abs(p.y) - he);
  vec2 cb = p - k1 + k2*clamp(dot(k1 - p, k2)/dot(k2, k2), 0.0, 1.0);
  float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
  return s*sqrt(min(dot(ca, ca), dot(cb, cb)));
}

float extrude(float d2, float z, float h) {
  vec2 w = vec2(d2, abs(z) - h);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
}

float cylZ(vec3 p, float r, float z0, float z1) {
  vec2 d = vec2(length(p.xy) - r, abs(p.z - 0.5*(z0 + z1)) - 0.5*(z1 - z0));
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

// external spur gear profile, pitch radius R, module 0.1
float gearOut(vec2 p, float n, float R) {
  vec2 q = polarFold(p, n);
  float body = length(p) - (R - 0.1);
  float tooth = sdTrap(vec2(q.y, q.x - (R - 0.005)), 0.085, 0.035, 0.105) - 0.01;
  return min(body, tooth);
}

// internal (ring) gear profile
float gearIn(vec2 p, float n, float R, float Rout) {
  vec2 q = polarFold(p, n);
  float r = length(p);
  float ann = max((R + 0.12) - r, r - Rout);
  float tooth = sdTrap(vec2(q.y, -(q.x - (R + 0.015))), 0.085, 0.035, 0.105) - 0.01;
  return min(ann, tooth);
}


float sdSeg2(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
  return length(pa - ba*h);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
  return length(pa - ba*h) - r;
}

// capped cylinder between points a and b
float sdCylSeg(vec3 p, vec3 a, vec3 b, float r) {
  vec3 ba = b - a, pa = p - a;
  float baba = dot(ba, ba), paba = dot(pa, ba);
  float x = length(pa*baba - ba*paba) - r*baba;
  float y = abs(paba - baba*0.5) - baba*0.5;
  float x2 = x*x, y2 = y*y*baba;
  float d = (max(x, y) < 0.0) ? -min(x2, y2) : (((x > 0.0) ? x2 : 0.0) + ((y > 0.0) ? y2 : 0.0));
  return sign(d)*sqrt(abs(d))/baba;
}

vec3 hash3(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

// true only during the primary ray march; figures built from repeated cells use it
// to clamp steps at cell borders without darkening shadows / AO
bool gMarch = false;

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
`;

export const SCENE_TAIL = `
vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.002;
  return normalize(k.xyy*map(p + k.xyy*h) + k.yyx*map(p + k.yyx*h) +
                   k.yxy*map(p + k.yxy*h) + k.xxx*map(p + k.xxx*h));
}

float softShadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.03;
  for (int i = 0; i < 40; i++) {
    float h = map(ro + rd*t);
    res = min(res, 10.0*h/t);
    t += clamp(h, 0.02, 0.25);
    if (res < 0.01 || t > 6.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

float ambientOcc(vec3 p, vec3 n) {
  float occ = 0.0, s = 1.0;
  for (int i = 1; i <= 5; i++) {
    float h = 0.03 + 0.09*float(i);
    occ += (h - map(p + n*h)) * s;
    s *= 0.75;
  }
  return clamp(1.0 - 2.2*occ, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uCenter*uRes) / uRes.y * uSpan;

  vec3 dir = vec3(sin(uEl)*cos(uAz), sin(uEl)*sin(uAz), cos(uEl)); // toward camera
  vec3 up = normalize(vec3(0.0, 0.0, 1.0) - dir*dir.z);
  vec3 right = cross(up, dir);
  vec3 target = uTarget;

  vec3 ro = target + dir*9.0 + right*uv.x + up*uv.y;
  vec3 rd = -dir;

  float t = 0.0;
  bool hit = false;
  gMarch = true;
  for (int i = 0; i < 160; i++) {
    float h = map(ro + rd*t);
    if (h < 0.0015) { hit = true; break; }
    t += h * 0.9;
    if (t > 24.0) break;
  }
  gMarch = false;

  if (!hit) { outColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  vec3 p = ro + rd*t;
  vec3 n = calcNormal(p);
  // Lighting, tuned for halftone: every face should land on a readable dot size.
  //  - key light from upper left, lower than before so tops and sides separate
  //  - cool fill from the opposite side, so faces turned away from the key keep form
  //    instead of collapsing into one flat dark tone
  //  - less sky, so up-facing faces no longer wash out to bare paper
  //  - softer shadows and an AO floor, so detail inside shadow stays legible
  //  - a soft shoulder, so lit faces keep a fine dot tint instead of clipping to paper
  vec3 L = normalize(-0.65*right + 0.38*up + 0.62*dir);
  vec3 F = normalize(0.7*right - 0.1*up + 0.55*dir);

  float dif = max(dot(n, L), 0.0);
  float fil = max(dot(n, F), 0.0);
  float sh = softShadow(p + n*0.004, L);
  float ao = ambientOcc(p, n);
  float sky = 0.5 + 0.5*dot(n, up);
  float spec = pow(max(dot(reflect(-L, n), dir), 0.0), 24.0) * sh;
  float rim = pow(1.0 - max(dot(n, dir), 0.0), 3.0);

  sh = mix(0.45, 1.0, sh);
  float shade = 0.04 + 0.85*dif*sh + 0.16*fil + 0.1*sky + 0.25*spec;
  shade *= 0.66 + 0.34*ao;
  shade -= 0.1*rim;
  shade *= uExposure;
  shade = 1.04*(1.0 - exp(-1.55*max(shade, 0.0)));   // soft shoulder
  float ink = 0.04 + 0.96*pow(clamp(1.0 - shade, 0.0, 1.0), 1.15);
  outColor = vec4(ink, 1.0, 0.0, 1.0);
}`;
