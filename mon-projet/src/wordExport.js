import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType,
} from "docx";
import { saveAs } from "file-saver";

// ─── Palette de couleurs vert/bleu ────────────────────────────────────────────
const C = {
  vertFonce:    "1B6B5A",  // titres H1
  vertMoyen:    "2E8B70",  // titres H2
  vertClair:    "A8D8C8",  // fond en-tête tableau objectif
  vertPasClair: "D4F0E6",  // fond ligne titre objectif
  bleuVert:     "4A9E9E",  // fond en-tête tableau section
  bleuVertClair:"C8EAE8",  // fond alternance ligne tableau section
  fondLeger:    "F0FAF7",  // fond cellule valeur
  gris:         "718096",  // texte secondaire
  blanc:        "FFFFFF",
};

const GROUPES_LABELS = {
  1: "Identité et éléments du parcours",
  2: "Analyse des attentes et besoins",
  3: "Projet",
  4: "Vie quotidienne",
  5: "Bilans et évaluations",
};

// ─── Vérification du contenu ──────────────────────────────────────────────────

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

// ─── Bordures de tableau ──────────────────────────────────────────────────────

function noBorder() {
  const side = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: side, bottom: side, left: side, right: side, insideH: side, insideV: side };
}

function thinBorder(color = "CCCCCC") {
  const side = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: side, bottom: side, left: side, right: side, insideH: side, insideV: side };
}

// ─── Helpers paragraphes ──────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 32, color: C.vertFonce, font: "Calibri" })],
    spacing: { before: 500, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.vertFonce } },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, color: C.vertMoyen, font: "Calibri" })],
    spacing: { before: 300, after: 120 },
  });
}

function compact(arr) {
  return arr.flat().filter(Boolean);
}

function textPara(text, opts = {}) {
  if (!text?.trim()) return null;
  return new Paragraph({
    children: [new TextRun({ text: text.trim(), size: opts.size || 22, color: opts.color || "222222", font: "Calibri" })],
    spacing: { before: 60, after: 60 },
  });
}

// ─── Tableau clé/valeur générique ────────────────────────────────────────────
// Prend un tableau de {label, value} et renvoie un Table docx stylisé.

function kvTable(rows) {
  const validRows = rows.filter((r) => {
    if (!r) return false;
    const v = r.value;
    if (v === null || v === undefined || v === "" || v === false) return false;
    return String(v).trim() !== "";
  });
  if (validRows.length === 0) return null;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder("B8D8D0"),
    rows: validRows.map((r, i) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            shading: { fill: i % 2 === 0 ? C.bleuVertClair : C.fondLeger, type: ShadingType.CLEAR, color: "auto" },
            borders: thinBorder("B8D8D0"),
            children: [
              new Paragraph({
                children: [new TextRun({ text: r.label, bold: true, size: 20, font: "Calibri", color: C.vertFonce })],
                spacing: { before: 60, after: 60 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 68, type: WidthType.PERCENTAGE },
            shading: { fill: C.blanc, type: ShadingType.CLEAR, color: "auto" },
            borders: thinBorder("B8D8D0"),
            children: [
              new Paragraph({
                children: [new TextRun({ text: String(r.value).trim(), size: 20, font: "Calibri" })],
                spacing: { before: 60, after: 60 },
              }),
            ],
          }),
        ],
      })
    ),
  });
}

// ─── Tableau liste (sous-titre + puces) ──────────────────────────────────────

function listTable(title, items) {
  if (!items || items.length === 0) return null;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder("B8D8D0"),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 1,
            shading: { fill: C.bleuVert, type: ShadingType.CLEAR, color: "auto" },
            borders: thinBorder("B8D8D0"),
            children: [
              new Paragraph({
                children: [new TextRun({ text: title, bold: true, size: 20, color: C.blanc, font: "Calibri" })],
                spacing: { before: 60, after: 60 },
              }),
            ],
          }),
        ],
      }),
      ...items.map((item) =>
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: C.fondLeger, type: ShadingType.CLEAR, color: "auto" },
              borders: thinBorder("B8D8D0"),
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `• ${item}`, size: 20, font: "Calibri" })],
                  spacing: { before: 40, after: 40 },
                }),
              ],
            }),
          ],
        })
      ),
    ],
  });
}

// ─── Pondération : barre textuelle ───────────────────────────────────────────

function getCurseurLabel(val) {
  if (val < 20) return { texte: "Fortement centré sur les attentes de la personne", couleur: "2B6CB0" };
  if (val < 40) return { texte: "Plutôt centré sur les attentes de la personne", couleur: "3182CE" };
  if (val > 80) return { texte: "Fortement centré sur les besoins identifiés par l'équipe", couleur: "276749" };
  if (val > 60) return { texte: "Plutôt centré sur les besoins identifiés par l'équipe", couleur: "2F855A" };
  return { texte: "Équilibre attentes / besoins équipe", couleur: "718096" };
}

// Renvoie une ligne de tableau représentant la pondération
function ponderationRow(curseur) {
  const val = curseur ?? 50;
  const info = getCurseurLabel(val);
  const attentes = Math.round(100 - val);
  const besoins = Math.round(val);
  // barre ASCII proportionnelle sur 20 chars
  const filled = Math.round(val / 5);
  const empty = 20 - filled;
  const barre = "█".repeat(filled) + "░".repeat(empty);

  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        shading: { fill: "F7FDFA", type: ShadingType.CLEAR, color: "auto" },
        borders: thinBorder("B8D8D0"),
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Pondération  ", bold: true, size: 18, font: "Calibri", color: C.vertFonce }),
              new TextRun({ text: `Attentes (${attentes}%)  `, size: 18, font: "Courier New", color: "3182CE" }),
              new TextRun({ text: barre, size: 16, font: "Courier New", color: info.couleur }),
              new TextRun({ text: `  Besoins (${besoins}%)`, size: 18, font: "Courier New", color: "2F855A" }),
            ],
            spacing: { before: 60, after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: info.texte, italics: true, size: 18, font: "Calibri", color: info.couleur })],
            spacing: { before: 20, after: 60 },
          }),
        ],
      }),
    ],
  });
}

// ─── Tableau objectif ─────────────────────────────────────────────────────────

function objectifTable(obj, idx) {
  const hasTitre = obj.titre?.trim();
  const moyens = (obj.moyens || []).filter((m) => m.contenu?.trim());
  if (!hasTitre && moyens.length === 0) return null;

  const rows = [];

  // En-tête : numéro + titre
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          shading: { fill: C.vertClair, type: ShadingType.CLEAR, color: "auto" },
          borders: thinBorder("2E8B70"),
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `Objectif ${idx + 1}  `, bold: true, size: 28, font: "Calibri", color: C.vertFonce }),
                new TextRun({ text: obj.titre || "(sans titre)", size: 26, font: "Calibri", color: "1A1A1A" }),
              ],
              spacing: { before: 100, after: 100 },
            }),
          ],
        }),
      ],
    })
  );

  // Ligne pondération
  rows.push(ponderationRow(obj.curseur));

  // Moyens
  if (moyens.length > 0) {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            shading: { fill: C.bleuVert, type: ShadingType.CLEAR, color: "auto" },
            borders: thinBorder("2E8B70"),
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Moyens à mettre en œuvre", bold: true, size: 20, font: "Calibri", color: C.blanc })],
                spacing: { before: 60, after: 60 },
              }),
            ],
          }),
        ],
      })
    );
    moyens.forEach((m, mi) => {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: C.fondLeger, type: ShadingType.CLEAR, color: "auto" },
              borders: thinBorder("B8D8D0"),
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `${mi + 1}.`, bold: true, size: 20, font: "Calibri", color: C.vertMoyen })],
                  spacing: { before: 50, after: 50 },
                }),
              ],
            }),
            new TableCell({
              width: { size: 92, type: WidthType.PERCENTAGE },
              shading: { fill: C.blanc, type: ShadingType.CLEAR, color: "auto" },
              borders: thinBorder("B8D8D0"),
              children: [
                new Paragraph({
                  children: [new TextRun({ text: m.contenu, size: 20, font: "Calibri" })],
                  spacing: { before: 50, after: 50 },
                }),
              ],
            }),
          ],
        })
      );
    });
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder("2E8B70"),
    rows,
  });
}

// ─── Spacer entre éléments ────────────────────────────────────────────────────
function spacer(size = 120) {
  return new Paragraph({ text: "", spacing: { before: size, after: 0 } });
}

// ─── Renderers ───────────────────────────────────────────────────────────────

function renderEtatCivil(d) {
  return compact([
    kvTable([
      { label: "Nom", value: d.nom },
      { label: "Prénom", value: d.prenom },
      { label: "Date de naissance", value: d.dateNaissance },
      d.age ? { label: "Âge", value: `${d.age} ans` } : null,
    ]),
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
    kvTable([
      { label: "Situation maritale", value: LAB_MAR[d.situationMaritale] || d.situationMaritale },
      { label: "Nombre d'enfants", value: d.nbEnfants },
      { label: "Enfants à charge", value: LAB_CHARGE[d.enfantsACharge] || d.enfantsACharge },
      { label: "Mode de vie", value: LAB_MODE[d.modeVie] || d.modeVie },
      d.aidantProche ? { label: "Aidant proche", value: "Oui" } : null,
    ]),
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
    kvTable([
      { label: "Niveau de formation", value: LAB[d.niveau] || d.niveau },
      { label: "Dernier diplôme / titre obtenu", value: d.diplome },
      { label: "Formation en cours", value: d.formationCours },
      { label: "Établissement fréquenté", value: d.etablissement },
    ]),
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
    kvTable([
      { label: "Statut professionnel", value: LAB_STATUT[d.statut] || d.statut },
      { label: "Type de contrat", value: LAB_CONTRAT[d.typeContrat] || d.typeContrat },
      { label: "Employeur / Structure", value: d.employeur },
      d.heuresHebdo ? { label: "Durée hebdomadaire", value: `${d.heuresHebdo}h` } : null,
    ]),
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
  const t1 = listTable("Droits MDPH", checked.map((x) => x.label));
  if (t1) result.push(t1, spacer(80));
  const orient = ORIENTATIONS_ESMS_LIST.filter((x) => d.orientations?.[x.id]);
  const t2 = listTable("Orientations ESMS", orient.map((x) => x.label));
  if (t2) result.push(t2);
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
    kvTable([
      { label: "Type de logement", value: LAB_LOG[d.typeLogement] || d.typeLogement },
      { label: "Statut d'occupation", value: LAB_STATUT[d.statut] || d.statut },
    ]),
  ]);
  const aides = AIDES_LOGEMENT_LIST.filter((x) => d.aides?.[x.id]);
  const t = listTable("Aides au logement", aides.map((x) => x.label));
  if (t) result.push(spacer(80), t);
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
  const t = listTable("Droits et dispositifs emploi", checked.map((x) => x.label));
  return t ? [t] : [];
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
  const t = listTable("Autres droits et mesures", checked.map((x) => x.label));
  return t ? [t] : [];
}

function renderTexteSimple(d) {
  return compact([textPara(d.texte)]);
}

function renderPluripro(d) {
  return compact([
    kvTable([
      { label: "Titre", value: d.titre },
      { label: "Détail", value: d.detail },
    ]),
  ]);
}

function renderObjectifs(d) {
  const result = [];
  (d.objectifs || []).forEach((obj, idx) => {
    const t = objectifTable(obj, idx);
    if (t) {
      result.push(t);
      result.push(spacer(120));
    }
  });
  return result;
}

function renderReseau(d, objectifsData) {
  const rows = (objectifsData || [])
    .map((obj, idx) => {
      const partenaire = d.partenaires?.[obj.id];
      if (!partenaire?.trim()) return null;
      return { label: `Objectif ${idx + 1} – ${obj.titre || "sans titre"}`, value: partenaire };
    })
    .filter(Boolean);
  const t = kvTable(rows);
  return t ? [t] : [];
}

function renderEvalObjectifs(d, objectifsData) {
  const LAB = { atteint: "Atteint ✓", en_cours: "En cours →", non_atteint: "Non atteint ✗" };
  const result = [];
  (objectifsData || []).forEach((obj, idx) => {
    const ev = d.evaluations?.[obj.id];
    if (!ev?.statut && !ev?.evolution?.trim()) return;
    const t = kvTable([
      { label: "Objectif", value: `${idx + 1} – ${obj.titre || "sans titre"}` },
      ev?.statut ? { label: "Statut", value: LAB[ev.statut] || ev.statut } : null,
      ev?.evolution?.trim() ? { label: "Évolution souhaitée", value: ev.evolution } : null,
    ]);
    if (t) { result.push(t); result.push(spacer(80)); }
  });
  return result;
}

function renderEvalStage(d) {
  const result = [];
  (d.stages || []).forEach((s, idx) => {
    if (!s.structure?.trim() && !s.commentaire?.trim() && !s.evolution?.trim()) return;
    const t = kvTable([
      { label: "Stage / Accueil", value: `N°${idx + 1}` },
      { label: "Structure", value: s.structure },
      { label: "Date de début", value: s.dateDebut },
      { label: "Date de fin", value: s.dateFin },
      s.commentaire?.trim() ? { label: "Commentaire", value: s.commentaire } : null,
      s.evolution?.trim() ? { label: "Évolution / Perspectives", value: s.evolution } : null,
    ]);
    if (t) { result.push(t); result.push(spacer(80)); }
  });
  return result;
}

function renderAutresEvaluations(d) {
  const result = [];
  (d.evaluations || []).forEach((e, idx) => {
    if (!e.type?.trim() && !e.observations?.trim()) return;
    const t = kvTable([
      { label: "Évaluation / Bilan", value: `N°${idx + 1}` },
      { label: "Type", value: e.type },
      { label: "Date", value: e.date },
      { label: "Intervenant(s)", value: e.intervenant },
      e.observations?.trim() ? { label: "Résultats et observations", value: e.observations } : null,
    ]);
    if (t) { result.push(t); result.push(spacer(80)); }
  });
  return result;
}

function renderHvAlimentation(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  const LAB_TEXTURE = {
    normal: "Normal", hache: "Haché", mixe_lisse: "Mixé lisse",
    mousse: "Mixé mousse", autre: "Autre",
  };
  return compact([
    kvTable([
      d.petitDejCompo?.trim() ? { label: "Petit déjeuner", value: d.petitDejCompo } : null,
      d.gouterCompo?.trim() ? { label: "Goûter", value: d.gouterCompo } : null,
      d.collationNuit?.trim() ? { label: "Collation de nuit", value: d.collationNuit } : null,
      d.complementsAlimentaires ? { label: "Compléments alimentaires", value: YESNO[d.complementsAlimentaires] } : null,
      d.alimentsNonAimes?.trim() ? { label: "Aliments non aimés", value: d.alimentsNonAimes } : null,
      d.texture ? { label: "Texture des repas", value: LAB_TEXTURE[d.texture] || d.texture } : null,
      d.allergies?.trim() ? { label: "Allergies / Intolérances", value: d.allergies } : null,
      d.choixPersonnels?.trim() ? { label: "Choix personnels alimentaires", value: d.choixPersonnels } : null,
      d.troubleAppetit ? { label: "Trouble de l'appétit", value: YESNO[d.troubleAppetit] } : null,
      d.troubleDeglutition ? { label: "Trouble de la déglutition", value: YESNO[d.troubleDeglutition] } : null,
      d.remarques?.trim() ? { label: "Remarques", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvSommeil(d) {
  return compact([
    kvTable([
      d.heureLever ? { label: "Heure de lever", value: d.heureLever } : null,
      d.heureCoucher ? { label: "Heure de coucher", value: d.heureCoucher } : null,
      d.sieste ? { label: "Sieste", value: d.sieste === "oui" ? "Oui" : "Non" } : null,
      d.sieste === "oui" && d.siesteDuree ? { label: "Durée sieste", value: d.siesteDuree } : null,
      d.positionCouche ? { label: "Position de couchage", value: d.positionCouche } : null,
      d.rituel?.trim() ? { label: "Rituel de coucher", value: d.rituel } : null,
      d.remarques?.trim() ? { label: "Remarques", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvHygiene(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  return compact([
    kvTable([
      d.toiletteAutonomie ? { label: "Toilette", value: d.toiletteAutonomie } : null,
      d.habillageAutonomie ? { label: "Habillage", value: d.habillageAutonomie } : null,
      d.deshabillageAutonomie ? { label: "Déshabillage", value: d.deshabillageAutonomie } : null,
      d.auditionTroubles ? { label: "Troubles de l'audition", value: YESNO[d.auditionTroubles] } : null,
      d.visionTroubles ? { label: "Troubles de la vision", value: YESNO[d.visionTroubles] } : null,
      d.visionPrecision?.trim() ? { label: "Précision vision", value: d.visionPrecision } : null,
      d.protheseDentaire ? { label: "Prothèses dentaires", value: YESNO[d.protheseDentaire] } : null,
      d.remarques?.trim() ? { label: "Remarques", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvElimination(d) {
  const YESNO = { oui: "Oui", non: "Non" };
  return compact([
    kvTable([
      d.toilettesAutonomie ? { label: "Aller aux toilettes", value: d.toilettesAutonomie } : null,
      d.incontinenceUrinaire ? { label: "Incontinence urinaire", value: YESNO[d.incontinenceUrinaire] } : null,
      d.incontinenceFecale ? { label: "Incontinence fécale", value: YESNO[d.incontinenceFecale] } : null,
      d.fuitesUrinaires ? { label: "Fuites urinaires", value: YESNO[d.fuitesUrinaires] } : null,
      d.protectionJour ? { label: "Protection de jour", value: YESNO[d.protectionJour] } : null,
      d.protectionJour === "oui" && d.protectionJourType ? { label: "Type protection jour", value: d.protectionJourType } : null,
      d.protectionNuit ? { label: "Protection de nuit", value: YESNO[d.protectionNuit] } : null,
      d.remarques?.trim() ? { label: "Remarques", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvCommunication(d) {
  return compact([
    kvTable([
      d.langue?.trim() ? { label: "Langue de référence", value: d.langue } : null,
      d.communication ? { label: "Mode de communication", value: d.communication } : null,
      d.surnom?.trim() ? { label: "Surnom / prénom usuel", value: d.surnom } : null,
      d.sexprimVerbalement ? { label: "S'exprime verbalement", value: d.sexprimVerbalement === "oui" ? "Oui" : "Non" } : null,
      d.saitLire ? { label: "Sait lire", value: d.saitLire === "oui" ? "Oui" : "Non" } : null,
      d.saitEcrire ? { label: "Sait écrire", value: d.saitEcrire === "oui" ? "Oui" : "Non" } : null,
      d.commentCommunique?.trim() ? { label: "Mode de communication habituel", value: d.commentCommunique } : null,
      d.demandeAttention?.trim() ? { label: "Demande d'attention / aide", value: d.demandeAttention } : null,
      d.exprimeRefus?.trim() ? { label: "Expression du refus", value: d.exprimeRefus } : null,
      d.remarques?.trim() ? { label: "Remarques", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvMobilite(d) {
  const aides = [
    ["canneSimple", "Canne simple"], ["deuxCannesSimples", "Deux cannes simples"],
    ["canneAnglaise", "Canne anglaise"], ["deuxCannesAnglaises", "Deux cannes anglaises"],
    ["deambulateur", "Déambulateur"], ["canneTripode", "Canne tripode"],
    ["fauteuilRoulant", "Fauteuil roulant"], ["fauteuilElectrique", "Fauteuil électrique"],
  ].filter(([f]) => d[f]).map(([, lbl]) => lbl);

  return compact([
    kvTable([
      d.lateralite ? { label: "Latéralité", value: d.lateralite === "droitier" ? "Droitier" : "Gaucher" } : null,
      d.deplacement ? { label: "Autonomie de déplacement", value: d.deplacement } : null,
      aides.length > 0 ? { label: "Aides techniques", value: aides.join(", ") } : null,
      d.deplacementAutres?.trim() ? { label: "Autres aides techniques", value: d.deplacementAutres } : null,
      d.chutes ? { label: "A fait des chutes", value: d.chutes === "oui" ? "Oui" : "Non" } : null,
      d.chutes === "oui" && d.nombreChutes6Mois ? { label: "Chutes (6 mois)", value: d.nombreChutes6Mois } : null,
      d.remarques?.trim() ? { label: "Observations", value: d.remarques } : null,
    ]),
  ]);
}

function renderHvSociale(d) {
  return compact([
    kvTable([
      d.activite ? { label: "Activités sociales et culturelles", value: d.activite === "oui" ? "Oui" : "Non" } : null,
      d.observations?.trim() ? { label: "Observations", value: d.observations } : null,
    ]),
  ]);
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

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
          size: 52,
          color: C.vertFonce,
          font: "Calibri",
        }),
      ],
      spacing: { after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.vertClair } },
    })
  );

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `Généré le ${dateStr}`, italics: true, size: 20, color: C.gris, font: "Calibri" })],
      spacing: { after: 400 },
    })
  );

  // Pour chaque groupe
  for (let groupeId = 1; groupeId <= 5; groupeId++) {
    const modules = groupedModules[groupeId] || [];
    if (modules.length === 0) continue;

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
      children.push(spacer(80));
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
