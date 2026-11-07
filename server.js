import express from "express";
import Parser from "rss-parser";
import { FEEDS } from "./feeds.js";

const PORT = process.env.PORT || 3000;
const REFRESH_MS = (Number(process.env.REFRESH_MINUTES) || 10) * 60_000;
const MAX_AGE_DAYS = 10, MAX_ITEMS = 800;

const parser = new Parser();
let cache = { items: [], updated: null, status: [] };

const clean = (s = "") => String(s).replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ")
  .replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/\s+/g, " ").trim();
const norm = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; VeilleTechDefense/1.0)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    },
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const xml = (await res.text()).replace(/&(?![A-Za-z][A-Za-z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;");
  return parser.parseString(xml);
}

async function refresh() {
  const status = [];
  const batches = await Promise.all(FEEDS.map(async (f) => {
    try {
      const r = await fetchFeed(f.url);
      status.push({ source: f.name, ok: true, n: r.items.length });
      return r.items.slice(0, 30).map((i) => {
        let d = new Date(i.isoDate || i.pubDate);
        if (isNaN(d) || d > new Date()) d = new Date();
        return {
          title: clean(i.title),
          url: i.link,
          summary: clean(i.contentSnippet || i.summary || i.content || "").slice(0, 220),
          date: d.toISOString(),
          source: f.name, region: f.region, cat: f.cat, lang: f.lang || "en",
        };
      });
    } catch (e) {
      const msg = e.message || e.cause?.message || e.name || String(e);
      status.push({ source: f.name, ok: false, error: String(msg).slice(0, 100) });
      return [];
    }
  }));
  const seen = new Set(), cutoff = Date.now() - MAX_AGE_DAYS * 864e5, items = [];
  for (const it of batches.flat().sort((a, b) => b.date.localeCompare(a.date))) {
    const k = norm(it.title || "");
    if (!k || !it.url || seen.has(k) || new Date(it.date) < cutoff) continue;
    seen.add(k); items.push(it);
  }
  if (items.length) cache = { items: items.slice(0, MAX_ITEMS), updated: new Date().toISOString(), status };
  else cache.status = status;
  console.log(`[refresh] ${items.length} articles, ${status.filter((s) => s.ok).length}/${FEEDS.length} flux OK`);
}

const app = express();
app.get("/api/news", (req, res) => {
  const { cat, region, lang, q, limit = 100 } = req.query;
  const needle = q ? String(q).toLowerCase() : null;
  const items = cache.items.filter((i) =>
    (!cat || cat === "all" || i.cat === cat) &&
    (!region || region === "all" || i.region === region) &&
    (!lang || lang === "all" || i.lang === lang) &&
    (!needle || (i.title + " " + i.summary + " " + i.source).toLowerCase().includes(needle))
  ).slice(0, Math.min(Number(limit) || 100, 300));
  res.json({ updated: cache.updated, count: items.length, items });
});
app.get("/api/health", (_, res) => res.json({ updated: cache.updated, total: cache.items.length, feeds: cache.status }));
app.use(express.static("public"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
refresh();
setInterval(refresh, REFRESH_MS);
