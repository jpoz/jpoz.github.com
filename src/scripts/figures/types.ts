// Each figure is a GLSL `map()` plus camera framing and the status panel text.
// Coordinates: z is up. uTime is seconds since the figure appeared, uExplode is 0..1
// (the "event" phase of each figure's cycle). Shared helpers (rot, polarFold, cylZ,
// sdCapsule, sdRoundBox, sdCylSeg, sdSeg2, hash3, gearOut, extrude, gMarch...) live in
// ../shader-common.ts.

export interface Figure {
  title: string;
  rows: [string, string][];
  map: string;
  target: [number, number, number];
  targetE: [number, number, number]; // added to target during the event phase
  span: number;   // world units across the viewport height
  spanE: number;  // extra span fraction during the event phase
  el0: number;    // camera angle from the z axis
  el1: number;
  az0: number;
  azSpeed: number; // 0 = gentle sway instead of a slow orbit
  exposure?: number;
}
