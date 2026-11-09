// region: US | EU | FR | UK | ASIA | MENA | GLOBAL     cat: defense | tech | cyber | ai
// strict: "tech" = informatique seulement ; "def" = défense seulement ; "funding" = levées de fonds seulement
export const FEEDS = [
  // --- Défense ---
  { name: "Defense News",        url: "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml", region: "US",   cat: "defense" },
  { name: "Breaking Defense",    url: "https://breakingdefense.com/feed/",                                 region: "US",   cat: "defense" },
  { name: "The War Zone",        url: "https://www.twz.com/feed",                                          region: "US",   cat: "defense" },
  { name: "Defense One",         url: "https://www.defenseone.com/rss/all/",                               region: "US",   cat: "defense" },
  { name: "C4ISRNET",            url: "https://www.c4isrnet.com/arc/outboundfeeds/rss/?outputType=xml",    region: "US",   cat: "defense" },
  { name: "Naval News",          url: "https://www.navalnews.com/feed/",                                   region: "GLOBAL", cat: "defense" },
  { name: "Defence Blog",        url: "https://defence-blog.com/feed/",                                    region: "EU",   cat: "defense" },
  { name: "Army Technology",     url: "https://www.army-technology.com/feed/",                             region: "UK",   cat: "defense" },
  { name: "Naval Technology",    url: "https://www.naval-technology.com/feed/",                            region: "UK",   cat: "defense" },
  { name: "Airforce Technology", url: "https://www.airforce-technology.com/feed/",                         region: "UK",   cat: "defense" },
  { name: "The Diplomat",        url: "https://thediplomat.com/feed/",                                     region: "ASIA", cat: "defense", strict: "def" },
  { name: "Israel Defense",      url: "https://www.israeldefense.co.il/en/rss.xml",                        region: "MENA", cat: "defense" },
  { name: "Opex360",             url: "https://www.opex360.com/feed/",                                     region: "FR",   cat: "defense", lang: "fr" },
  // --- Cyber ---
  { name: "The Record",          url: "https://therecord.media/feed",                                      region: "US",   cat: "cyber" },
  { name: "BleepingComputer",    url: "https://www.bleepingcomputer.com/feed/",                            region: "US",   cat: "cyber" },
  { name: "Krebs on Security",   url: "https://krebsonsecurity.com/feed/",                                 region: "US",   cat: "cyber" },
  { name: "The Hacker News",     url: "https://thehackernews.com/feeds/posts/default",                     region: "GLOBAL", cat: "cyber" },
  // --- IA ---
  { name: "MIT Tech Review",     url: "https://www.technologyreview.com/feed/",                            region: "US",   cat: "ai", strict: "tech" },
  { name: "AI News",             url: "https://www.artificialintelligence-news.com/feed/",                 region: "UK",   cat: "ai" },
  // --- Informatique ---
  { name: "TechCrunch",          url: "https://techcrunch.com/feed/",                                      region: "US",   cat: "tech", strict: "tech" },
  { name: "Ars Technica",        url: "https://feeds.arstechnica.com/arstechnica/index",                   region: "US",   cat: "tech", strict: "tech" },
  { name: "Tom's Hardware",      url: "https://www.tomshardware.com/feeds/all",                            region: "US",   cat: "tech" },
  { name: "The Register",        url: "https://www.theregister.com/headlines.atom",                        region: "UK",   cat: "tech" },
  { name: "Heise",               url: "https://www.heise.de/rss/heise-atom.xml",                           region: "EU",   cat: "tech", lang: "de" },
  { name: "Numerama",            url: "https://www.numerama.com/feed/",                                    region: "FR",   cat: "tech", lang: "fr", strict: "tech" },
  { name: "Le Monde Pixels",     url: "https://www.lemonde.fr/pixels/rss_full.xml",                        region: "FR",   cat: "tech", lang: "fr", strict: "tech" },
  { name: "SCMP Tech",           url: "https://www.scmp.com/rss/36/feed",                                  region: "ASIA", cat: "tech", strict: "tech" },
  { name: "Nikkei Asia",         url: "https://asia.nikkei.com/rss/feed/nar",                              region: "ASIA", cat: "tech", strict: "tech" },
  // --- Levées de fonds ---
  { name: "Crunchbase News",     url: "https://news.crunchbase.com/feed/",                                 region: "US",   cat: "tech", strict: "funding" },
  { name: "Tech.eu",             url: "https://tech.eu/feed/",                                             region: "EU",   cat: "tech", strict: "funding" },
  { name: "Sifted",              url: "https://sifted.eu/feed",                                            region: "EU",   cat: "tech", strict: "funding" }
];
