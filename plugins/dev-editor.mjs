// Dev-only Vite plugin: serves a markdown editor for posts at /__edit/<slug>
// and writes saved changes straight back to src/content/posts.
import fs from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = path.resolve("src/content/posts");

async function resolvePost(slug) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  for (const ext of [".md", ".mdx"]) {
    const file = path.join(POSTS_DIR, slug + ext);
    try {
      await fs.access(file);
      return file;
    } catch {}
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const editorHtml = (slug) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Edit: ${slug}</title>
<style>
  :root { color-scheme: light dark; --bg: #fff; --fg: #1d1d1f; --muted: #6e6e73; --line: #d2d2d7; --accent: #0071e3; }
  @media (prefers-color-scheme: dark) { :root { --bg: #1c1c1e; --fg: #f5f5f7; --muted: #98989d; --line: #3a3a3c; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.4 -apple-system, system-ui, sans-serif; display: flex; flex-direction: column; height: 100dvh; }
  header { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
  header .slug { font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #status { color: var(--muted); font-size: 13px; }
  a { color: var(--accent); text-decoration: none; }
  button { font: inherit; font-weight: 600; padding: 8px 16px; border: 0; border-radius: 8px; background: var(--accent); color: #fff; }
  button:disabled { opacity: .5; }
  textarea { flex: 1; width: 100%; padding: 16px; border: 0; resize: none; outline: none; background: var(--bg); color: var(--fg); font: 16px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; }
</style>
</head>
<body>
<header>
  <span class="slug">${slug}</span>
  <span id="status">Loading…</span>
  <a href="/${slug}" target="_blank">View</a>
  <button id="save" disabled>Save</button>
</header>
<textarea id="text" spellcheck="true"></textarea>
<script>
  const api = "/__edit/api/${slug}";
  const text = document.getElementById("text");
  const save = document.getElementById("save");
  const status = document.getElementById("status");
  let saved = "";
  const setDirty = () => {
    const dirty = text.value !== saved;
    save.disabled = !dirty;
    status.textContent = dirty ? "Unsaved changes" : "Saved";
  };
  fetch(api).then((r) => r.text()).then((t) => { text.value = saved = t; setDirty(); });
  text.addEventListener("input", setDirty);
  async function doSave() {
    if (save.disabled) return;
    save.disabled = true;
    status.textContent = "Saving…";
    const body = text.value;
    const res = await fetch(api, { method: "POST", body });
    if (res.ok) { saved = body; setDirty(); }
    else { status.textContent = "Save failed: " + (await res.text()); save.disabled = false; }
  }
  save.addEventListener("click", doSave);
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); doSave(); }
  });
  window.addEventListener("beforeunload", (e) => { if (text.value !== saved) e.preventDefault(); });
</script>
</body>
</html>`;

export default function devEditor() {
  return {
    name: "dev-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        const api = url.pathname.match(/^\/__edit\/api\/([^/]+)$/);
        const page = url.pathname.match(/^\/__edit\/([^/]+)$/);
        if (!api && !page) return next();

        const slug = (api || page)[1];
        const file = await resolvePost(slug);
        if (!file) {
          res.statusCode = 404;
          return res.end("Post not found");
        }

        if (page) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.end(editorHtml(slug));
        }
        if (req.method === "GET") {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          return res.end(await fs.readFile(file, "utf8"));
        }
        if (req.method === "POST") {
          await fs.writeFile(file, await readBody(req));
          server.config.logger.info(`[dev-editor] saved ${path.relative(process.cwd(), file)}`);
          return res.end("ok");
        }
        res.statusCode = 405;
        res.end("Method not allowed");
      });
    },
  };
}
