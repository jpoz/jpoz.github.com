#!/usr/bin/env node
// Capture the homepage with real mobile emulation (viewport, DPR, touch) via the
// Chrome DevTools Protocol. No dependencies: uses the system Chrome + Node's WebSocket.
//
//   node scripts/render-mobile.mjs <out.png> [query] [width] [height] [dpr]
//
//   query   e.g. "fig=3&t=8.5&e=1" (still frame) or "fig=0&t=2&e=0&clean"
//   defaults: 390 x 844 @ 3x (iPhone 14/15 class)
//
// Needs the dev server on $PORT (default 4321), or set BASE=https://www.jpoz.net

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [out, query = '', w = '390', h = '844', dpr = '3'] = process.argv.slice(2);
if (!out) {
  console.error('usage: render-mobile.mjs <out.png> [query] [width] [height] [dpr]');
  process.exit(1);
}
const base = process.env.BASE ?? `http://localhost:${process.env.PORT ?? 4321}`;
const url = `${base}/${query ? `?${query}` : ''}`;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = mkdtempSync(join(tmpdir(), 'mob-'));
const port = 9300 + Math.floor(Math.random() * 600);

const chrome = spawn(CHROME, [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`,
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const msg = { id: ++id, method, params };
  pending.set(msg.id, { resolve, reject });
  ws.send(JSON.stringify(msg));
});

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find((t) => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('chrome did not start');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    }
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width: +w, height: +h, deviceScaleFactor: +dpr, mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });

  // still frames set data-frame-ready; otherwise just give it a moment
  const still = /(^|&)(t|e)=/.test(query);
  for (let i = 0; i < 100; i++) {
    await sleep(200);
    if (!still && i >= 15) break;
    if (still) {
      const r = await send('Runtime.evaluate', { expression: 'document.body && document.body.dataset.frameReady', returnByValue: true });
      if (r.result.value === '1') { await sleep(400); break; }
    }
  }

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(out);
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
