# 5 Stars Review — site vitrine

Site vitrine de 5 Stars Review, le service qui aide les commerces locaux à
récolter plus d'avis Google authentiques via un QR code / une puce NFC posés
en salle. Ce dépôt contient le site qui **vend** le produit à un gérant de
commerce — pas la page d'avis elle-même, qui est le produit.

Aucun framework, aucun build, aucun backend : HTML, CSS et JavaScript natifs.
Le site fonctionne entièrement dans le navigateur, avec des données factices
pour la démo.

## Nouveautés V2

- **Le formulaire « Demander ma démo » redirige réellement** vers une page
  générée (`apercu.html?...&depuis=contact`), avec une bannière dédiée « ceci
  est un aperçu de votre future page ». S'il a testé la démo plus haut sur la
  page, ses choix (nom, secteur, couleur) préremplissent le formulaire — la
  couleur en particulier est réutilisée pour générer une page cohérente avec
  ce qu'il a déjà vu. Le formulaire fonctionne aussi **sans JavaScript**
  (`action="apercu.html" method="get"`) : il redirige quand même, juste sans
  l'animation de confirmation.
- **Bascule QR code / Puce NFC** dans la démo : les deux mènent à la même
  page, seul le geste change (scanner vs. poser son téléphone) — reflète le
  brief, qui met les deux canaux à égalité.
- **Section FAQ** (`#faq`, accordéon `<details>/<summary>` natif, donc
  accessible sans JavaScript) qui répond aux objections qui n'avaient pas
  encore de réponse sur le site : délai de mise en ligne, matériel fourni,
  changement de local, engagement, avis négatif, complémentarité avec les
  réseaux sociaux.
- **Pages légales** (`mentions-legales.html`, `confidentialite.html`) — le
  pied de page ne pointait vers rien de tel en V1. Les champs d'identité
  légale (SIRET, adresse, hébergeur…) sont marqués `[à compléter]` plutôt que
  remplis de fausses valeurs : voir « Hypothèses à trancher » plus bas.
- **Page 404** (`404.html`) à l'identité du site plutôt que la page blanche
  par défaut du navigateur.

## Ouvrir le site

Aucune installation n'est nécessaire.

- Double-cliquez sur `index.html` (ou ouvrez-le avec `Fichier → Ouvrir` dans
  votre navigateur). Tout fonctionne en local (`file://`), y compris la
  démo interactive et la génération de QR code.
- Pour une expérience plus proche d'un vrai déploiement (utile si vous
  voulez tester le QR code avec un vrai téléphone), servez le dossier avec
  n'importe quel serveur statique, par exemple :
  ```
  npx serve .
  # ou
  python3 -m http.server 8080
  ```
  puis ouvrez `http://localhost:.../index.html`.

## Structure du dépôt

```
index.html              La page vitrine complète (toutes les sections, dont #faq)
apercu.html             La page générée par la démo et par le formulaire — cible réelle du QR code
mentions-legales.html   Page légale (identité de l'éditeur à compléter)
confidentialite.html    Politique de confidentialité (données démo vs. formulaire)
404.html                Page d'erreur personnalisée
assets/
  css/
    style.css           Tokens de design, typographie, layout, toutes les sections du site principal
    apercu.css          Styles propres à apercu.html (charge style.css puis complète)
    legal.css           Styles des pages mentions-legales.html, confidentialite.html, 404.html
    fonts.css           Déclarations @font-face pour les polices auto-hébergées
  js/
    main.js             Démo interactive (formulaire → aperçu → QR/NFC), révélation au scroll, formulaire de contact → redirection
    apercu.js           Lit les paramètres d'URL (?nom=...&secteur=...&couleur=...&depuis=...) et personnalise apercu.html
    qrcode-lib.js        Bibliothèque tierce vendorisée pour générer le QR code (voir Crédits)
  fonts/
    bungee-*.woff2, karla-*.woff2, ibmplexmono-*.woff2   Sous-ensembles latins auto-hébergés
```

Pas de dossier `dist/` ou d'étape de compilation : les fichiers ci-dessus
sont directement ceux servis au navigateur.

## Direction de design (résumé)

Le plan de design complet (palette, typographie, wireframes, arbitrages) a
été discuté avant la construction du site. En résumé :

- **Palette** — `--nuit` (#14302B, vert bouteille profond), `--papier`
  (#F2DCC6, papier d'addition), `--piment` (#E6355C, rouge hibiscus),
  `--soleil` (#EAA33B, jaune de comptoir), `--ecume` (#F7EFE6), `--encre`
  (#1C1A17). Une variante assombrie `--piment-texte` (#A12540) est utilisée
  partout où `--piment` sert de couleur de texte, pour rester lisible
  (contraste ≥ 4.5:1) sur les fonds clairs.
- **Typographie** — **Bungee** en affichage (logo, titres courts, esprit
  enseigne peinte à la main), **Karla** en texte courant, **IBM Plex Mono**
  en usage utilitaire (prix, tickets, données du QR).
- **Signature** — le tampon : une étoile encrée, tracée à la main,
  légèrement irrégulière. Elle sert de marque, et s'abat sur la page générée
  au moment où la démo termine de la construire.
- Tous les tokens de couleur et de typographie sont centralisés dans
  `:root` en tête de `assets/css/style.css`.

## La démo interactive

`assets/js/main.js` écoute les champs du formulaire (`#demo-form`) et met à
jour en direct :
1. Le mockup de téléphone (nom du commerce, icône de secteur, couleur
   d'accent, étoiles).
2. Le QR code, dessiné sur un `<canvas>` à partir de la bibliothèque
   vendorisée `qrcode-lib.js` — aucune donnée n'est envoyée à un serveur,
   tout est calculé dans le navigateur.
3. Le lien « Ouvrir la page », qui pointe réellement vers `apercu.html` avec
   les valeurs saisies passées en paramètres d'URL.

Le QR code encode l'URL absolue de `apercu.html` (résolue via
`window.location.href`), donc si vous hébergez ce site sur un vrai domaine,
le QR généré par la démo est un vrai QR scannable de bout en bout.

Un sélecteur « QR code / Puce NFC » bascule entre le canvas du QR et un
pictogramme NFC (onde qui pulse doucement, respecte `prefers-reduced-
motion`) — les deux mènent au même lien « Ouvrir la page », pour rappeler
que ce sont deux portes d'entrée équivalentes vers la même page.

`apercu.html` lit ces paramètres (`nom`, `secteur`, `couleur`) et génère une
page personnalisée. Les entrées sont systématiquement échappées
(`textContent`, jamais `innerHTML`) et la couleur est validée par une regex
hexadécimale stricte avant d'être appliquée, pour éviter toute injection via
l'URL. Le bouton « Voir mon avis Google » de cette page ne simule pas
l'interface de Google (nous n'avons pas de raison de la reproduire) : il
affiche une explication stylisée dans le langage visuel du site.

## Formulaire de contact

Le formulaire de la section « Comment je commence » (`#contact-form`) est
**front-end uniquement** — aucune requête n'est envoyée à un serveur
(contrainte du projet : aucun backend, aucune clé d'API) — mais il a un vrai
effet : il redirige vers `apercu.html`, la même page générée que celle
ouverte par le QR code de la démo, avec un bandeau « aperçu de votre future
page ». C'est la maquette du bon moment de bascule pour le visiteur : il
voit sa page avant même d'avoir eu de réponse humaine.

- **Avec JavaScript** : le clic affiche une confirmation (le tampon, un
  message), avec un bouton « Voir ma page maintenant » et une redirection
  automatique après 4,5 secondes (délai volontairement long, annoncé à
  l'écran, pour rester confortable au clavier et au lecteur d'écran).
- **Sans JavaScript** : le formulaire garde `action="apercu.html"
  method="get"` — la soumission classique du navigateur atterrit directement
  sur `apercu.html` avec les bonnes valeurs dans l'URL, sans l'étape de
  confirmation. Nuance : la personnalisation de cette page (nom, secteur,
  couleur) est elle-même faite par `apercu.js` — un visiteur qui a
  désactivé JavaScript sur tout le site verra donc la page générique par
  défaut plutôt que sa version personnalisée. C'est la limite honnête d'un
  site 100 % statique sans backend ; corriger ça demanderait un rendu côté
  serveur.
- Si le visiteur a déjà testé la démo plus haut sur la page, son nom, son
  secteur et sa couleur (mémorisés dans `localStorage`, jamais transmis nul
  part) préremplissent le formulaire au premier focus — pas besoin de tout
  retaper.

Avant mise en ligne réelle, il faut relier ce point d'entrée à un vrai canal
de suivi (endpoint email, CRM, formulaire tiers type Netlify Forms/
Formspree…) — la redirection vers l'aperçu peut rester telle quelle en plus
de cet envoi. Le point d'intégration est le gestionnaire
`contactForm.addEventListener("submit", ...)` dans `assets/js/main.js`.

## Accessibilité

- Navigation clavier complète, focus visible sur tous les éléments
  interactifs (`:focus-visible`, couleur adaptée sur fonds sombres).
- Lien d'évitement (« Aller au contenu ») en tout début de page.
- `prefers-reduced-motion` respecté : les animations de révélation au
  scroll et l'animation du tampon désactivent leurs transitions ; le
  contenu reste visible sans JavaScript (dégradation progressive).
- Contrastes vérifiés (WCAG AA, ≥ 4.5:1 pour le texte) sur toutes les
  paires couleur de texte / fond utilisées.
- `scroll-margin-top` sur les sections pour que les liens d'ancrage ne
  passent pas sous le header collant.
- La FAQ utilise `<details>/<summary>` natifs : clavier, lecteurs d'écran et
  fonctionnement sans JavaScript sont gérés par le navigateur, pas par du
  code maison.
- La redirection automatique du formulaire de contact (voir plus haut) est
  annoncée à l'écran avant de se produire et reste évitable/accélérable via
  un bouton — pas de changement de contexte surprise.

## Crédits

- **QR code** — `assets/js/qrcode-lib.js` est la bibliothèque
  [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator)
  de Kazuhiko Arase, sous licence MIT, vendorisée telle quelle (voir l'en-tête
  du fichier).
- **Polices** — Bungee, Karla et IBM Plex Mono, sous licence SIL Open Font
  License, sous-ensemble latin téléchargé depuis Google Fonts et
  auto-hébergé dans `assets/fonts/`.
- « Google » et « Google Avis » sont des marques de Google LLC ; 5 Stars
  Review n'est pas affilié à Google (mention reprise dans le pied de page du
  site).

## Hypothèses à trancher avec le client

- Les tarifs (Starter 49€, Pro 79€, Business 99€) sont les hypothèses de
  lancement transmises dans le brief, affichées telles quelles.
- La section « pilote » ne cite pas de commerce ni de chiffre précis : au
  moment de la rédaction, aucun commerce pilote n'était encore engagé.
  Dès qu'il l'est, remplacer le texte générique par son nom et, si les
  résultats le permettent, un chiffre réel.
- `mentions-legales.html` et `confidentialite.html` contiennent des
  `[champs à compléter]` (raison sociale, SIRET, adresse, hébergeur,
  contact RGPD…) plutôt que des informations inventées. Ce sont les seules
  pages du site à ne pas être « finies » intentionnellement — elles ne
  doivent pas passer en ligne telles quelles.
