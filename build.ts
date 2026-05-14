import { minify } from "html-minifier-terser";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, watch } from "fs";
import { dirname, extname, join, relative } from "path";
import { pathToFileURL } from "url";

const ROOT = import.meta.dir;
const TEMPLATES_DIR = join(ROOT, "templates");
const OVERLAYS_DIR = join(ROOT, "shared", "src");
const DIST = join(ROOT, "dist");
const RUNTIME_CACHE = join(ROOT, ".cache", "runtime");
const DEV_PORT = 3001;
const SKIP_WATCH = new Set(["dist", "node_modules", ".git", ".cache"]);
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

const GITHUB_RAW = "https://raw.githubusercontent.com/rafaalrazzak/tako-overlay/main";

// ── Helpers ───────────────────────────────────────────────────────────────────

function debounce(fn: (f: string) => void, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (f: string) => { clearTimeout(t); t = setTimeout(() => fn(f), ms); };
}

function listDir(dir: string): string[] {
  try { return readdirSync(dir); } catch { return []; }
}

// ── Discovery ─────────────────────────────────────────────────────────────────

interface Theme {
  dir: string;    // absolute: templates/<name>
  name: string;   // folder name
  assets: string[];
}

function discoverThemes(): Theme[] {
  const themes: Theme[] = [];
  for (const entry of listDir(TEMPLATES_DIR)) {
    const dir = join(TEMPLATES_DIR, entry);
    try { if (!statSync(dir).isDirectory()) continue; } catch { continue; }
    const assets: string[] = [];
    for (const f of listDir(dir)) {
      if (ASSET_EXTS.has(extname(f).toLowerCase())) assets.push(join(dir, f));
    }
    if (assets.length) themes.push({ dir, name: entry, assets });
  }
  return themes;
}

function discoverOverlaySources(): string[] {
  const sources: string[] = [];
  for (const f of listDir(OVERLAYS_DIR)) {
    if (/^[A-Z].*\.tsx$/.test(f)) sources.push(join(OVERLAYS_DIR, f));
  }
  return sources;
}

// ── Asset encoding ────────────────────────────────────────────────────────────

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
};

async function toDataUri(file: string): Promise<string> {
  const ext = extname(file).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  const b64 = Buffer.from(await Bun.file(file).arrayBuffer()).toString("base64");
  return `data:${mime};base64,${b64}`;
}

function findAsset(dir: string, name: string): string | null {
  for (const ext of Object.keys(MIME)) {
    const f = join(dir, `${name}${ext}`);
    if (existsSync(f)) return f;
  }
  return null;
}

// ── Compile ───────────────────────────────────────────────────────────────────

type RenderFn = (bgUri: string, mieAyamUri: string) => string;

function resolveLocalImport(fromFile: string, specifier: string): string | null {
  const base = join(dirname(fromFile), specifier);
  if (existsSync(base)) return base;
  for (const ext of [".tsx", ".ts", ".jsx", ".js"]) {
    const file = `${base}${ext}`;
    if (existsSync(file)) return file;
  }
  return null;
}

async function createRuntimeEntry(file: string, token: number): Promise<string> {
  mkdirSync(RUNTIME_CACHE, { recursive: true });
  const source = await Bun.file(file).text();
  const patched = source.replace(
    /(from\s+["'])(\.{1,2}\/[^"']+)(["'])/g,
    (match, prefix: string, specifier: string, suffix: string) => {
      const resolved = resolveLocalImport(file, specifier);
      if (!resolved) return match;
      return `${prefix}${pathToFileURL(resolved).href}?t=${token}${suffix}`;
    }
  );
  const name = file.replace(/\W+/g, "_");
  const runtimeFile = join(RUNTIME_CACHE, `${name}_${token}.tsx`);
  await Bun.write(runtimeFile, patched);
  return runtimeFile;
}

async function compileSource(
  file: string, bgUri: string, mieAyamUri: string, dev = false
): Promise<{ name: string; html: string }> {
  const token = Date.now();
  const runtimeEntry = await createRuntimeEntry(file, token);
  const mod = await import(`${runtimeEntry}?t=${token}`) as { render: RenderFn };
  let html = mod.render(bgUri, mieAyamUri);
  if (dev) html = html.replace("</body>", `${LIVE_RELOAD}\n</body>`);
  return { name: file.replace(/\.tsx$/, "").split(/[\\/]/).pop()!.toLowerCase(), html };
}

// ── Assets ────────────────────────────────────────────────────────────────────

async function resolveAssets(theme: Theme, dev = false) {
  const bgFile = findAsset(theme.dir, "background");
  const mieAyamFile = findAsset(theme.dir, "mie-ayam");
  const bgExt = bgFile ? extname(bgFile) : ".jpg";
  const mieAyamExt = mieAyamFile ? extname(mieAyamFile) : ".png";

  if (dev) {
    return {
      bgUri: bgFile ? await toDataUri(bgFile) : "",
      mieAyamUri: `/${theme.name}/mie-ayam${mieAyamExt}`,
    };
  }
  // Production: always use GitHub raw URLs (keeps HTML small, avoids cropping)
  return {
    bgUri: `${GITHUB_RAW}/templates/${theme.name}/background${bgExt}`,
    mieAyamUri: `${GITHUB_RAW}/templates/${theme.name}/mie-ayam${mieAyamExt}`,
  };
}

// ── Build ─────────────────────────────────────────────────────────────────────

async function buildTheme(theme: Theme, sources: string[], dev = false): Promise<void> {
  const outDir = join(DIST, theme.name);
  mkdirSync(outDir, { recursive: true });
  const { bgUri, mieAyamUri } = await resolveAssets(theme, dev);
  for (const src of sources) {
    const { name, html } = await compileSource(src, bgUri, mieAyamUri, dev);
    const minified = dev ? html : await minify(html, MINIFY_OPTIONS);
    await Bun.write(join(outDir, `${name}.html`), minified);
    if (!dev) {
      const kb = (Buffer.byteLength(minified) / 1024).toFixed(1);
      console.log(`  HTML  ${theme.name}/${name}.html  ${kb}KB`);
    }
  }
}

async function buildAll(): Promise<void> {
  const t0 = performance.now();
  if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });

  const themes = discoverThemes();
  const sources = discoverOverlaySources();
  console.log(`\nThemes: ${themes.map((t) => t.name).join(", ")}`);
  console.log(`Overlays: ${sources.map((s) => s.split(/[\\/]/).pop()!.replace(".tsx", "")).join(", ")}\n`);

  for (const theme of themes) await buildTheme(theme, sources);

  console.log(`\n✓ built ${themes.length} theme(s) × ${sources.length} overlay(s) → dist/  (${(performance.now() - t0).toFixed(0)}ms)`);
}

// ── Watch ─────────────────────────────────────────────────────────────────────

async function watchMode(): Promise<void> {
  await buildAll();
  console.log("\nWatching → dist/\n");
  startWatcher(debounce(async (file) => {
    const rel = relative(ROOT, file);
    console.log(`  ~  ${rel}`);
    const parts = rel.split(/[\\/]/);
    const themes = discoverThemes();
    const sources = discoverOverlaySources();
    if (parts[0] === "shared") {
      for (const theme of themes) await buildTheme(theme, sources).catch(console.error);
    } else if (parts[0] === "templates" && parts[1]) {
      const theme = themes.find((t) => t.name === parts[1]);
      if (theme) await buildTheme(theme, sources).catch(console.error);
    }
  }, 150));
}

// ── Dev server ────────────────────────────────────────────────────────────────

async function devMode(): Promise<void> {
  const clients = new Set<ReadableStreamDefaultController>();
  const notify = debounce(() => {
    for (const c of clients) { try { c.enqueue("data: r\n\n"); } catch { clients.delete(c); } }
  }, 150);

  startWatcher(notify);

  const mimeTypes: Record<string, string> = {
    ".html": "text/html;charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
    ".woff": "font/woff", ".woff2": "font/woff2",
  };

  Bun.serve({
    port: DEV_PORT,
    async fetch(req) {
      const urlPath = new URL(req.url).pathname;

      if (urlPath === "/__reload") {
        let ctrl!: ReadableStreamDefaultController;
        return new Response(
          new ReadableStream({
            start(c) { ctrl = c; clients.add(c); },
            cancel() { clients.delete(ctrl); },
          }),
          { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } }
        );
      }

      // route: /<theme>/<overlay>.html → compile on-the-fly
      const parts = urlPath.split("/").filter(Boolean);
      if (parts.length === 2 && parts[1]!.endsWith(".html")) {
        const [themeName, page] = parts as [string, string];
        const overlayName = page.replace(".html", "");
        const srcFile = join(OVERLAYS_DIR, `${overlayName[0]!.toUpperCase()}${overlayName.slice(1)}.tsx`);
        const themeDir = join(TEMPLATES_DIR, themeName);
        if (existsSync(srcFile) && existsSync(themeDir)) {
          try {
            const bgFile = findAsset(themeDir, "background");
            const bgUri = bgFile ? await toDataUri(bgFile) : "";
            const mieAyamFile = findAsset(themeDir, "mie-ayam");
            const mieAyamUri = `/${themeName}/mie-ayam${mieAyamFile ? extname(mieAyamFile) : ".png"}`;
            const { html } = await compileSource(srcFile, bgUri, mieAyamUri, true);
            return new Response(html, { headers: { "Content-Type": mimeTypes[".html"]! } });
          } catch (e: unknown) {
            const msg = (e as Error).message;
            return new Response(`<pre style="padding:20px;font-family:monospace">${msg}</pre>`,
              { status: 500, headers: { "Content-Type": "text/html" } });
          }
        }
      }

      // static asset fallback — check templates/ first, then root
      const inTemplates = join(TEMPLATES_DIR, ...parts);
      const inRoot = join(ROOT, ...parts);
      const filePath = existsSync(inTemplates) ? inTemplates : inRoot;
      const file = Bun.file(filePath);
      if (!(await file.exists())) return new Response("Not found", { status: 404 });
      const ext = extname(filePath).toLowerCase();
      return new Response(file, { headers: { "Content-Type": mimeTypes[ext] ?? "application/octet-stream" } });
    },
  });

  console.log(`\nDev server → http://localhost:${DEV_PORT}`);
  const themes = discoverThemes();
  const sources = discoverOverlaySources();
  for (const theme of themes) {
    for (const src of sources) {
      const overlay = src.split(/[\\/]/).pop()!.replace(".tsx", "").toLowerCase();
      console.log(`  http://localhost:${DEV_PORT}/${theme.name}/${overlay}.html`);
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
    if (SKIP_WATCH.has(seg0)) return;
    if (!WATCH_EXTS.has(extname(filename).toLowerCase())) return;
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
if (args.includes("--clean")) cleanDist();
else if (args.includes("--dev")) devMode();
else if (args.includes("--watch")) watchMode().catch(console.error);
else buildAll().catch((e) => { console.error((e as Error).message); process.exit(1); });
