// Figure registry: order here is the order they cycle on the page.
// Each figure lives in its own file under ./figures/.

import type { Figure } from './figures/types';
import { Mesh } from './figures/mesh';
import { Consensus } from './figures/consensus';
import { Pipeline } from './figures/pipeline';
import { Agents } from './figures/agents';
import { LoadField } from './figures/load-field';
import { Fabric } from './figures/fabric';
import { Hypercube } from './figures/hypercube';
import { EventLoop } from './figures/event-loop';
import { Recursion } from './figures/recursion';

export type { Figure };

export const FIGURES: Figure[] = [
  Mesh,
  Consensus,
  Pipeline,
  Agents,
  LoadField,
  Fabric,
  Hypercube,
  EventLoop,
  Recursion,
];
