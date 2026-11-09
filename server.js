import express from "express";
import Parser from "rss-parser";
import { FEEDS } from "./feeds.js";

const PORT = process.env.PORT || 3000;
const REFRESH_MS = (Number(process.env.REFRESH_MINUTES) || 10) * 60_000;
const MAX_AGE_DAYS = 10, MAX_ITEMS = 800;

const parser = new Parser();
let cache = { items: [], updated: null, status: [] };

// Sujets exclus, quelle que soit la source
const BLOCK = /\b(onlyfans|only fans|porn\w*|nsfw|sex\w*|nude|escort|dating|horoscop\w*|celebrit\w*|kardashian|influenceu\w*|influencer\w*|tiktoker\w*|gossip|fashion|recipe\w*|deals?|discount\w*|coupon\w*|promo code|black friday|cyber monday|giveaway|bon plan|bons plans|soldes|netflix|disney|spotify|playstation|xbox|nintendo|gaming|jeu vidéo|jeux vidéo|trailer|box office)\b/i;

// Sources généralistes : on ne garde que ce qui parle d'informatique
const TECH_ALLOW = /\b(software|logiciel\w*|cloud|serveur\w*|servers?|data ?cent\w+|cpu|gpu|npu|chips?|puces?|semiconductor\w*|semi-?conducteur\w*|processor\w*|processeur\w*|intelligence artificielle|artificial intelligence|machine learning|llm|open[- ]source|linux|windows|android|api|developer\w*|développeur\w*|programming|programmation|coding|cyber\w*|security|sécurité|vulnerabilit\w*|vulnérabilit\w*|faille\w*|hack\w*|pirat\w*|ransomware|malware|breach|database|base de données|network\w*|réseau\w*|5g|6g|quantum|quantique|robot\w*|encryption|chiffrement|kubernetes|github|nvidia|openai|anthropic|intel|amd|tsmc|aws|firmware|zero-day|informatique|ordinateur\w*|computer\w*|supercomputer\w*|algorithm\w*|algorithme\w*)\b/i;
const AI_WORD = /\b(AI|IA)\b/;

// Sources généralistes : on ne garde que ce qui parle de défense
const DEF_ALLOW = /\b(military|militaire\w*|army|armée\w*|navy|air force|defen[sc]e|défense|missile\w*|drone\w*|warship\w*|frigate\w*|submarine\w*|sous-marin\w*|fighter\w*|rafale|nato|otan|pentagon\w*|weapon\w*|armement\w*|war|guerre|troops|soldier\w*|combat\w*|radar\w*|hypersonic\w*|artillery|tank\w*|intercept\w*|munition\w*|nuclear|nucléaire)\b/i;

// Article d'une source informatique qui parle clairement de militaire → rangé en Défense
const DEF_RECLASS = /\b(military|militaire\w*|pentagon\w*|missile\w*|warfare|army|armée|navy|air force|defen[sc]e|défense|nato|otan|weapon\w*|hypersonic\w*)\b/i;

// --- Détection des levées de fonds ---
const AMOUNT = /(?:[$€£]\s?\d[\d.,]*\s?(?:million|billion|millions|milliards?|mn|bn|[mbk]\b|Md\b)?)|(?:\d[\d.,]*\s?(?:million|billion|millions|milliards?|M|Md)\s?(?:d[e'’]\s?)?(?:dollars?|euros?|USD|EUR|\$|€))/i;
const STAGE = /\b(series [a-f]\+?|seed (?:round|funding)|pre-seed|funding round|venture (?:round|funding|capital)|unicorn|levée de fonds|a levé|ont levé)\b/i;
const RAISE = /\b(raises?|raised|raising|lève|lèvent|secures?|lands?|closes?)\b/i;
const NOT_FUND = /\b(contract\w*|award\w*|orders?|contrats?|marché|tender|budget|taxes?|rates?|prices?|forecast|estimates?)\b/i;

function detectFunding(title, summary) {
  const text = title + " " + summary;
  const a = text.match(AMOUNT), s = text.match(STAGE);
  const ok = (s || (RAISE.test(title) && a)) && !(NOT_FUND.test(title) && !s);
  if (!ok) return null;
  return { amount: a ? a[0].trim() : null, stage: s ? s[0].replace(/\b\w/g, (c) => c.toUpperCase()) : null };
}

function accept(f, text, fund) {
  if (BLOCK.test(text)) return false;
  if (f.strict === "tech") return TECH_ALLOW.test(text) || AI_WORD.test(text) || (fund && DEF_ALLOW.test(text));
  if (f.strict === "def") return DEF_ALLOW.test(text);
  if (f.strict === "funding") return !!fund && (TECH_ALLOW.test(text) || AI_WORD.test(text) || DEF_ALLOW.test(text));
  return true;
}

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
      const out = [];
      for (const i of r.items.slice(0, 40)) {
        const title = clean(i.title);
        const summary = clean(i.contentSnippet || i.summary || i.content || "").slice(0, 220);
        const text = title + " " + summary;
        const funding = detectFunding(title, summary);
        if (!accept(f, text, funding)) continue;
        let d = new Date(i.isoDate || i.pubDate);
        if (isNaN(d) || d > new Date()) d = new Date();
        let cat = f.cat;
        if ((cat === "tech" || cat === "ai") && DEF_RECLASS.test(text)) cat = "defense";
        out.push({ title, url: i.link, summary, date: d.toISOString(),
          source: f.name, region: f.region, cat, lang: f.lang || "en", funding });
      }
      status.push({ source: f.name, ok: true, n: r.items.length, kept: out.length });
      return out;
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
  console.log(`[refresh] ${items.length} articles (${items.filter((i) => i.funding).length} levées), ${status.filter((s) => s.ok).length}/${FEEDS.length} flux OK`);
}

const app = express();
app.get("/api/news", (req, res) => {
  const { cat, region, lang, q, funding, limit = 100 } = req.query;
  const needle = q ? String(q).toLowerCase() : null;
  const items = cache.items.filter((i) =>
    (!cat || cat === "all" || i.cat === cat) &&
    (!region || region === "all" || i.region === region) &&
    (!lang || lang === "all" || i.lang === lang) &&
    (!funding || i.funding) &&
    (!needle || (i.title + " " + i.summary + " " + i.source).toLowerCase().includes(needle))
  ).slice(0, Math.min(Number(limit) || 100, 300));
  res.json({ updated: cache.updated, count: items.length, items });
});
app.get("/api/health", (_, res) => res.json({ updated: cache.updated, total: cache.items.length, funding: cache.items.filter((i) => i.funding).length, feeds: cache.status }));
app.use(express.static("public"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
refresh();
setInterval(refresh, REFRESH_MS);
