(function () {
  "use strict";

  var SECTEURS = {
    restaurant: { label: "Restaurant", icone: "#icone-restaurant" },
    salon: { label: "Salon de coiffure & institut", icone: "#icone-salon" },
    garage: { label: "Garage automobile", icone: "#icone-garage" },
    hotel: { label: "Hôtel", icone: "#icone-hotel" },
    cabinet: { label: "Cabinet", icone: "#icone-cabinet" },
    boutique: { label: "Boutique", icone: "#icone-boutique" },
    autre: { label: "Commerce", icone: "#icone-boutique" }
  };

  var COULEUR_PAR_DEFAUT = "#E6355C";
  var COULEUR_VALIDE = /^#[0-9a-fA-F]{6}$/;

  var params = new URLSearchParams(window.location.search);

  var nom = (params.get("nom") || "").trim().slice(0, 60) || "Votre Commerce";
  var secteurCle = params.get("secteur") || "restaurant";
  var infoSecteur = SECTEURS[secteurCle] || SECTEURS.restaurant;
  var couleurBrute = params.get("couleur") || COULEUR_PAR_DEFAUT;
  var couleur = COULEUR_VALIDE.test(couleurBrute) ? couleurBrute : COULEUR_PAR_DEFAUT;

  document.title = nom + " — avis Google (démonstration 5 Stars Review)";

  document.getElementById("apercu-nom").textContent = nom;
  document.getElementById("apercu-secteur").textContent = infoSecteur.label;
  document.getElementById("scene").style.setProperty("--accent-page", couleur);

  var iconeHote = document.getElementById("apercu-icone");
  iconeHote.innerHTML = "";
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", infoSecteur.icone);
  iconeHote.appendChild(use);

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
