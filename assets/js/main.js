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

    var etat = {
      nom: champNom.value || "Le Bon Poulet",
      secteur: champSecteur.value || "restaurant",
      couleur: "#E6355C"
    };

    var minuteur = null;

    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });

    champNom.addEventListener("input", function () {
      etat.nom = champNom.value;
      appliquerTexteImmediat();
      programmerMiseAJour();
    });

    champSecteur.addEventListener("change", function () {
      etat.secteur = champSecteur.value;
      appliquerTexteImmediat();
      programmerMiseAJour();
    });

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

    function programmerMiseAJour() {
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(genererApercu, 180);
    }

    function genererApercu() {
      var slug = slugifier(etat.nom);
      var params = new URLSearchParams({
        nom: etat.nom.trim() || "Votre Commerce",
        secteur: etat.secteur,
        couleur: etat.couleur
      });
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
      enregistrerEtat({ nom: etat.nom.trim(), secteur: etat.secteur, couleur: etat.couleur });
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

    // Initialisation avec les valeurs par défaut déjà présentes dans le balisage.
    appliquerCouleur();
    genererApercu();
    window.setTimeout(rejouerTampon, 450);

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
     Sans JS : soumission classique (action="apercu.html" method="get"),
     le navigateur atterrit directement sur la page générée.
     Avec JS : confirmation, puis redirection vers la même page — en
     réutilisant la couleur choisie dans la démo si le visiteur l'a essayée.
     ------------------------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactNom = document.getElementById("contact-nom");
    var contactSecteur = document.getElementById("contact-secteur");

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

    var minuteurRedirection = null;

    contactForm.addEventListener("submit", function (e) {
      if (typeof contactForm.reportValidity === "function" && !contactForm.reportValidity()) {
        return;
      }
      e.preventDefault();

      var couleur = (lireEtatEnregistre() || {}).couleur || "#E6355C";
      var params = new URLSearchParams({
        nom: contactNom.value.trim() || "Votre Commerce",
        secteur: contactSecteur.value,
        couleur: couleur,
        depuis: "contact"
      });
      var urlApercu = "apercu.html?" + params.toString();

      var confirmation = document.getElementById("contact-confirmation");
      var lienVoirPage = document.getElementById("contact-voir-page");
      lienVoirPage.setAttribute("href", urlApercu);
      lienVoirPage.addEventListener("click", function () {
        window.clearTimeout(minuteurRedirection);
      });

      contactForm.setAttribute("hidden", "");
      confirmation.removeAttribute("hidden");
      confirmation.setAttribute("tabindex", "-1");
      confirmation.focus();

      window.clearTimeout(minuteurRedirection);
      minuteurRedirection = window.setTimeout(function () {
        window.location.href = urlApercu;
      }, 4500);
    });
  }
})();
