(function () {
  "use strict";

  var SECTEURS = {
    restaurant: {
      label: "Restaurant",
      icone: "#icone-restaurant",
      phrase: "Merci d'être passé à table. Un avis prend dix secondes et aide vraiment ce restaurant à faire vivre son quartier."
    },
    salon: {
      label: "Salon de coiffure & institut",
      icone: "#icone-salon",
      phrase: "Merci pour votre visite. Un avis Google aide ce salon à se faire connaître — dix secondes suffisent."
    },
    garage: {
      label: "Garage automobile",
      icone: "#icone-garage",
      phrase: "Merci pour votre confiance. Un avis Google aide ce garage à être trouvé par d'autres automobilistes du quartier."
    },
    hotel: {
      label: "Hôtel",
      icone: "#icone-hotel",
      phrase: "Merci de votre séjour. Un avis Google aide cet hôtel à accueillir ses prochains voyageurs."
    },
    cabinet: {
      label: "Cabinet",
      icone: "#icone-cabinet",
      phrase: "Merci pour votre visite. Un avis Google aide ce cabinet à se faire connaître auprès de nouveaux clients."
    },
    boutique: {
      label: "Boutique",
      icone: "#icone-boutique",
      phrase: "Merci pour votre achat. Un avis Google aide cette boutique à se faire connaître dans le quartier."
    },
    autre: {
      label: "Commerce",
      icone: "#icone-boutique",
      phrase: "Merci d'être passé. Un avis prend dix secondes et aide vraiment ce commerce à se faire connaître."
    }
  };

  var COULEUR_PAR_DEFAUT = "#E6355C";
  var COULEUR_VALIDE = /^#[0-9a-fA-F]{6}$/;
  var EXEMPLE_PAR_DEFAUT = "Le Bon Poulet";

  var params = new URLSearchParams(window.location.search);

  var nomBrut = (params.get("nom") || "").trim();
  var nom = (nomBrut || EXEMPLE_PAR_DEFAUT).slice(0, 60);
  var secteurCle = params.get("secteur") || "restaurant";
  var infoSecteur = SECTEURS[secteurCle] || SECTEURS.restaurant;
  var couleurBrute = params.get("couleur") || COULEUR_PAR_DEFAUT;
  var couleur = COULEUR_VALIDE.test(couleurBrute) ? couleurBrute : COULEUR_PAR_DEFAUT;
  var accrocheBrute = (params.get("accroche") || "").trim().slice(0, 140);
  var phrase = accrocheBrute || infoSecteur.phrase;

  var depuisContact = params.get("depuis") === "contact";

  document.title = depuisContact
    ? nom + " — aperçu de votre page 5 Stars Review"
    : nom + " — avis Google (démonstration 5 Stars Review)";

  if (depuisContact) {
    document.getElementById("apercu-tag").textContent = "Aperçu de votre future page";
    var banniere = document.getElementById("apercu-banniere");
    banniere.hidden = false;
  }

  // Toujours du texte (textContent), jamais du HTML : un nom du type
  // "<img src=x onerror=...>" s'affiche tel quel, il ne s'exécute jamais.
  document.getElementById("apercu-nom").textContent = nom;
  document.getElementById("apercu-secteur").textContent = infoSecteur.label;
  document.getElementById("apercu-phrase").textContent = phrase;
  document.getElementById("scene").style.setProperty("--accent-page", couleur);

  var iconeHote = document.getElementById("apercu-icone");
  iconeHote.innerHTML = "";
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", infoSecteur.icone);
  iconeHote.appendChild(use);

  // Le lien de retour transmet les mêmes valeurs : le formulaire de la démo,
  // sur la page d'accueil, les retrouve et se préremplit avec.
  var lienRetour = document.getElementById("apercu-retour");
  if (lienRetour) {
    var paramsRetour = new URLSearchParams();
    if (nomBrut) paramsRetour.set("nom", nomBrut);
    paramsRetour.set("secteur", secteurCle);
    paramsRetour.set("couleur", couleur);
    if (accrocheBrute) paramsRetour.set("accroche", accrocheBrute);
    var chaineRetour = paramsRetour.toString();
    lienRetour.setAttribute("href", "index.html" + (chaineRetour ? "?" + chaineRetour : "") + "#demo");
  }

  // Ce QR encode l'URL complète de cette page : le scanner avec un téléphone
  // amène exactement au même endroit.
  var canvasQr = document.getElementById("apercu-qr");
  if (canvasQr && typeof qrcode === "function") {
    var qr = qrcode(0, "M");
    qr.addData(window.location.href);
    qr.make();

    var nbModules = qr.getModuleCount();
    var marge = 3;
    var echelle = Math.max(2, Math.round(128 / (nbModules + marge * 2)));
    var taille = (nbModules + marge * 2) * echelle;

    canvasQr.width = taille;
    canvasQr.height = taille;
    canvasQr.style.width = "116px";
    canvasQr.style.height = "116px";

    var ctx = canvasQr.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, taille, taille);
    ctx.fillStyle = "#1c1a17";
    for (var r = 0; r < nbModules; r++) {
      for (var c = 0; c < nbModules; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + marge) * echelle, (r + marge) * echelle, echelle, echelle);
        }
      }
    }
  }

  var corps = document.getElementById("apercu-corps");
  var simulation = document.getElementById("apercu-simulation");
  var boutonVoir = document.getElementById("apercu-cta");
  var boutonRetour = document.getElementById("apercu-retour-btn");

  boutonVoir.addEventListener("click", function () {
    corps.hidden = true;
    simulation.hidden = false;
    document.getElementById("apercu-simulation-titre").focus();
  });

  boutonRetour.addEventListener("click", function () {
    simulation.hidden = true;
    corps.hidden = false;
    boutonVoir.focus();
  });
})();
