import { minify } from "html-minifier-terser";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, watch } from "fs";
import { extname, join, relative } from "path";

const ROOT = import.meta.dir;
const DIST = join(ROOT, "dist");
const DEV_PORT = 3000;
const SKIP_DIRS = new Set(["dist", "node_modules", ".git", "src"]);
const ASSET_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".mp3", ".ogg", ".wav", ".woff", ".woff2"]);
const WATCH_EXTS = new Set([".tsx", ".ts", ".html", ...ASSET_EXTS]);

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: { level: { 1: { specialComments: 0 } } },
  minifyJS: {
    compress: { drop_console: true, drop_debugger: true, passes: 2 },
    mangle: true,
  },
  sortAttributes: true,
  sortClassName: true,
} as const;

const LIVE_RELOAD = `<script>(function(){var e=new EventSource("/__reload");e.onmessage=function(){location.reload()};e.onerror=function(){setTimeout(function(){location.reload()},2e3)}})()</script>`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(a: number, b: number) {
  return (((a - b) / a) * 100).toFixed(1);
}

function debounce(fn: (f: string) => void, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (f: string) => { clearTimeout(t); t = setTimeout(() => fn(f), ms); };
}

function listDir(dir: string): string[] {
  try { return readdirSync(dir); } catch { return []; }
}

// ── Template discovery ────────────────────────────────────────────────────────

interface Template {
  dir: string;          // absolute path to template folder (e.g. ./amanda)
  name: string;         // folder name
  sources: string[];    // TSX entry files under src/
  assets: string[];     // image/media files directly in template dir
}

function discoverTemplates(): Template[] {
  const templates: Template[] = [];
  for (const entry of listDir(ROOT)) {
    if (SKIP_DIRS.has(entry)) continue;
    const dir = join(ROOT, entry);
    if (!statSync(dir).isDirectory()) continue;

    // TSX sources: dir/src/*.tsx (capital = page component)
    const srcDir = join(dir, "src");
    const sources: string[] = [];
    if (existsSync(srcDir)) {
      for (const f of listDir(srcDir)) {
        if (/^[A-Z].*\.tsx$/.test(f)) sources.push(join(srcDir, f));
      }
    }

    // assets: files directly in template dir
    const assets: string[] = [];
    for (const f of listDir(dir)) {
      const ext = extname(f).toLowerCase();
      if (ASSET_EXTS.has(ext)) assets.push(join(dir, f));
    }

    if (sources.length || assets.length) {
      templates.push({ dir, name: entry, sources, assets });
    }
  }
  return templates;
}

// ── Compile ───────────────────────────────────────────────────────────────────

async function compileSource(file: string, dev = false): Promise<{ name: string; html: string }> {
  // bust module cache by appending timestamp query
  const mod = await import(`${file}?t=${Date.now()}`) as { render: () => string };
  let html = mod.render();
  if (dev) html = html.replace("</body>", `${LIVE_RELOAD}\n</body>`);
  return { name: file.replace(/\.tsx$/, "").split(/[\\/]/).pop()!.toLowerCase(), html };
}

async function buildTemplate(tmpl: Template, dev = false): Promise<void> {
  const outDir = join(DIST, tmpl.name);
  mkdirSync(outDir, { recursive: true });

  for (const src of tmpl.sources) {
    const { name, html } = await compileSource(src, dev);
    const minified = dev ? html : await minify(html, MINIFY_OPTIONS);
    const outFile = join(outDir, `${name}.html`);
    await Bun.write(outFile, minified);
    if (!dev) {
      console.log(`  HTML  ${tmpl.name}/${name}.html  (-${pct(html.length, minified.length)}%)`);
    }
  }

  for (const asset of tmpl.assets) {
    const outFile = join(outDir, asset.split(/[\\/]/).pop()!);
    copyFileSync(asset, outFile);
    if (!dev) console.log(`  COPY  ${tmpl.name}/${asset.split(/[\\/]/).pop()}`);
  }
}

// ── Build (prod) ──────────────────────────────────────────────────────────────

async function buildAll(): Promise<void> {
  const t0 = performance.now();
  if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });

  const templates = discoverTemplates();
  console.log(`\nTemplates: ${templates.map((t) => t.name).join(", ")}\n`);

  for (const tmpl of templates) await buildTemplate(tmpl);

  console.log(`\n✓ built ${templates.length} template(s) → dist/  (${(performance.now() - t0).toFixed(0)}ms)`);
}

// ── Watch (build to dist) ─────────────────────────────────────────────────────

async function watchMode(): Promise<void> {
  await buildAll();
  console.log("\nWatching → dist/\n");
  startWatcher(debounce(async (file) => {
    const rel = relative(ROOT, file);
    console.log(`  ~  ${rel}`);
    // find which template owns this file
    const tmplName = rel.split(/[\\/]/)[0];
    const tmpl = discoverTemplates().find((t) => t.name === tmplName);
    if (tmpl) await buildTemplate(tmpl).catch(console.error);
  }, 150));
}

// ── Dev server ────────────────────────────────────────────────────────────────

async function devMode(): Promise<void> {
  const clients = new Set<ReadableStreamDefaultController>();
  const notify  = debounce(() => {
    for (const c of clients) { try { c.enqueue("data: r\n\n"); } catch { clients.delete(c); } }
  }, 150);

  startWatcher(notify);

  const mime: Record<string, string> = {
    ".html": "text/html;charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
    ".woff": "font/woff", ".woff2": "font/woff2",
  };

  Bun.serve({
    port: DEV_PORT,
    async fetch(req) {
      const path = new URL(req.url).pathname;

      if (path === "/__reload") {
        let ctrl!: ReadableStreamDefaultController;
        return new Response(
          new ReadableStream({
            start(c) { ctrl = c; clients.add(c); },
            cancel()  { clients.delete(ctrl); },
          }),
          { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } }
        );
      }

      // route: /<template>/<page>.html → compile on-the-fly
      const parts = path.split("/").filter(Boolean);
      if (parts.length === 2 && parts[1]!.endsWith(".html")) {
        const [tmplName, page] = parts as [string, string];
        const pageName = page.replace(".html", "");
        const srcFile  = join(ROOT, tmplName, "src", `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}.tsx`);
        if (existsSync(srcFile)) {
          try {
            const { html } = await compileSource(srcFile, true);
            return new Response(html, { headers: { "Content-Type": mime[".html"]! } });
          } catch (e: unknown) {
            const msg = (e as Error).message;
            return new Response(`<pre style="padding:20px;font-family:monospace">${msg}</pre>`,
              { status: 500, headers: { "Content-Type": "text/html" } });
          }
        }
      }

      // static asset fallback
      const filePath = join(ROOT, ...parts);
      const file = Bun.file(filePath);
      if (!(await file.exists())) return new Response("Not found", { status: 404 });
      const ext = extname(filePath).toLowerCase();
      return new Response(file, { headers: { "Content-Type": mime[ext] ?? "application/octet-stream" } });
    },
  });

  console.log(`\nDev server → http://localhost:${DEV_PORT}`);
  const templates = discoverTemplates();
  for (const tmpl of templates) {
    for (const src of tmpl.sources) {
      const page = src.replace(/\.tsx$/, "").split(/[\\/]/).pop()!.toLowerCase();
      console.log(`  http://localhost:${DEV_PORT}/${tmpl.name}/${page}.html`);
    }
  }
  console.log("\nSave any .tsx/.ts/asset → browser auto-reloads.\n");
}

// ── Watcher ───────────────────────────────────────────────────────────────────

function startWatcher(onChange: (file: string) => void): void {
  watch(ROOT, { recursive: true }, (_e, filename) => {
    if (!filename) return;
    const rel = filename.replace(/\//g, "\\");
    if (["build.ts", "package.json", "bun.lockb", "tsconfig.json"].includes(rel)) return;
    const seg0 = rel.split(/[\\/]/)[0]!;
    if (SKIP_DIRS.has(seg0) && seg0 !== "src") return;
    // also allow files inside template/src/
    const ext = extname(filename).toLowerCase();
    if (!WATCH_EXTS.has(ext)) return;
    onChange(join(ROOT, filename));
  });
}

// ── Clean ─────────────────────────────────────────────────────────────────────

function cleanDist(): void {
  if (existsSync(DIST)) { rmSync(DIST, { recursive: true, force: true }); console.log("dist/ cleaned"); }
  else console.log("dist/ already clean");
}

// ── Entrypoint ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if      (args.includes("--clean")) cleanDist();
else if (args.includes("--dev"))   devMode();
else if (args.includes("--watch")) watchMode().catch(console.error);
else                               buildAll().catch((e) => { console.error((e as Error).message); process.exit(1); });
