import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const GROUPES_LABELS = {
  1: "Identité et éléments du parcours",
  2: "Analyse des attentes et besoins",
  3: "Projet",
  4: "Vie quotidienne",
  5: "Bilans et évaluations",
};

// ─── Vérification du contenu ────────────────────────────────────────────────

function checkAnyValue(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.trim() !== "";
  if (typeof val === "number") return val !== 0;
  if (Array.isArray(val)) return val.some(checkAnyValue);
  if (typeof val === "object") return Object.values(val).some(checkAnyValue);
  return false;
}

export function hasContent(moduleId, data) {
  if (!data) return false;
  if (moduleId === "objectifs") {
    return (data.objectifs || []).some(
      (o) => o.titre?.trim() || (o.moyens || []).some((m) => m.contenu?.trim())
    );
  }
  if (moduleId === "reseau") {
    return Object.values(data.partenaires || {}).some((v) => v?.trim());
  }
  if (moduleId.includes("eval_objectifs_pp")) {
    return Object.values(data.evaluations || {}).some(
      (e) => e?.statut || e?.evolution?.trim()
    );
  }
  if (moduleId.includes("eval_stage")) {
    return (data.stages || []).some(
      (s) => s.structure?.trim() || s.commentaire?.trim() || s.evolution?.trim()
    );
  }
  if (moduleId.includes("autres_evaluations")) {
    return (data.evaluations || []).some(
      (e) => e.type?.trim() || e.observations?.trim()
    );
  }
  return checkAnyValue(data);
}

// ─── Helpers docx ────────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}

function kv(label, value) {
  if (value === null || value === undefined || value === "" || value === false)
    return null;
  const strVal = String(value).trim();
  if (!strVal) return null;
  return new Paragraph({
    children: [
      new TextRun({ text: `${label} : `, bold: true }),
      new TextRun({ text: strVal }),
    ],
    spacing: { before: 60, after: 60 },
  });
}

function bullet(text) {
  return new Paragraph({
    text: `  • ${text}`,
    spacing: { before: 40, after: 40 },
  });
}

function subTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, underline: {} })],
    spacing: { before: 140, after: 60 },
  });
}

function textPara(text) {
  if (!text?.trim()) return null;
  return new Paragraph({ text: text.trim(), spacing: { before: 60, after: 60 } });
}

function compact(arr) {
  return arr.flat().filter(Boolean);
}

// ─── Renderers par type de formulaire ────────────────────────────────────────

function renderEtatCivil(d) {
  return compact([
    kv("Nom", d.nom),
    kv("Prénom", d.prenom),
    kv("Date de naissance", d.dateNaissance),
    d.age ? kv("Âge", `${d.age} ans`) : null,
  ]);
}

function renderSituationFamiliale(d) {
  const LAB_MAR = {
    celibataire: "Célibataire", marie: "Marié(e)", pacse: "Pacsé(e)",
    divorce: "Divorcé(e) / Séparé(e)", veuf: "Veuf / Veuve", concubinage: "Concubinage / Union libre",
  };
  const LAB_MODE = {
    seul: "Seul(e)", conjoint: "Avec conjoint(e)", famille: "En famille",
    institution: "En institution", residence_autonomie: "Résidence autonomie",
    hebergement_tiers: "Hébergé(e) par un tiers", autre: "Autre",
  };
  const LAB_CHARGE = { oui: "Oui", non: "Non", partiel: "Partiellement" };
  return compact([
    kv("Situation maritale", LAB_MAR[d.situationMaritale] || d.situationMaritale),
    kv("Nombre d'enfants", d.nbEnfants),
    kv("Enfants à charge", LAB_CHARGE[d.enfantsACharge] || d.enfantsACharge),
    kv("Mode de vie", LAB_MODE[d.modeVie] || d.modeVie),
    d.aidantProche ? kv("Aidant proche", "Oui") : null,
  ]);
}

function renderScolarite(d) {
  const LAB = {
    sans_diplome: "Sans diplôme", cap_bep: "CAP / BEP", bac: "Baccalauréat",
    bac_plus2: "Bac +2", bac_plus3: "Bac +3", bac_plus5: "Bac +5 et +",
    scolarisation_ordinaire: "Scolarisation ordinaire",
    scolarisation_adaptee: "Scolarisation adaptée (ULIS, SEGPA…)", ime_impro: "IME / IMPRO",
  };
  return compact([
    kv("Niveau de formation", LAB[d.niveau] || d.niveau),
    kv("Dernier diplôme / titre obtenu", d.diplome),
    kv("Formation en cours", d.formationCours),
    kv("Établissement fréquenté", d.etablissement),
  ]);
}

function renderSituationPro(d) {
  const LAB_STATUT = {
    emploi_ordinaire: "En emploi (milieu ordinaire)", esat: "ESAT", ea: "Entreprise Adaptée",
    sans_emploi: "Sans emploi", formation: "En formation", retraite: "À la retraite",
    invalidite: "Invalidité", non_concerne: "Non concerné",
  };
  const LAB_CONTRAT = { cdi: "CDI", cdd: "CDD", interim: "Intérim", alternance: "Alternance", stage: "Stage", na: "N/A" };
  return compact([
    kv("Statut professionnel", LAB_STATUT[d.statut] || d.statut),
    kv("Type de contrat", LAB_CONTRAT[d.typeContrat] || d.typeContrat),
    kv("Employeur / Structure", d.employeur),
    d.heuresHebdo ? kv("Durée hebdomadaire", `${d.heuresHebdo}h`) : null,
  ]);
}

const DROITS_MDPH_LIST = [
  { id: "aah", label: "AAH – Allocation aux Adultes Handicapés" },
  { id: "pch", label: "PCH – Prestation de Compensation du Handicap" },
  { id: "aeeh", label: "AEEH – Allocation d'Éducation de l'Enfant Handicapé" },
  { id: "rqth", label: "RQTH – Reconnaissance Qualité Travailleur Handicapé" },
  { id: "cmi", label: "CMI – Carte Mobilité Inclusion" },
  { id: "mrs", label: "MVS – Majoration pour la Vie Autonome" },
];
const ORIENTATIONS_ESMS_LIST = [
  { id: "esat", label: "ESAT" }, { id: "fam", label: "FAM" }, { id: "mas", label: "MAS" },
  { id: "samsah", label: "SAMSAH" }, { id: "savs", label: "SAVS" },
  { id: "foyer_vie", label: "Foyer de Vie" }, { id: "foyer_hebergement", label: "Foyer d'Hébergement" },
  { id: "sessad", label: "SESSAD" }, { id: "ime", label: "IME" }, { id: "itep", label: "ITEP" },
  { id: "camsp", label: "CAMSP" }, { id: "cmpp", label: "CMPP" },
  { id: "accueil_jour", label: "Accueil de Jour" }, { id: "internat", label: "Internat" },
];

function renderDroitsMDPH(d) {
  const result = [];
  const checked = DROITS_MDPH_LIST.filter((x) => d.droits?.[x.id]);
  if (checked.length > 0) {
    result.push(subTitle("Droits MDPH"));
    checked.forEach((x) => result.push(bullet(x.label)));
  }
  const orient = ORIENTATIONS_ESMS_LIST.filter((x) => d.orientations?.[x.id]);
  if (orient.length > 0) {
    result.push(subTitle("Orientations ESMS"));
    orient.forEach((x) => result.push(bullet(x.label)));
  }
  return result;
}

const AIDES_LOGEMENT_LIST = [
  { id: "apl", label: "APL" }, { id: "als", label: "ALS" }, { id: "alf", label: "ALF" },
  { id: "logement_social", label: "Demande logement social en cours" },
  { id: "foyer_residence", label: "Foyer / Résidence spécialisée" },
  { id: "hebergement_urgence", label: "Hébergement d'urgence / CHRS" },
  { id: "fsl", label: "FSL" },
];
function renderDroitsLogement(d) {
  const LAB_LOG = {
    appartement: "Appartement", maison: "Maison", chambre: "Chambre / Studio",
    foyer: "Foyer / Résidence", institution: "Institution / ESMS",
    sans_abri: "Sans domicile fixe", hebergement: "Hébergé par un tiers",
  };
  const LAB_STATUT = {
    proprietaire: "Propriétaire", locataire: "Locataire", sous_locataire: "Sous-locataire",
    heberge: "Hébergé à titre gratuit", squat: "Occupation sans titre",
  };
  const result = compact([
    kv("Type de logement", LAB_LOG[d.typeLogement] || d.typeLogement),
    kv("Statut d'occupation", LAB_STATUT[d.statut] || d.statut),
  ]);
  const aides = AIDES_LOGEMENT_LIST.filter((x) => d.aides?.[x.id]);
  if (aides.length > 0) {
    result.push(subTitle("Aides au logement"));
    aides.forEach((x) => result.push(bullet(x.label)));
  }
  return result;
}

const DROITS_EMPLOI_LIST = [
  { id: "france_travail", label: "Inscrit(e) à France Travail" },
  { id: "are", label: "ARE" }, { id: "ass", label: "ASS" }, { id: "rsa", label: "RSA" },
  { id: "boeth", label: "BOETH" }, { id: "cap_emploi", label: "Suivi Cap Emploi" },
  { id: "agefiph", label: "Aide AGEFIPH" }, { id: "csp", label: "CSP" },
  { id: "contrat_aide", label: "Contrat Aidé (CAE, CUI…)" },
];
function renderDroitsEmploi(d) {
  const checked = DROITS_EMPLOI_LIST.filter((x) => d.droits?.[x.id]);
  if (!checked.length) return [];
  return [subTitle("Droits et dispositifs emploi"), ...checked.map((x) => bullet(x.label))];
}

const DROITS_DIVERS_LIST = [
  { id: "css", label: "CSS" }, { id: "ame", label: "AME" }, { id: "aspa", label: "ASPA" },
  { id: "asi", label: "ASI" }, { id: "tutelle", label: "Mesure de protection – Tutelle" },
  { id: "curatelle", label: "Mesure de protection – Curatelle" },
  { id: "sauvegarde", label: "Sauvegarde de justice" },
  { id: "aide_juridictionnelle", label: "Aide juridictionnelle" },
  { id: "mvs", label: "MVS – Mesure de Protection Sociale" },
];
function renderDroitsDivers(d) {
  const checked = DROITS_DIVERS_LIST.filter((x) => d.droits?.[x.id]);
  if (!checked.length) return [];
  return [subTitle("Autres droits et mesures"), ...checked.map((x) => bullet(x.label))];
}

function renderTexteSimple(d) {
  return compact([textPara(d.texte)]);
}

function renderPluripro(d) {
  return compact([kv("Titre", d.titre), textPara(d.detail)]);
}

function renderObjectifs(d) {
  const result = [];
  (d.objectifs || []).forEach((obj, idx) => {
    const hasTitre = obj.titre?.trim();
    const hasMoyens = (obj.moyens || []).some((m) => m.contenu?.trim());
    if (!hasTitre && !hasMoyens) return;
    result.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Objectif ${idx + 1} : `, bold: true }),
          new TextRun({ text: obj.titre || "(sans titre)" }),
        ],
        spacing: { before: 120, after: 60 },
      })
    );
    const moyens = (obj.moyens || []).filter((m) => m.contenu?.trim());
    if (moyens.length > 0) {
      result.push(subTitle("Moyens à mettre en œuvre"));
      moyens.forEach((m, mi) =>
        result.push(new Paragraph({ text: `  ${mi + 1}. ${m.contenu}`, spacing: { before: 40, after: 40 } }))
      );
    }
  });
  return result;
}

function renderReseau(d, objectifsData) {
  const result = [];
  (objectifsData || []).forEach((obj, idx) => {
    const partenaire = d.partenaires?.[obj.id];
    if (!partenaire?.trim()) return;
    result.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Objectif ${idx + 1} (${obj.titre || "sans titre"}) : `, bold: true }),
          new TextRun({ text: partenaire }),
        ],
        spacing: { before: 80, after: 80 },
      })
    );
  });
  return result;
}

function renderEvalObjectifs(d, objectifsData) {
  const LAB = { atteint: "Atteint ✓", en_cours: "En cours →", non_atteint: "Non atteint ✗" };
  const result = [];
  (objectifsData || []).forEach((obj, idx) => {
    const ev = d.evaluations?.[obj.id];
    if (!ev?.statut && !ev?.evolution?.trim()) return;
    result.push(
      new Paragraph({
        children: [new TextRun({ text: `Objectif ${idx + 1} : `, bold: true }), new TextRun({ text: obj.titre || "sans titre" })],
        spacing: { before: 120, after: 60 },
      })
    );
    if (ev?.statut) result.push(kv("Statut", LAB[ev.statut] || ev.statut));
    if (ev?.evolution?.trim()) result.push(kv("Évolution souhaitée", ev.evolution));
  });
  return compact(result);
}

function renderEvalStage(d) {
  const result = [];
  (d.stages || []).forEach((s, idx) => {
    if (!s.structure?.trim() && !s.commentaire?.trim() && !s.evolution?.trim()) return;
    result.push(subTitle(`Stage / Accueil temporaire ${idx + 1}`));
    result.push(...compact([
      kv("Structure", s.structure),
      kv("Date de début", s.dateDebut),
      kv("Date de fin", s.dateFin),
      s.commentaire?.trim() ? kv("Commentaire", s.commentaire) : null,
      s.evolution?.trim() ? kv("Évolution / Perspectives", s.evolution) : null,
    ]));
  });
  return result;
}

function renderAutresEvaluations(d) {
  const result = [];
  (d.evaluations || []).forEach((e, idx) => {
    if (!e.type?.trim() && !e.observations?.trim()) return;
    result.push(subTitle(`Évaluation / Bilan ${idx + 1}`));
    result.push(...compact([
      kv("Type", e.type),
      kv("Date", e.date),
      kv("Intervenant(s)", e.intervenant),
      e.observations?.trim() ? kv("Résultats et observations", e.observations) : null,
    ]));
  });
  return result;
}

function renderHvAlimentation(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  const LAB_TEXTURE = {
    normal: "Normal", hache: "Haché", mixe_lisse: "Mixé lisse",
    mousse: "Mixé mousse", autre: "Autre",
  };
  const result = [];
  result.push(...compact([
    d.petitDejCompo?.trim() ? kv("Petit déjeuner", d.petitDejCompo) : null,
    d.gouterCompo?.trim() ? kv("Goûter", d.gouterCompo) : null,
    d.collationNuit?.trim() ? kv("Collation de nuit", d.collationNuit) : null,
    d.complementsAlimentaires ? kv("Compléments alimentaires", YESNO[d.complementsAlimentaires]) : null,
    d.alimentsNonAimes?.trim() ? kv("Aliments non aimés", d.alimentsNonAimes) : null,
    d.texture ? kv("Texture des repas", LAB_TEXTURE[d.texture] || d.texture) : null,
    d.allergies?.trim() ? kv("Allergies / Intolérances", d.allergies) : null,
    d.choixPersonnels?.trim() ? kv("Choix personnels alimentaires", d.choixPersonnels) : null,
    d.troubleAppetit ? kv("Trouble de l'appétit", YESNO[d.troubleAppetit]) : null,
    d.troubleDeglutition ? kv("Trouble de la déglutition", YESNO[d.troubleDeglutition]) : null,
    d.remarques?.trim() ? kv("Remarques", d.remarques) : null,
  ]));
  return result;
}

function renderHvSommeil(d) {
  const result = compact([
    d.heureLever ? kv("Heure de lever", d.heureLever) : null,
    d.heureCoucher ? kv("Heure de coucher", d.heureCoucher) : null,
    d.sieste ? kv("Sieste", d.sieste === "oui" ? "Oui" : "Non") : null,
    d.sieste === "oui" && d.siesteDuree ? kv("Durée sieste", d.siesteDuree) : null,
    d.positionCouche ? kv("Position de couchage", d.positionCouche) : null,
    d.rituel?.trim() ? kv("Rituel de coucher", d.rituel) : null,
    d.remarques?.trim() ? kv("Remarques", d.remarques) : null,
  ]);
  return result;
}

function renderHvHygiene(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  return compact([
    d.toiletteAutonomie ? kv("Toilette", d.toiletteAutonomie) : null,
    d.habillageAutonomie ? kv("Habillage", d.habillageAutonomie) : null,
    d.deshabillageAutonomie ? kv("Déshabillage", d.deshabillageAutonomie) : null,
    d.auditionTroubles ? kv("Troubles de l'audition", YESNO[d.auditionTroubles]) : null,
    d.visionTroubles ? kv("Troubles de la vision", YESNO[d.visionTroubles]) : null,
    d.visionPrecision?.trim() ? kv("Précision vision", d.visionPrecision) : null,
    d.protheseDentaire ? kv("Prothèses dentaires", YESNO[d.protheseDentaire]) : null,
    d.remarques?.trim() ? kv("Remarques", d.remarques) : null,
  ]);
}

function renderHvElimination(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  return compact([
    d.toilettesAutonomie ? kv("Aller aux toilettes", d.toilettesAutonomie) : null,
    d.incontinenceUrinaire ? kv("Incontinence urinaire", YESNO[d.incontinenceUrinaire]) : null,
    d.incontinenceFecale ? kv("Incontinence fécale", YESNO[d.incontinenceFecale]) : null,
    d.fuitesUrinaires ? kv("Fuites urinaires", YESNO[d.fuitesUrinaires]) : null,
    d.protectionJour ? kv("Protection de jour", YESNO[d.protectionJour]) : null,
    d.protectionJour === "oui" && d.protectionJourType ? kv("Type protection jour", d.protectionJourType) : null,
    d.protectionNuit ? kv("Protection de nuit", YESNO[d.protectionNuit]) : null,
    d.remarques?.trim() ? kv("Remarques", d.remarques) : null,
  ]);
}

function renderHvCommunication(d) {
  return compact([
    d.langue?.trim() ? kv("Langue de référence", d.langue) : null,
    d.communication ? kv("Mode de communication", d.communication) : null,
    d.surnom?.trim() ? kv("Surnom / prénom usuel", d.surnom) : null,
    d.sexprimVerbalement ? kv("S'exprime verbalement", d.sexprimVerbalement === "oui" ? "Oui" : "Non") : null,
    d.saitLire ? kv("Sait lire", d.saitLire === "oui" ? "Oui" : "Non") : null,
    d.saitEcrire ? kv("Sait écrire", d.saitEcrire === "oui" ? "Oui" : "Non") : null,
    d.commentCommunique?.trim() ? kv("Mode de communication habituel", d.commentCommunique) : null,
    d.demandeAttention?.trim() ? kv("Demande d'attention / aide", d.demandeAttention) : null,
    d.exprimeRefus?.trim() ? kv("Expression du refus", d.exprimeRefus) : null,
    d.remarques?.trim() ? kv("Remarques", d.remarques) : null,
  ]);
}

function renderHvMobilite(d) {
  const aides = [
    ["canneSimple", "Canne simple"], ["deuxCannesSimples", "Deux cannes simples"],
    ["canneAnglaise", "Canne anglaise"], ["deuxCannesAnglaises", "Deux cannes anglaises"],
    ["deambulateur", "Déambulateur"], ["canneTripode", "Canne tripode"],
    ["fauteuilRoulant", "Fauteuil roulant"], ["fauteuilElectrique", "Fauteuil électrique"],
  ].filter(([f]) => d[f]).map(([, lbl]) => lbl);

  const result = compact([
    d.lateralite ? kv("Latéralité", d.lateralite === "droitier" ? "Droitier" : "Gaucher") : null,
    d.deplacement ? kv("Autonomie de déplacement", d.deplacement) : null,
    aides.length > 0 ? kv("Aides techniques", aides.join(", ")) : null,
    d.deplacementAutres?.trim() ? kv("Autres aides techniques", d.deplacementAutres) : null,
    d.chutes ? kv("A fait des chutes", d.chutes === "oui" ? "Oui" : "Non") : null,
    d.chutes === "oui" && d.nombreChutes6Mois ? kv("Chutes (6 mois)", d.nombreChutes6Mois) : null,
    d.remarques?.trim() ? kv("Observations", d.remarques) : null,
  ]);
  return result;
}

function renderHvSociale(d) {
  return compact([
    d.activite ? kv("Activités sociales et culturelles", d.activite === "oui" ? "Oui" : "Non") : null,
    d.observations?.trim() ? kv("Observations", d.observations) : null,
  ]);
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

function renderModuleContent(moduleId, data, objectifsData) {
  if (moduleId === "identite__etat_civil") return renderEtatCivil(data);
  if (moduleId === "identite__situation_familiale") return renderSituationFamiliale(data);
  if (moduleId === "identite__scolarite") return renderScolarite(data);
  if (moduleId === "identite__situation_pro") return renderSituationPro(data);
  if (moduleId === "identite__droits_mdph") return renderDroitsMDPH(data);
  if (moduleId === "identite__droits_logement") return renderDroitsLogement(data);
  if (moduleId === "identite__droits_emploi") return renderDroitsEmploi(data);
  if (moduleId === "identite__droits_divers") return renderDroitsDivers(data);
  if (moduleId.startsWith("recueil_attentes__")) return renderTexteSimple(data);
  if (moduleId.includes("analyse_equipe__")) return renderPluripro(data);
  if (moduleId === "objectifs") return renderObjectifs(data);
  if (moduleId === "reseau") return renderReseau(data, objectifsData);
  if (moduleId.includes("eval_objectifs_pp")) return renderEvalObjectifs(data, objectifsData);
  if (moduleId.includes("eval_stage")) return renderEvalStage(data);
  if (moduleId.includes("autres_evaluations")) return renderAutresEvaluations(data);
  if (moduleId.includes("hv_alimentation")) return renderHvAlimentation(data);
  if (moduleId.includes("hv_sommeil")) return renderHvSommeil(data);
  if (moduleId.includes("hv_hygiene")) return renderHvHygiene(data);
  if (moduleId.includes("hv_elimination")) return renderHvElimination(data);
  if (moduleId.includes("hv_communication")) return renderHvCommunication(data);
  if (moduleId.includes("hv_mobilite")) return renderHvMobilite(data);
  if (moduleId.includes("hv_sociale")) return renderHvSociale(data);
  return [];
}

// ─── Export principal ─────────────────────────────────────────────────────────

export async function exporterWord(nomProjet, composition, formsData, objectifsData) {
  const groupedModules = {};
  for (const module of composition) {
    const g = module.groupe;
    if (!groupedModules[g]) groupedModules[g] = [];
    groupedModules[g].push(module);
  }

  const children = [];

  // Titre du document
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Projet Personnalisé${nomProjet ? ` — ${nomProjet}` : ""}`,
          bold: true,
          size: 48,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `Généré le ${dateStr}`, italics: true, color: "888888" })],
      spacing: { after: 400 },
    })
  );

  // Pour chaque groupe
  for (let groupeId = 1; groupeId <= 5; groupeId++) {
    const modules = groupedModules[groupeId] || [];
    if (modules.length === 0) continue;

    // Filtrer les modules avec contenu
    const modulesAvecContenu = modules.filter((m) => {
      if (m.id.startsWith("texte_libre__")) return m.texte?.trim();
      return hasContent(m.id, formsData[m.id]);
    });

    if (modulesAvecContenu.length === 0) continue;

    children.push(h1(GROUPES_LABELS[groupeId]));

    for (const module of modulesAvecContenu) {
      if (module.id.startsWith("texte_libre__")) {
        children.push(h2("Note libre"));
        const t = textPara(module.texte);
        if (t) children.push(t);
        continue;
      }

      children.push(h2(module.label));
      const moduleData = formsData[module.id];
      if (!moduleData) continue;

      const content = renderModuleContent(module.id, moduleData, objectifsData);
      if (content.length === 0) {
        children.push(new Paragraph({ text: "(Aucun contenu renseigné)", spacing: { before: 60 } }));
      } else {
        children.push(...content);
      }
    }
  }

  if (children.length <= 2) {
    children.push(
      new Paragraph({ text: "Aucun contenu renseigné dans ce projet.", spacing: { before: 200 } })
    );
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  const filename = nomProjet
    ? `PP_${nomProjet.replace(/[^a-z0-9À-ÿ]/gi, "_")}.docx`
    : "ProjetPersonnalise.docx";
  saveAs(blob, filename);
}
