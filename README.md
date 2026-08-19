# 5 Stars Review — site vitrine

Site vitrine de 5 Stars Review, le service qui aide les commerces locaux à
récolter plus d'avis Google authentiques via un QR code / une puce NFC posés
en salle. Ce dépôt contient le site qui **vend** le produit à un gérant de
commerce — pas la page d'avis elle-même, qui est le produit.

Aucun framework, aucun build, aucun backend : HTML, CSS et JavaScript natifs.
Le site fonctionne entièrement dans le navigateur, avec des données factices
pour la démo.

## Nouveautés V3

- **Corrections** : les boutons (`.btn`) n'étaient plus soulignés que par
  accident de navigateur — ils le sont redevenus par erreur nulle part
  maintenant (`text-decoration: none` explicite) ; seuls les vrais liens en
  ligne (dans les paragraphes, le pied de page) gardent un soulignement. Le
  formulaire de contact, qui ne menait nulle part, compose maintenant un
  email pré-rempli — voir « Formulaire de contact » plus bas.
- **Le hero montre le produit** : un chevalet-QR et un téléphone affichant la
  page de Maison Blanche (le commerce pilote), reliés par un trait qui se
  trace au chargement pendant que l'écran du téléphone apparaît — un seul
  geste, une fois, en CSS/SVG pur (`#hero-scene` dans `index.html`,
  déclenché par `assets/js/main.js`). Sur mobile, la scène s'empile sous le
  texte plutôt que de disparaître.
- **La démo redirige pour de vrai** : un champ « phrase d'accroche »
  s'ajoute à nom/secteur/couleur ; le bouton « Voir ma page en ligne » valide
  le nom (erreur affichée sous le champ sinon, pas de redirection) puis
  navigue **dans le même onglet** vers `apercu.html`. Cette page génère
  elle-même un QR qui encode sa propre URL, et son bouton « Retour au site »
  ramène vers `index.html#demo` avec les mêmes paramètres, qui repréremplissent
  le formulaire — la boucle complète décrite dans le brief.
- **Quatre nouvelles sections**, insérées sans déplacer les anciennes : *Ce
  que vous recevez* (le kit, dessiné en CSS/SVG — chevalet, autocollant, carte
  NFC, page), *Adapté à votre métier* (4 secteurs en onglets), *Calculateur
  d'avis* (un curseur, un chiffre, une hypothèse affichée en clair — jamais
  un chiffre gonflé), *Après l'inscription* (le déroulé jour par jour).
- **FAQ étendue et section Martinique nommée** : la FAQ répond maintenant à
  12 questions dont celles imposées (autorisation Google, engagement,
  résiliation, clients sans smartphone…) ; la section pilote nomme
  **Maison Blanche**, restaurant pierrade à Fort-de-France, sans inventer de
  témoignage ni de chiffre de résultat.
- **Repère de progression** : fine barre sous le header collant, largeur liée
  au scroll (`#progression-barre`) — discrète, pas un menu à onglets.

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
    main.js             Démo interactive (formulaire → aperçu → QR/NFC), hero animé, onglets métier, calculateur, révélation au scroll, formulaire de contact → mailto
    apercu.js           Lit les paramètres d'URL (?nom=...&secteur=...&couleur=...&accroche=...&depuis=...), personnalise apercu.html et y génère son propre QR
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
3. Le bouton « Voir ma page en ligne », qui pointe réellement vers
   `apercu.html` avec les valeurs saisies (`nom`, `secteur`, `couleur`,
   `accroche`) passées en paramètres d'URL.

Le QR code encode l'URL absolue de `apercu.html` (résolue via
`window.location.href`), donc si vous hébergez ce site sur un vrai domaine,
le QR généré par la démo est un vrai QR scannable de bout en bout.

Un sélecteur « QR code / Puce NFC » bascule entre le canvas du QR et un
pictogramme NFC (onde qui pulse doucement, respecte `prefers-reduced-
motion`) — les deux mènent au même bouton « Voir ma page en ligne », pour
rappeler que ce sont deux portes d'entrée équivalentes vers la même page.

**Le parcours complet** : le champ « Nom du commerce » est obligatoire pour
la redirection — le laisser vide affiche une erreur sous le champ et
n'envoie nulle part (`#demo-nom-erreur`). Une fois validé, le clic navigue
**dans le même onglet** vers `apercu.html?nom=...&secteur=...&couleur=...&accroche=...`
— comme le ferait un vrai client qui scanne. `apercu.html` lit ces
paramètres et génère la page :

- Les entrées sont systématiquement échappées (`textContent`, jamais
  `innerHTML`) : un nom du type `<img src=x onerror=...>` s'affiche tel
  quel, il ne s'exécute jamais. Testé.
- La couleur est validée par une regex hexadécimale stricte ; un nom très
  long est tronqué et coupe proprement (`overflow-wrap: anywhere`) plutôt
  que de déborder ; sans aucun paramètre, la page affiche l'exemple
  cohérent « Le Bon Poulet » plutôt qu'une page cassée.
- La phrase d'accroche du secteur s'adapte automatiquement (6 secteurs +
  repli générique) si le champ « accroche » de la démo est resté vide ;
  sinon, la phrase saisie est utilisée telle quelle.
- `apercu.html` génère lui-même un second QR (`#apercu-qr`) qui encode
  l'URL complète de cette page : le scanner avec un téléphone ramène
  exactement au même endroit.
- Le bouton « ← Retour au site 5 Stars Review » (`#apercu-retour`) transmet
  les mêmes paramètres vers `index.html#demo`, qui les relit au chargement
  et repréremplit le formulaire de la démo — rien à retaper.
- Le bouton « Voir mon avis Google » de cette page ne simule pas
  l'interface de Google (nous n'avons pas de raison de la reproduire) : il
  affiche une explication stylisée dans le langage visuel du site.

## Formulaire de contact

Le formulaire de la section « Comment je commence » (`#contact-form`) est
**front-end uniquement** (contrainte du projet : aucun backend, aucune clé
d'API), mais il a un vrai effet : au clic sur « Demander ma démo », il
**compose un email pré-rempli** (`mailto:contact@5starsreview.fr`) avec le
sujet et le corps déjà écrits à partir des réponses du visiteur — il ne
reste qu'à cliquer sur « Envoyer » dans son propre logiciel de messagerie.
Rien ne part sans ce clic de sa part.

- **Email et téléphone en clair**, cliquables (`mailto:` / `tel:`), affichés
  directement dans la section — pas besoin de passer par le formulaire pour
  nous joindre.
  Le numéro affiché (`+596 XXX XXX XXX`, dans `index.html`, section
  Contact) est un gabarit à remplacer par le vrai numéro avant mise en
  ligne — repérable par le commentaire `TODO` juste au-dessus dans le code.
- **Avec JavaScript** : le clic construit l'URL `mailto:` (sujet = nom du
  commerce, corps = commerce/secteur/coordonnées/message), déclenche
  l'ouverture du client mail, puis affiche une confirmation honnête (« votre
  messagerie va s'ouvrir », pas « demande reçue » — on ne peut pas savoir
  s'il a réellement cliqué sur Envoyer) avec un lien de secours vers l'email
  en clair et un lien optionnel « Voir un aperçu de ma page ».
- **Sans JavaScript** : le `<form>` garde `action="mailto:contact@5starsreview.fr"
  method="get"` — fallback natif du navigateur, imparfait (les champs
  arrivent en vrac dans l'URL plutôt qu'en sujet/corps proprement formatés)
  mais fonctionnel : un email s'ouvre quand même.
- Si le visiteur a déjà testé la démo plus haut sur la page, son nom et son
  secteur (mémorisés dans `localStorage`, jamais transmis nulle part)
  préremplissent le formulaire au premier focus — pas besoin de tout
  retaper. La couleur choisie dans la démo est réutilisée pour le lien
  optionnel vers l'aperçu.

**Point d'intégration futur (webhook n8n)** : pour capter aussi les leads
dans un CRM ou un tableur en plus de l'email, le point d'ajout est
commenté explicitement dans `assets/js/main.js` juste avant
`window.location.href = mailtoUrl` — il suffit d'y ajouter un
`fetch("https://VOTRE-INSTANCE-N8N/webhook/...", { method: "POST", body:
JSON.stringify({ nom, secteur, coordonnees, message }) })`.

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
- Les onglets « Adapté à votre métier » et QR/NFC utilisent `aria-pressed`
  et sont activables au clavier (`Entrée`/`Espace` sur un `<button>` natif) ;
  le curseur du calculateur est un `<input type="range">` natif, donc
  pilotable aux flèches sans JavaScript supplémentaire.
- L'animation du hero (le geste « scan ») ne joue qu'une fois et respecte
  `prefers-reduced-motion` : sous ce réglage, le trait et l'écran du
  téléphone apparaissent directement dans leur état final, sans délai ni
  transition perceptible (`transition-delay` est aussi neutralisé, pas
  seulement `transition-duration`).

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
  lancement transmises dans le brief, affichées telles quelles — inchangés
  depuis la V1.
- La section « pilote » nomme Maison Blanche (restaurant pierrade, Fort-de-
  France) mais ne cite volontairement aucun chiffre de résultat : le pilote
  vient de démarrer. Dès que des retours existent, remplacer le paragraphe
  générique de `#pilote` par un chiffre réel — jamais un chiffre inventé.
- Le taux de conversion du calculateur d'avis (`#calculateur`, 5 %,
  `TAUX_ESTIME` dans `assets/js/main.js`) est une hypothèse éditoriale
  raisonnable, pas une mesure. À ajuster dès que le pilote Maison Blanche
  donne un vrai chiffre.
- Le numéro de téléphone affiché en section Contact (`+596 XXX XXX XXX`)
  est un gabarit — voir « Formulaire de contact » plus haut.
- `mentions-legales.html` et `confidentialite.html` contiennent des
  `[champs à compléter]` (raison sociale, SIRET, adresse, hébergeur,
  contact RGPD…) plutôt que des informations inventées. Ce sont les seules
  pages du site à ne pas être « finies » intentionnellement — elles ne
  doivent pas passer en ligne telles quelles.
