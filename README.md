# Veille Tech & Défense

Agrégateur d'actualités mondiales (défense, drones, spatial, cyber, IA, tech) via flux RSS.
Le serveur récupère ~30 sources toutes les 10 min, déduplique et sert `/api/news`.
La page se rafraîchit seule toutes les 60 s.

## Lancer en local
    npm install
    npm start        # http://localhost:3000

## Déployer (gratuit/peu cher)
Render, Railway, Fly.io ou Vercel (Node) : build `npm install`, start `npm start`.
Variables optionnelles : `PORT`, `REFRESH_MINUTES` (défaut 10).

## Personnaliser
- Sources : éditez `feeds.js` (nom, url, region, cat, lang).
- Diagnostic : `/api/health` montre quels flux répondent ; un flux en erreur est ignoré.
