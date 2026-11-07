// region: US | EU | FR | UK | ASIA | MENA | GLOBAL     cat: defense | tech | cyber | ai | space
// Ajoutez/retirez des flux librement : une URL cassée est simplement ignorée (voir /api/health).
export const FEEDS = [
  // --- Défense ---
  { name: "Defense News",        url: "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml", region: "US",   cat: "defense" },
  { name: "Breaking Defense",    url: "https://breakingdefense.com/feed/",                                 region: "US",   cat: "defense" },
  { name: "The War Zone",        url: "https://www.twz.com/feed",                                          region: "US",   cat: "defense" },
  { name: "Defense One",         url: "https://www.defenseone.com/rss/all/",                               region: "US",   cat: "defense" },
  { name: "C4ISRNET",            url: "https://www.c4isrnet.com/arc/outboundfeeds/rss/?outputType=xml",    region: "US",   cat: "defense" },
  { name: "Defence Blog",        url: "https://defence-blog.com/feed/",                                    region: "EU",   cat: "defense" },
  { name: "The Defense Post",    url: "https://thedefensepost.com/feed/",                                  region: "GLOBAL", cat: "defense" },
  { name: "Army Technology",     url: "https://www.army-technology.com/feed/",                             region: "UK",   cat: "defense" },
  { name: "Naval Technology",    url: "https://www.naval-technology.com/feed/",                            region: "UK",   cat: "defense" },
  { name: "Airforce Technology", url: "https://www.airforce-technology.com/feed/",                         region: "UK",   cat: "defense" },
  { name: "Eurasian Times",      url: "https://www.eurasiantimes.com/feed/",                               region: "ASIA", cat: "defense" },
  { name: "Opex360",             url: "https://www.opex360.com/feed/",                                     region: "FR",   cat: "defense", lang: "fr" },
  { name: "SpaceNews",           url: "https://spacenews.com/feed/",                                       region: "US",   cat: "space" },
  // --- Cyber ---
  { name: "The Record",          url: "https://therecord.media/feed",                                      region: "US",   cat: "cyber" },
  { name: "BleepingComputer",    url: "https://www.bleepingcomputer.com/feed/",                            region: "US",   cat: "cyber" },
  { name: "Krebs on Security",   url: "https://krebsonsecurity.com/feed/",                                 region: "US",   cat: "cyber" },
  { name: "The Hacker News",     url: "https://feeds.feedburner.com/TheHackersNews",                       region: "GLOBAL", cat: "cyber" },
  // --- Tech / IA ---
  { name: "TechCrunch",          url: "https://techcrunch.com/feed/",                                      region: "US",   cat: "tech" },
  { name: "The Verge",           url: "https://www.theverge.com/rss/index.xml",                            region: "US",   cat: "tech" },
  { name: "Ars Technica",        url: "https://feeds.arstechnica.com/arstechnica/index",                   region: "US",   cat: "tech" },
  { name: "Wired",               url: "https://www.wired.com/feed/rss",                                    region: "US",   cat: "tech" },
  { name: "Tom's Hardware",      url: "https://www.tomshardware.com/feeds/all",                            region: "US",   cat: "tech" },
  { name: "VentureBeat AI",      url: "https://venturebeat.com/category/ai/feed/",                         region: "US",   cat: "ai" },
  { name: "The Register",        url: "https://www.theregister.com/headlines.atom",                        region: "UK",   cat: "tech" },
  { name: "Heise",               url: "https://www.heise.de/rss/heise-atom.xml",                           region: "EU",   cat: "tech", lang: "de" },
  { name: "Numerama",            url: "https://www.numerama.com/feed/",                                    region: "FR",   cat: "tech", lang: "fr" },
  { name: "Le Monde Pixels",     url: "https://www.lemonde.fr/pixels/rss_full.xml",                        region: "FR",   cat: "tech", lang: "fr" },
  { name: "SCMP Tech",           url: "https://www.scmp.com/rss/36/feed",                                  region: "ASIA", cat: "tech" },
  { name: "Nikkei Asia",         url: "https://asia.nikkei.com/rss/feed/nar",                              region: "ASIA", cat: "tech" },
  { name: "Times of Israel Tech",url: "https://www.timesofisrael.com/topic/technology/feed/",              region: "MENA", cat: "tech" }
];
