import express from "express";
import Parser from "rss-parser";
import { FEEDS } from "./feeds.js";

const PORT = process.env.PORT || 3000;
const REFRESH_MS = (Number(process.env.REFRESH_MINUTES) || 10) * 60_000;
const MAX_AGE_DAYS = 10, MAX_ITEMS = 800;

const parser = new Parser({
  timeout: 12_000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; VeilleTechDefense/1.0)" },
});
let cache = { items: [], updated: null, status: [] };

const clean = (s = "") => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ")
  .replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/\s+/g, " ").trim();
const norm = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/g, " ").trim();

async function refresh() {
  const status = [];
  const batches = await Promise.all(FEEDS.map(async (f) => {
    try {
      const r = await parser.parseURL(f.url);
      status.push({ source: f.name, ok: true, n: r.items.length });
      return r.items.slice(0, 30).map((i) => ({
        title: clean(i.title),
        url: i.link,
        summary: clean(i.contentSnippet || i.summary || i.content || "").slice(0, 220),
        date: new Date(i.isoDate || i.pubDate || Date.now()).toISOString(),
        source: f.name, region: f.region, cat: f.cat, lang: f.lang || "en",
      }));
    } catch (e) {
      status.push({ source: f.name, ok: false, error: String(e.message).slice(0, 80) });
      return [];
    }
  }));
  const seen = new Set(), cutoff = Date.now() - MAX_AGE_DAYS * 864e5, items = [];
  for (const it of batches.flat().sort((a, b) => b.date.localeCompare(a.date))) {
    const k = norm(it.title);
    if (!it.title || !it.url || seen.has(k) || new Date(it.date) < cutoff) continue;
    seen.add(k); items.push(it);
  }
  if (items.length) cache = { items: items.slice(0, MAX_ITEMS), updated: new Date().toISOString(), status };
  else cache.status = status; // garde l'ancien cache si tout a échoué
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
