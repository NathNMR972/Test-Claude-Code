(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Révélation au scroll — amélioration progressive.
     Sans JS, tout est déjà visible (voir style.css : .reveal n'est masqué
     que sous .js-anim, ajoutée ici).
     ------------------------------------------------------------------- */
  document.documentElement.classList.add("js-anim");

  if ("IntersectionObserver" in window) {
    var observateur = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("en-vue");
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      observateur.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("en-vue");
    });
  }

  /* ---------------------------------------------------------------------
     Repère de progression discret sous le header collant.
     ------------------------------------------------------------------- */
  var barreProgression = document.getElementById("progression-barre");
  if (barreProgression) {
    var tickProgrammee = false;
    function majProgression() {
      tickProgrammee = false;
      var hauteurDefilable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = hauteurDefilable > 0 ? window.scrollY / hauteurDefilable : 0;
      barreProgression.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!tickProgrammee) {
          tickProgrammee = true;
          window.requestAnimationFrame(majProgression);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", majProgression);
    majProgression();
  }

  /* ---------------------------------------------------------------------
     Vitrine du hero : le geste "scan" joue une seule fois, au chargement.
     ------------------------------------------------------------------- */
  var sceneHero = document.getElementById("hero-scene");
  if (sceneHero) {
    if ("IntersectionObserver" in window) {
      var observateurHero = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entree) {
            if (entree.isIntersecting) {
              sceneHero.classList.add("scan-joue");
              observateurHero.unobserve(sceneHero);
            }
          });
        },
        { threshold: 0.4 }
      );
      observateurHero.observe(sceneHero);
    } else {
      sceneHero.classList.add("scan-joue");
    }
  }

  /* ---------------------------------------------------------------------
     Secteurs d'activité : libellé affiché + icône dans l'aperçu.
     ------------------------------------------------------------------- */
  var SECTEURS = {
    restaurant: { label: "Restaurant", icone: "#icone-restaurant" },
    salon: { label: "Salon de coiffure & institut", icone: "#icone-salon" },
    garage: { label: "Garage automobile", icone: "#icone-garage" },
    hotel: { label: "Hôtel", icone: "#icone-hotel" },
    cabinet: { label: "Cabinet", icone: "#icone-cabinet" },
    boutique: { label: "Boutique", icone: "#icone-boutique" }
  };

  var MARQUES_DIACRITIQUES = new RegExp("[̀-ͯ]", "g");
  var CLE_STOCKAGE = "5sr-etat-demo";

  function lireEtatEnregistre() {
    try {
      var brut = window.localStorage.getItem(CLE_STOCKAGE);
      return brut ? JSON.parse(brut) : null;
    } catch (err) {
      return null;
    }
  }

  function enregistrerEtat(etat) {
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
    } catch (err) {
      // stockage indisponible (navigation privée, quota) — sans conséquence ici
    }
  }

  function slugifier(texte) {
    var t = (texte || "").trim();
    if (!t) return "votre-commerce";
    t = t
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .normalize("NFD")
      .replace(MARQUES_DIACRITIQUES, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return t || "votre-commerce";
  }

  /* ---------------------------------------------------------------------
     Démo interactive
     ------------------------------------------------------------------- */
  var demoForm = document.getElementById("demo-form");
  if (demoForm) {
    var champNom = document.getElementById("demo-nom");
    var champSecteur = document.getElementById("demo-secteur");
    var champAccroche = document.getElementById("demo-accroche");
    var erreurNom = document.getElementById("demo-nom-erreur");
    var couleurPerso = document.getElementById("demo-couleur-perso");
    var pastilles = Array.prototype.slice.call(
      document.querySelectorAll("#demo-couleurs .pastille[data-couleur]")
    );

    var ecran = document.getElementById("demo-ecran");
    var ecranIcone = document.getElementById("demo-icone");
    var ecranNom = document.getElementById("demo-ecran-nom");
    var ecranSecteur = document.getElementById("demo-ecran-secteur");
    var tampon = document.getElementById("demo-tampon");
    var qrUrlLegende = document.getElementById("demo-url");
    var lienOuvrir = document.getElementById("demo-ouvrir");
    var canvas = document.getElementById("demo-qr");
    var COULEUR_VALIDE_DEMO = /^#[0-9a-fA-F]{6}$/;

    // Un visiteur qui revient depuis apercu.html (bouton "Retour au site")
    // retrouve ses champs : la page les transmet en paramètres d'URL.
    (function preremplirDepuisURL() {
      var params = new URLSearchParams(window.location.search);
      var nomURL = params.get("nom");
      var secteurURL = params.get("secteur");
      var couleurURL = params.get("couleur");
      var accrocheURL = params.get("accroche");

      if (nomURL) champNom.value = nomURL.slice(0, 40);
      if (secteurURL && SECTEURS[secteurURL]) champSecteur.value = secteurURL;
      if (accrocheURL && champAccroche) champAccroche.value = accrocheURL.slice(0, 70);
      if (couleurURL && COULEUR_VALIDE_DEMO.test(couleurURL)) {
        var correspond = pastilles.some(function (b) {
          var estCelleci = b.getAttribute("data-couleur").toLowerCase() === couleurURL.toLowerCase();
          b.setAttribute("aria-checked", String(estCelleci));
          return estCelleci;
        });
        if (!correspond) {
          pastilles.forEach(function (b) {
            b.setAttribute("aria-checked", "false");
          });
          couleurPerso.value = couleurURL;
        }
      }
    })();

    function couleurActive() {
      var choisie = pastilles.filter(function (b) {
        return b.getAttribute("aria-checked") === "true";
      })[0];
      return choisie ? choisie.getAttribute("data-couleur") : couleurPerso.value;
    }

    var etat = {
      nom: champNom.value || "Le Bon Poulet",
      secteur: champSecteur.value || "restaurant",
      accroche: champAccroche ? champAccroche.value : "",
      couleur: couleurActive()
    };

    var minuteur = null;

    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });

    champNom.addEventListener("input", function () {
      etat.nom = champNom.value;
      if (champNom.value.trim()) masquerErreurNom();
      appliquerTexteImmediat();
      programmerMiseAJour();
    });

    champSecteur.addEventListener("change", function () {
      etat.secteur = champSecteur.value;
      appliquerTexteImmediat();
      programmerMiseAJour();
    });

    if (champAccroche) {
      champAccroche.addEventListener("input", function () {
        etat.accroche = champAccroche.value;
        programmerMiseAJour();
      });
    }

    pastilles.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        pastilles.forEach(function (b) {
          b.setAttribute("aria-checked", "false");
        });
        bouton.setAttribute("aria-checked", "true");
        etat.couleur = bouton.getAttribute("data-couleur");
        appliquerCouleur();
        programmerMiseAJour();
      });
    });

    couleurPerso.addEventListener("input", function () {
      pastilles.forEach(function (b) {
        b.setAttribute("aria-checked", "false");
      });
      etat.couleur = couleurPerso.value;
      appliquerCouleur();
      programmerMiseAJour();
    });

    function appliquerTexteImmediat() {
      var nomAffiche = etat.nom.trim() || "Votre Commerce";
      var infoSecteur = SECTEURS[etat.secteur] || SECTEURS.restaurant;
      ecranNom.textContent = nomAffiche;
      ecranSecteur.textContent = infoSecteur.label;
      ecranIcone.innerHTML = "";
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", infoSecteur.icone);
      ecranIcone.appendChild(use);
    }

    function appliquerCouleur() {
      ecran.style.setProperty("--demo-accent", etat.couleur);
    }

    function masquerErreurNom() {
      champNom.removeAttribute("aria-invalid");
      erreurNom.hidden = true;
    }

    function afficherErreurNom() {
      champNom.setAttribute("aria-invalid", "true");
      erreurNom.hidden = false;
      champNom.focus();
    }

    function programmerMiseAJour() {
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(genererApercu, 180);
    }

    function genererApercu(options) {
      // Par défaut, un vrai choix du visiteur (saisie, changement de secteur,
      // couleur) est mémorisé. L'appel d'initialisation (valeurs par défaut du
      // balisage, personne n'a encore rien choisi) passe persister:false pour
      // ne pas contaminer le préremplissage du formulaire de contact plus bas.
      var persister = !options || options.persister !== false;

      var slug = slugifier(etat.nom);
      var paramsObjet = {
        nom: etat.nom.trim() || "Votre Commerce",
        secteur: etat.secteur,
        couleur: etat.couleur
      };
      if (etat.accroche && etat.accroche.trim()) {
        paramsObjet.accroche = etat.accroche.trim();
      }
      var params = new URLSearchParams(paramsObjet);
      var urlRelative = "apercu.html?" + params.toString();
      var urlAffichee = "5starsreview.fr/avis/" + slug;

      qrUrlLegende.textContent = urlAffichee;
      lienOuvrir.setAttribute("href", urlRelative);

      var urlAbsolue;
      try {
        urlAbsolue = new URL(urlRelative, window.location.href).toString();
      } catch (err) {
        urlAbsolue = urlRelative;
      }
      dessinerQR(urlAbsolue);
      rejouerTampon();
      if (persister) {
        enregistrerEtat({ nom: etat.nom.trim(), secteur: etat.secteur, couleur: etat.couleur });
      }
    }

    function dessinerQR(texte) {
      if (typeof qrcode !== "function") return;
      var qr = qrcode(0, "M");
      qr.addData(texte);
      qr.make();

      var nbModules = qr.getModuleCount();
      var marge = 4;
      var echelle = Math.max(3, Math.round(232 / (nbModules + marge * 2)));
      var taille = (nbModules + marge * 2) * echelle;

      canvas.width = taille;
      canvas.height = taille;
      canvas.style.width = "190px";
      canvas.style.height = "190px";

      var ctx = canvas.getContext("2d");
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

    function rejouerTampon() {
      tampon.classList.remove("est-visible");
      // force le recalcul de style pour permettre de rejouer la transition
      void tampon.offsetWidth;
      tampon.classList.add("est-visible");
    }

    // Initialisation avec les valeurs par défaut déjà présentes dans le balisage
    // (ou celles reprises depuis l'URL si le visiteur revient d'apercu.html).
    appliquerTexteImmediat();
    appliquerCouleur();
    genererApercu({ persister: false });
    window.setTimeout(rejouerTampon, 450);

    // "Valider" : on vérifie le champ obligatoire avant de rediriger réellement
    // vers la page générée (même onglet, comme un vrai client qui scannerait).
    lienOuvrir.addEventListener("click", function (e) {
      if (!champNom.value.trim()) {
        e.preventDefault();
        afficherErreurNom();
      }
    });

    // Bascule QR code / Puce NFC : les deux mènent à la même page générée,
    // seule la façon de l'atteindre en salle change.
    var boutonsCanal = Array.prototype.slice.call(document.querySelectorAll(".canal-btn"));
    var vueQr = document.getElementById("canal-vue-qr");
    var vueNfc = document.getElementById("canal-vue-nfc");
    boutonsCanal.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        var canal = bouton.getAttribute("data-canal");
        boutonsCanal.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === bouton));
        });
        vueQr.hidden = canal !== "qr";
        vueNfc.hidden = canal !== "nfc";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Formulaire de contact.
     Sans backend possible (contrainte du projet), la solution qui fonctionne
     vraiment sans serveur : composer un email pré-rempli (mailto:). Le clic
     ouvre le logiciel de messagerie du visiteur avec le sujet et le corps
     déjà écrits à partir de ses réponses ; il ne reste qu'à cliquer sur
     « Envoyer » — rien ne part sans cette action de sa part.

     Sans JS : action="mailto:contact@5starsreview.fr" method="get" sur le
     <form> (voir index.html) — fallback imparfait mais fonctionnel, la
     plupart des clients mail ouvrent quand même un brouillon.

     Point d'intégration futur (webhook n8n) : pour capter aussi les leads
     dans un CRM/tableur en plus de l'email, ajouter ici un
     `fetch("https://VOTRE-INSTANCE-N8N/webhook/...", { method: "POST",
     body: JSON.stringify({ nom, secteur, coordonnees, message }) })`
     avant ou après la ligne `window.location.href = mailtoUrl` ci-dessous.
     ------------------------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactNom = document.getElementById("contact-nom");
    var contactSecteur = document.getElementById("contact-secteur");
    var contactCoord = document.getElementById("contact-coord");
    var contactMessage = document.getElementById("contact-message");
    var LIBELLES_SECTEURS = {
      restaurant: "Restaurant",
      salon: "Salon de coiffure & institut",
      garage: "Garage automobile",
      hotel: "Hôtel",
      cabinet: "Cabinet",
      boutique: "Boutique / commerce",
      autre: "Autre"
    };

    // Préremplit au premier contact réel avec le formulaire (pas au chargement
    // de la page) pour refléter ce que le visiteur a exploré dans la démo,
    // même s'il l'a essayée après le chargement initial.
    contactForm.addEventListener(
      "focusin",
      function preremplir() {
        contactForm.removeEventListener("focusin", preremplir);
        var etatEnregistre = lireEtatEnregistre();
        if (!etatEnregistre) return;
        if (!contactNom.value && etatEnregistre.nom) {
          contactNom.value = etatEnregistre.nom;
        }
        if (etatEnregistre.secteur) {
          contactSecteur.value = etatEnregistre.secteur;
        }
      },
      { once: true }
    );

    contactForm.addEventListener("submit", function (e) {
      if (typeof contactForm.reportValidity === "function" && !contactForm.reportValidity()) {
        return;
      }
      e.preventDefault();

      var nom = contactNom.value.trim();
      var secteurLabel = LIBELLES_SECTEURS[contactSecteur.value] || contactSecteur.value;
      var lignes = [
        "Commerce : " + nom,
        "Secteur : " + secteurLabel,
        "Coordonnées : " + contactCoord.value.trim()
      ];
      if (contactMessage.value.trim()) {
        lignes.push("", "Message :", contactMessage.value.trim());
      }
      var sujet = "Demande de démo — " + nom;
      var mailtoUrl =
        "mailto:contact@5starsreview.fr?subject=" +
        encodeURIComponent(sujet) +
        "&body=" +
        encodeURIComponent(lignes.join("\n"));

      window.location.href = mailtoUrl;

      var confirmation = document.getElementById("contact-confirmation");
      var lienVoirPage = document.getElementById("contact-voir-page");
      var couleur = (lireEtatEnregistre() || {}).couleur || "#E6355C";
      var params = new URLSearchParams({
        nom: nom || "Votre Commerce",
        secteur: contactSecteur.value,
        couleur: couleur,
        depuis: "contact"
      });
      lienVoirPage.setAttribute("href", "apercu.html?" + params.toString());

      contactForm.setAttribute("hidden", "");
      confirmation.removeAttribute("hidden");
      confirmation.setAttribute("tabindex", "-1");
      confirmation.focus();
    });
  }

  /* ---------------------------------------------------------------------
     Adapté à votre métier — quatre secteurs, un fait physique à la fois.
     ------------------------------------------------------------------- */
  var FAITS_METIER = {
    restaurant: {
      ou: "Sur la table ou l'addition, à portée de main pendant le repas.",
      quand: "Juste après le dessert, pendant qu'on attend la note.",
      change: "Un avis qui parle de l'accueil et du plat du jour pèse plus qu'une publicité."
    },
    salon: {
      ou: "Au poste de coiffage ou à la caisse, là où on règle.",
      quand: "Au moment de payer, cheveux encore frais — l'effet est encore visible.",
      change: "Un nouveau client choisit rarement un salon sans avis récents à montrer."
    },
    garage: {
      ou: "Au comptoir d'accueil, ou agrafé à la facture.",
      quand: "À la restitution du véhicule, quand le problème vient d'être réglé.",
      change: "La confiance compte plus ici qu'ailleurs — un avis rassure avant même le prochain devis."
    },
    hotel: {
      ou: "À l'accueil, ou posé dans la chambre.",
      quand: "Au moment du check-out, l'esprit encore dans le séjour.",
      change: "Le classement dans les résultats de recherche dépend directement du nombre d'avis récents."
    }
  };

  var boutonsMetier = Array.prototype.slice.call(document.querySelectorAll(".metier-btn"));
  if (boutonsMetier.length) {
    var metierOu = document.getElementById("metier-ou");
    var metierQuand = document.getElementById("metier-quand");
    var metierChange = document.getElementById("metier-change");

    boutonsMetier.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        boutonsMetier.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === bouton));
        });
        var faits = FAITS_METIER[bouton.getAttribute("data-secteur")];
        if (!faits) return;
        metierOu.textContent = faits.ou;
        metierQuand.textContent = faits.quand;
        metierChange.textContent = faits.change;
      });
    });
  }

  /* ---------------------------------------------------------------------
     Calculateur d'avis — une hypothèse affichée, pas un chiffre gonflé.
     ------------------------------------------------------------------- */
  var curseurClients = document.getElementById("calc-clients");
  if (curseurClients) {
    var TAUX_ESTIME = 0.05; // affiché en toutes lettres dans le texte à côté
    var JOURS_PAR_MOIS = 30;
    var valeurClients = document.getElementById("calc-clients-valeur");
    var chiffreAvis = document.getElementById("calc-chiffre");

    function majCalculateur() {
      var clients = Number(curseurClients.value);
      var avis = Math.round(clients * JOURS_PAR_MOIS * TAUX_ESTIME);
      valeurClients.textContent = clients;
      chiffreAvis.textContent = avis;
    }

    curseurClients.addEventListener("input", majCalculateur);
    majCalculateur();
  }
})();
