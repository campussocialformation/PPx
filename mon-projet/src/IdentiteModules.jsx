import { useState, useContext, useEffect, createContext } from "react";

// ─── Contexte partagé PP ────────────────────────────────────────────────────
export const PPContext = createContext({
  objectifsData: [],
  setObjectifsData: () => {},
});

// ─── État Civil ────────────────────────────────────────────────────────────────
export function EtatCivilForm() {
  const [data, setData] = useState({ nom: "", prenom: "", dateNaissance: "", age: "" });
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Nom</label>
        <input
          type="text"
          value={data.nom}
          onChange={(e) => update("nom", e.target.value)}
          placeholder="Nom de famille"
        />
      </div>
      <div className="form-group">
        <label>Prénom</label>
        <input
          type="text"
          value={data.prenom}
          onChange={(e) => update("prenom", e.target.value)}
          placeholder="Prénom"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            value={data.dateNaissance}
            onChange={(e) => update("dateNaissance", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Âge</label>
          <input
            type="number"
            value={data.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="ans"
            min="0"
            max="120"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Situation Familiale ───────────────────────────────────────────────────────
export function SituationFamilialeForm() {
  const [data, setData] = useState({
    situationMaritale: "",
    nbEnfants: "",
    enfantsACharge: "",
    modeVie: "",
    aidantProche: false,
  });
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Situation maritale</label>
        <select
          value={data.situationMaritale}
          onChange={(e) => update("situationMaritale", e.target.value)}
        >
          <option value="">— Choisir —</option>
          <option value="celibataire">Célibataire</option>
          <option value="marie">Marié(e)</option>
          <option value="pacse">Pacsé(e)</option>
          <option value="divorce">Divorcé(e) / Séparé(e)</option>
          <option value="veuf">Veuf / Veuve</option>
          <option value="concubinage">Concubinage / Union libre</option>
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre d'enfants</label>
          <input
            type="number"
            value={data.nbEnfants}
            onChange={(e) => update("nbEnfants", e.target.value)}
            min="0"
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label>Enfants à charge</label>
          <select
            value={data.enfantsACharge}
            onChange={(e) => update("enfantsACharge", e.target.value)}
          >
            <option value="">— Choisir —</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
            <option value="partiel">Partiellement</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Mode de vie / Avec qui vit la personne</label>
        <select
          value={data.modeVie}
          onChange={(e) => update("modeVie", e.target.value)}
        >
          <option value="">— Choisir —</option>
          <option value="seul">Seul(e)</option>
          <option value="conjoint">Avec conjoint(e)</option>
          <option value="famille">En famille</option>
          <option value="institution">En institution</option>
          <option value="residence_autonomie">Résidence autonomie</option>
          <option value="hebergement_tiers">Hébergé(e) par un tiers</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <label className="form-check">
        <input
          type="checkbox"
          checked={data.aidantProche}
          onChange={(e) => update("aidantProche", e.target.checked)}
        />
        Présence d'un aidant proche
      </label>
    </div>
  );
}

// ─── Scolarité / Formation / Diplôme ──────────────────────────────────────────
export function ScolariteForm() {
  const [data, setData] = useState({
    niveau: "",
    diplome: "",
    formationCours: "",
    etablissement: "",
  });
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Niveau de formation</label>
        <select value={data.niveau} onChange={(e) => update("niveau", e.target.value)}>
          <option value="">— Choisir —</option>
          <option value="sans_diplome">Sans diplôme</option>
          <option value="cap_bep">CAP / BEP</option>
          <option value="bac">Baccalauréat</option>
          <option value="bac_plus2">Bac +2</option>
          <option value="bac_plus3">Bac +3</option>
          <option value="bac_plus5">Bac +5 et +</option>
          <option value="scolarisation_ordinaire">Scolarisation ordinaire</option>
          <option value="scolarisation_adaptee">Scolarisation adaptée (ULIS, SEGPA…)</option>
          <option value="ime_impro">IME / IMPRO</option>
        </select>
      </div>
      <div className="form-group">
        <label>Dernier diplôme / titre obtenu</label>
        <input
          type="text"
          value={data.diplome}
          onChange={(e) => update("diplome", e.target.value)}
          placeholder="Ex : CAP Cuisine, BTS, Licence…"
        />
      </div>
      <div className="form-group">
        <label>Formation en cours</label>
        <input
          type="text"
          value={data.formationCours}
          onChange={(e) => update("formationCours", e.target.value)}
          placeholder="Intitulé de la formation"
        />
      </div>
      <div className="form-group">
        <label>Établissement fréquenté</label>
        <input
          type="text"
          value={data.etablissement}
          onChange={(e) => update("etablissement", e.target.value)}
          placeholder="Nom de l'établissement"
        />
      </div>
    </div>
  );
}

// ─── Situation Professionnelle ─────────────────────────────────────────────────
export function SituationProForm() {
  const [data, setData] = useState({
    statut: "",
    typeContrat: "",
    employeur: "",
    heuresHebdo: "",
  });
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Statut professionnel</label>
        <select value={data.statut} onChange={(e) => update("statut", e.target.value)}>
          <option value="">— Choisir —</option>
          <option value="emploi_ordinaire">En emploi (milieu ordinaire)</option>
          <option value="esat">ESAT</option>
          <option value="ea">Entreprise Adaptée</option>
          <option value="sans_emploi">Sans emploi</option>
          <option value="formation">En formation</option>
          <option value="retraite">À la retraite</option>
          <option value="invalidite">Invalidité</option>
          <option value="non_concerne">Non concerné</option>
        </select>
      </div>
      <div className="form-group">
        <label>Type de contrat</label>
        <select value={data.typeContrat} onChange={(e) => update("typeContrat", e.target.value)}>
          <option value="">— Choisir —</option>
          <option value="cdi">CDI</option>
          <option value="cdd">CDD</option>
          <option value="interim">Intérim</option>
          <option value="alternance">Alternance</option>
          <option value="stage">Stage</option>
          <option value="na">Non applicable</option>
        </select>
      </div>
      <div className="form-group">
        <label>Employeur / Structure</label>
        <input
          type="text"
          value={data.employeur}
          onChange={(e) => update("employeur", e.target.value)}
          placeholder="Nom de l'employeur ou de la structure"
        />
      </div>
      <div className="form-group">
        <label>Durée hebdomadaire (heures)</label>
        <input
          type="number"
          value={data.heuresHebdo}
          onChange={(e) => update("heuresHebdo", e.target.value)}
          min="0"
          max="48"
          placeholder="Ex : 35"
        />
      </div>
    </div>
  );
}

// ─── Accès aux droits MDPH ────────────────────────────────────────────────────
const DROITS_MDPH = [
  { id: "aah", label: "AAH – Allocation aux Adultes Handicapés" },
  { id: "pch", label: "PCH – Prestation de Compensation du Handicap" },
  { id: "aeeh", label: "AEEH – Allocation d'Éducation de l'Enfant Handicapé" },
  { id: "rqth", label: "RQTH – Reconnaissance Qualité Travailleur Handicapé" },
  { id: "cmi", label: "CMI – Carte Mobilité Inclusion" },
  { id: "mrs", label: "MVS – Majoration pour la Vie Autonome" },
];

const ORIENTATIONS_ESMS = [
  { id: "esat", label: "ESAT – Établissement et Service d'Aide par le Travail" },
  { id: "fam", label: "FAM – Foyer d'Accueil Médicalisé" },
  { id: "mas", label: "MAS – Maison d'Accueil Spécialisée" },
  { id: "samsah", label: "SAMSAH – Service d'Accompagnement Médico-Social" },
  { id: "savs", label: "SAVS – Service d'Accompagnement à la Vie Sociale" },
  { id: "foyer_vie", label: "Foyer de Vie" },
  { id: "foyer_hebergement", label: "Foyer d'Hébergement" },
  { id: "sessad", label: "SESSAD – Service d'Éducation Spéciale et de Soins" },
  { id: "ime", label: "IME – Institut Médico-Éducatif" },
  { id: "itep", label: "ITEP – Institut Thérapeutique, Éducatif et Pédagogique" },
  { id: "camsp", label: "CAMSP – Centre d'Action Médico-Sociale Précoce" },
  { id: "cmpp", label: "CMPP – Centre Médico-Psycho-Pédagogique" },
  { id: "accueil_jour", label: "Accueil de Jour" },
  { id: "internat", label: "Internat" },
];

export function DroitsMDPHForm() {
  const [droits, setDroits] = useState({});
  const [orientations, setOrientations] = useState({});
  const toggleDroit = (id) => setDroits((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleOrientation = (id) => setOrientations((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="identite-form">
      <div className="form-section-title">Droits MDPH</div>
      <div className="checkbox-grid">
        {DROITS_MDPH.map((d) => (
          <label key={d.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={!!droits[d.id]}
              onChange={() => toggleDroit(d.id)}
            />
            {d.label}
          </label>
        ))}
      </div>
      <div className="form-section-title mt">Orientations ESMS</div>
      <div className="checkbox-grid">
        {ORIENTATIONS_ESMS.map((o) => (
          <label key={o.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={!!orientations[o.id]}
              onChange={() => toggleOrientation(o.id)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Accès aux droits logement ─────────────────────────────────────────────────
const AIDES_LOGEMENT = [
  { id: "apl", label: "APL – Aide Personnalisée au Logement" },
  { id: "als", label: "ALS – Allocation de Logement Sociale" },
  { id: "alf", label: "ALF – Allocation de Logement Familiale" },
  { id: "logement_social", label: "Demande logement social en cours" },
  { id: "foyer_residence", label: "Foyer / Résidence spécialisée" },
  { id: "hebergement_urgence", label: "Hébergement d'urgence / CHRS" },
  { id: "fsl", label: "FSL – Fonds de Solidarité pour le Logement" },
];

export function DroitsLogementForm() {
  const [typeLogement, setTypeLogement] = useState("");
  const [statut, setStatut] = useState("");
  const [aides, setAides] = useState({});
  const toggleAide = (id) => setAides((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Type de logement actuel</label>
        <select value={typeLogement} onChange={(e) => setTypeLogement(e.target.value)}>
          <option value="">— Choisir —</option>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
          <option value="chambre">Chambre / Studio</option>
          <option value="foyer">Foyer / Résidence</option>
          <option value="institution">Institution / ESMS</option>
          <option value="sans_abri">Sans domicile fixe</option>
          <option value="hebergement">Hébergé par un tiers</option>
        </select>
      </div>
      <div className="form-group">
        <label>Statut d'occupation</label>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="">— Choisir —</option>
          <option value="proprietaire">Propriétaire</option>
          <option value="locataire">Locataire</option>
          <option value="sous_locataire">Sous-locataire</option>
          <option value="heberge">Hébergé à titre gratuit</option>
          <option value="squat">Occupation sans titre</option>
        </select>
      </div>
      <div className="form-section-title mt">Aides au logement</div>
      <div className="checkbox-grid">
        {AIDES_LOGEMENT.map((d) => (
          <label key={d.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={!!aides[d.id]}
              onChange={() => toggleAide(d.id)}
            />
            {d.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Accès aux droits emploi ───────────────────────────────────────────────────
const DROITS_EMPLOI = [
  { id: "france_travail", label: "Inscrit(e) à France Travail" },
  { id: "are", label: "ARE – Allocation de Retour à l'Emploi" },
  { id: "ass", label: "ASS – Allocation de Solidarité Spécifique" },
  { id: "rsa", label: "RSA – Revenu de Solidarité Active" },
  { id: "boeth", label: "BOETH – Bénéficiaire de l'Obligation d'Emploi" },
  { id: "cap_emploi", label: "Suivi Cap Emploi" },
  { id: "agefiph", label: "Aide AGEFIPH" },
  { id: "csp", label: "CSP – Contrat de Sécurisation Professionnelle" },
  { id: "contrat_aide", label: "Contrat Aidé (CAE, CUI…)" },
];

export function DroitsEmploiForm() {
  const [droits, setDroits] = useState({});
  const toggle = (id) => setDroits((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="identite-form">
      <div className="form-section-title">Droits et dispositifs emploi</div>
      <div className="checkbox-grid">
        {DROITS_EMPLOI.map((d) => (
          <label key={d.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={!!droits[d.id]}
              onChange={() => toggle(d.id)}
            />
            {d.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Accès aux droits divers ───────────────────────────────────────────────────
const DROITS_DIVERS = [
  { id: "css", label: "CSS – Complémentaire Santé Solidaire" },
  { id: "ame", label: "AME – Aide Médicale de l'État" },
  { id: "aspa", label: "ASPA – Allocation de Solidarité aux Personnes Âgées" },
  { id: "asi", label: "ASI – Allocation Supplémentaire d'Invalidité" },
  { id: "tutelle", label: "Mesure de protection – Tutelle" },
  { id: "curatelle", label: "Mesure de protection – Curatelle" },
  { id: "sauvegarde", label: "Sauvegarde de justice" },
  { id: "aide_juridictionnelle", label: "Aide juridictionnelle" },
  { id: "mvs", label: "MVS – Mesure de Protection Sociale" },
];

export function DroitsDiversForm() {
  const [droits, setDroits] = useState({});
  const toggle = (id) => setDroits((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="identite-form">
      <div className="form-section-title">Autres droits et mesures</div>
      <div className="checkbox-grid">
        {DROITS_DIVERS.map((d) => (
          <label key={d.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={!!droits[d.id]}
              onChange={() => toggle(d.id)}
            />
            {d.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Attentes de la personne ────────────────────────────────────────────────
export function AttentesPersonneForm() {
  const [texte, setTexte] = useState("");
  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Attentes exprimées par la personne</label>
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Décrivez les attentes de la personne…"
          rows={5}
        />
      </div>
    </div>
  );
}

// ─── Attentes des proches aidants ───────────────────────────────────────────
export function AttentesProcheAidantsForm() {
  const [texte, setTexte] = useState("");
  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Attentes exprimées par les proches aidants</label>
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Décrivez les attentes des proches aidants…"
          rows={5}
        />
      </div>
    </div>
  );
}

// ─── Attentes du représentant légal ────────────────────────────────────────
export function AttentesRepresentantLegalForm() {
  const [texte, setTexte] = useState("");
  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Attentes exprimées par le représentant légal</label>
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Décrivez les attentes du représentant légal…"
          rows={5}
        />
      </div>
    </div>
  );
}

// ─── Objectifs et moyens à mettre en œuvre ──────────────────────────────────

const SMART_INFO = [
  {
    lettre: "S",
    mot: "Spécifique",
    desc: "L'objectif est précis et sans ambiguïté. Il répond à la question « Quoi ? »",
    exemple: "Exemple : « Reprendre une activité sportive adaptée »",
  },
  {
    lettre: "M",
    mot: "Mesurable",
    desc: "Des indicateurs concrets permettent de savoir si l'objectif est atteint.",
    exemple: "Exemple : « 2 séances par semaine »",
  },
  {
    lettre: "A",
    mot: "Atteignable",
    desc: "L'objectif est ambitieux mais réalisable compte tenu des capacités de la personne.",
    exemple: "Exemple : activité choisie parmi celles accessibles à la personne",
  },
  {
    lettre: "R",
    mot: "Réaliste",
    desc: "L'objectif s'inscrit dans le contexte et les ressources disponibles (humaines, financières, environnementales).",
    exemple: "Exemple : structure proposant une activité adaptée à proximité",
  },
  {
    lettre: "T",
    mot: "Temporel",
    desc: "Un délai ou une échéance est fixé pour atteindre l'objectif.",
    exemple: "Exemple : « d'ici 3 mois » ou « avant la prochaine révision du PPP »",
  },
];

function InfoBubble({ onClose }) {
  return (
    <div className="obj-info-bubble">
      <div className="obj-info-bubble-header">
        <span className="obj-info-bubble-title">Comment formuler un objectif ?</span>
        <button className="obj-info-close" onClick={onClose}>✕</button>
      </div>
      <p className="obj-info-intro">
        Un objectif bien formulé suit la méthode <strong>SMART</strong> :
      </p>
      <div className="obj-smart-grid">
        {SMART_INFO.map(({ lettre, mot, desc, exemple }) => (
          <div key={lettre} className="obj-smart-item">
            <div className="obj-smart-lettre">{lettre}</div>
            <div className="obj-smart-content">
              <div className="obj-smart-mot">{mot}</div>
              <div className="obj-smart-desc">{desc}</div>
              <div className="obj-smart-exemple">{exemple}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="obj-info-tip">
        <strong>Conseil :</strong> Formulez l'objectif à partir des attentes de la personne <em>et</em> de l'analyse de l'équipe, en cherchant le meilleur équilibre possible.
      </div>
    </div>
  );
}

function getCurseurLabel(val) {
  if (val < 20) return { texte: "Fortement centré sur les attentes de la personne", couleur: "#3182ce" };
  if (val < 40) return { texte: "Plutôt centré sur les attentes de la personne", couleur: "#4299e1" };
  if (val > 80) return { texte: "Fortement centré sur les besoins identifiés par l'équipe", couleur: "#2f855a" };
  if (val > 60) return { texte: "Plutôt centré sur les besoins identifiés par l'équipe", couleur: "#38a169" };
  return { texte: "Équilibre attentes / besoins équipe", couleur: "#718096" };
}

export function ObjectifsForm() {
  const { setObjectifsData } = useContext(PPContext);
  const [objectifs, setObjectifs] = useState([
    { id: Date.now(), titre: "", curseur: 50, moyens: [] },
  ]);
  const [showInfo, setShowInfo] = useState(false);

  // Synchronise les titres des objectifs vers le contexte partagé
  useEffect(() => {
    setObjectifsData(objectifs.map((o) => ({ id: o.id, titre: o.titre })));
  }, [objectifs, setObjectifsData]);

  const addObjectif = () =>
    setObjectifs((prev) => [
      ...prev,
      { id: Date.now(), titre: "", curseur: 50, moyens: [] },
    ]);

  const removeObjectif = (objId) =>
    setObjectifs((prev) => prev.filter((o) => o.id !== objId));

  const updateTitre = (objId, titre) =>
    setObjectifs((prev) =>
      prev.map((o) => (o.id === objId ? { ...o, titre } : o))
    );

  const updateCurseur = (objId, curseur) =>
    setObjectifs((prev) =>
      prev.map((o) => (o.id === objId ? { ...o, curseur: Number(curseur) } : o))
    );

  const addMoyen = (objId) =>
    setObjectifs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? { ...o, moyens: [...o.moyens, { id: Date.now(), contenu: "" }] }
          : o
      )
    );

  const removeMoyen = (objId, moyenId) =>
    setObjectifs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? { ...o, moyens: o.moyens.filter((m) => m.id !== moyenId) }
          : o
      )
    );

  const updateMoyen = (objId, moyenId, contenu) =>
    setObjectifs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? {
              ...o,
              moyens: o.moyens.map((m) =>
                m.id === moyenId ? { ...m, contenu } : m
              ),
            }
          : o
      )
    );

  return (
    <div className="objectifs-form">
      {/* En-tête avec bouton info */}
      <div className="objectifs-form-header">
        <span className="objectifs-form-titre">Objectifs et moyens à mettre en œuvre</span>
        <button
          className={`obj-info-btn${showInfo ? " active" : ""}`}
          onClick={() => setShowInfo((v) => !v)}
          title="Aide : comment formuler un objectif ?"
        >
          ⓘ Aide
        </button>
      </div>

      {showInfo && <InfoBubble onClose={() => setShowInfo(false)} />}

      {/* Liste des objectifs */}
      {objectifs.map((obj, index) => {
        const curseurInfo = getCurseurLabel(obj.curseur);
        return (
          <div key={obj.id} className="objectif-block">
            {/* Titre de l'objectif */}
            <div className="objectif-block-header">
              <span className="objectif-numero">Objectif {index + 1}</span>
              {objectifs.length > 1 && (
                <button
                  className="remove-objectif-btn"
                  onClick={() => removeObjectif(obj.id)}
                  title="Supprimer cet objectif"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              className="objectif-titre-input"
              type="text"
              placeholder="Formuler l'objectif ici (méthode SMART)…"
              value={obj.titre}
              onChange={(e) => updateTitre(obj.id, e.target.value)}
            />

            {/* Curseur pondération */}
            <div className="curseur-section">
              <div className="curseur-extremites">
                <span className="curseur-extremite gauche">Attentes<br />de la personne</span>
                <span className="curseur-extremite droite">Besoins identifiés<br />par l'équipe</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={obj.curseur}
                onChange={(e) => updateCurseur(obj.id, e.target.value)}
                className="curseur-slider"
                style={{ "--curseur-color": curseurInfo.couleur }}
              />
              <div className="curseur-valeur" style={{ color: curseurInfo.couleur }}>
                {curseurInfo.texte}
              </div>
            </div>

            {/* Moyens */}
            <div className="moyens-section">
              <div className="moyens-section-header">
                <span className="moyens-section-label">Moyens à mettre en œuvre</span>
                <button
                  className="add-moyen-btn"
                  onClick={() => addMoyen(obj.id)}
                >
                  + Ajouter un moyen
                </button>
              </div>
              {obj.moyens.length === 0 && (
                <p className="moyens-vide">Aucun moyen défini. Cliquez sur « + Ajouter un moyen ».</p>
              )}
              {obj.moyens.map((moyen, mIdx) => (
                <div key={moyen.id} className="moyen-item">
                  <span className="moyen-puce">{mIdx + 1}.</span>
                  <input
                    type="text"
                    className="moyen-input"
                    placeholder="Décrire le moyen à mettre en œuvre…"
                    value={moyen.contenu}
                    onChange={(e) => updateMoyen(obj.id, moyen.id, e.target.value)}
                  />
                  <button
                    className="remove-moyen-btn"
                    onClick={() => removeMoyen(obj.id, moyen.id)}
                    title="Supprimer ce moyen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button className="add-objectif-btn" onClick={addObjectif}>
        + Ajouter un objectif
      </button>
    </div>
  );
}

// ─── Réseau et partenaires ───────────────────────────────────────────────────
export function ReseauForm() {
  const { objectifsData } = useContext(PPContext);
  const [partenaires, setPartenaires] = useState({});

  const updatePartenaire = (objId, value) =>
    setPartenaires((prev) => ({ ...prev, [objId]: value }));

  return (
    <div className="reseau-form">
      <div className="reseau-form-titre">Réseau et partenaires</div>
      {objectifsData.length === 0 ? (
        <div className="reseau-empty">
          Aucun objectif défini. Ajoutez d&apos;abord le module &quot;Objectifs et moyens&quot; et saisissez vos objectifs.
        </div>
      ) : (
        <div className="reseau-table">
          <div className="reseau-table-header">
            <div className="reseau-col-objectif">Objectifs du PP</div>
            <div className="reseau-col-partenaire">Partenaires mobilisés</div>
          </div>
          {objectifsData.map((obj, idx) => (
            <div key={obj.id} className="reseau-table-row">
              <div className="reseau-col-objectif">
                {obj.titre ? obj.titre : <em className="reseau-sans-titre">Objectif {idx + 1} (sans titre)</em>}
              </div>
              <div className="reseau-col-partenaire">
                <input
                  type="text"
                  className="reseau-partenaire-input"
                  value={partenaires[obj.id] || ""}
                  onChange={(e) => updatePartenaire(obj.id, e.target.value)}
                  placeholder="Nom du ou des partenaires…"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Évaluation des objectifs du PP ─────────────────────────────────────────
export function EvalObjectifsPPForm() {
  const { objectifsData } = useContext(PPContext);
  const [evaluations, setEvaluations] = useState({});

  const update = (objId, field, value) =>
    setEvaluations((prev) => ({
      ...prev,
      [objId]: { ...prev[objId], [field]: value },
    }));

  return (
    <div className="eval-objectifs-form">
      <div className="eval-objectifs-titre">Évaluation des objectifs du PP</div>
      {objectifsData.length === 0 ? (
        <div className="eval-empty">
          Aucun objectif défini. Ajoutez d&apos;abord le module &quot;Objectifs et moyens&quot; et saisissez vos objectifs.
        </div>
      ) : (
        <div className="eval-table">
          <div className="eval-table-header">
            <div className="eval-col-objectif">Objectif du PP</div>
            <div className="eval-col-statut">Statut</div>
            <div className="eval-col-evolution">Évolution souhaitée</div>
          </div>
          {objectifsData.map((obj, idx) => (
            <div key={obj.id} className="eval-table-row">
              <div className="eval-col-objectif">
                {obj.titre ? obj.titre : <em className="eval-sans-titre">Objectif {idx + 1} (sans titre)</em>}
              </div>
              <div className="eval-col-statut">
                <select
                  className="eval-statut-select"
                  value={evaluations[obj.id]?.statut || ""}
                  onChange={(e) => update(obj.id, "statut", e.target.value)}
                >
                  <option value="">— Choisir —</option>
                  <option value="atteint">Atteint</option>
                  <option value="en_cours">En cours</option>
                  <option value="non_atteint">Non atteint</option>
                </select>
              </div>
              <div className="eval-col-evolution">
                <textarea
                  className="eval-evolution-textarea"
                  value={evaluations[obj.id]?.evolution || ""}
                  onChange={(e) => update(obj.id, "evolution", e.target.value)}
                  placeholder="Évolution souhaitée…"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Évaluation de stage et accueil temporaire ───────────────────────────────
export function EvalStageForm() {
  const [stages, setStages] = useState([
    { id: Date.now(), structure: "", commentaire: "", dateDebut: "", dateFin: "", evolution: "" },
  ]);

  const addStage = () =>
    setStages((prev) => [
      ...prev,
      { id: Date.now(), structure: "", commentaire: "", dateDebut: "", dateFin: "", evolution: "" },
    ]);

  const removeStage = (stageId) =>
    setStages((prev) => prev.filter((s) => s.id !== stageId));

  const updateStage = (stageId, field, value) =>
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, [field]: value } : s))
    );

  return (
    <div className="eval-stage-form">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="eval-stage-block">
          <div className="eval-stage-block-header">
            <span className="eval-stage-numero">Stage / Accueil temporaire {idx + 1}</span>
            {stages.length > 1 && (
              <button
                className="remove-objectif-btn"
                onClick={() => removeStage(stage.id)}
                title="Supprimer ce stage"
              >
                ✕
              </button>
            )}
          </div>
          <div className="identite-form">
            <div className="form-group">
              <label>Nom de la structure</label>
              <input
                type="text"
                value={stage.structure}
                onChange={(e) => updateStage(stage.id, "structure", e.target.value)}
                placeholder="Nom de la structure d'accueil…"
              />
            </div>
            <div className="form-group">
              <label>Commentaire</label>
              <textarea
                value={stage.commentaire}
                onChange={(e) => updateStage(stage.id, "commentaire", e.target.value)}
                placeholder="Déroulement du stage, observations…"
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  value={stage.dateDebut}
                  onChange={(e) => updateStage(stage.id, "dateDebut", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  value={stage.dateFin}
                  onChange={(e) => updateStage(stage.id, "dateFin", e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Évolution / Perspectives</label>
              <textarea
                value={stage.evolution}
                onChange={(e) => updateStage(stage.id, "evolution", e.target.value)}
                placeholder="Perspectives et évolutions futures…"
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-objectif-btn eval-stage-add-btn" onClick={addStage}>
        + Ajouter un stage / accueil temporaire
      </button>
    </div>
  );
}

// ─── Bloc analyse pluriprofessionnelle (générique, répétable) ───────────────
export function PluriproBlockForm() {
  const [titre, setTitre] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <div className="identite-form">
      <div className="form-group">
        <label>Titre du bloc</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex : Analyse du médecin traitant, Suivi de l'éducatrice…"
        />
      </div>
      <div className="form-group">
        <label>Analyse / Détail</label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Détaillez l'analyse ici…"
          rows={5}
        />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Alimentation ─────────────────────────────────────────
export function HvAlimentationForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    petitDejCompo: "", gouterCompo: "", collationNuit: "",
    complementsAlimentaires: "", alimentsNonAimes: "",
    regimeSansSucre: false, regimeSansSel: false, regimeAutre: "",
    boissonNonAimee: "", texture: "", allergies: "", choixPersonnels: "",
    troubleAppetit: "", troubleDeglutition: "", epaississant: "", eauGelifiee: "",
    mangeSeul: "", aidePartielle: "", aideTotale: "",
    mangeLentement: "", mangeRapidement: "", neResteTable: "", boitSeul: "", aStImuler: "",
    boissonTableVin: false, boissonTableEau: false, boissonTableSirops: false,
    boissonTableJus: false, boissonTableBiere: false, boissonTableAutres: "",
    boissonHorsEau: false, boissonHorsSirop: false, boissonHorsTisane: false,
    boissonHorsJus: false, boissonHorsBiere: false, boissonHorsCafe: false,
    boissonHorsThe: false, boissonHorsAperitifs: false, boissonHorsAlcools: false,
    remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));
  const tog = (f) => setData(p => ({ ...p, [f]: !p[f] }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Repas</div>
        {[
          ["petitDejCompo", "Petit déjeuner — composition"],
          ["gouterCompo", "Goûter — composition"],
          ["collationNuit", "Collation de nuit"],
        ].map(([f, lbl]) => (
          <div key={f} className="form-group">
            <label>{lbl}</label>
            <textarea value={data[f]} onChange={e => upd(f, e.target.value)} rows={2} placeholder={`${lbl}…`} />
          </div>
        ))}
        <OuiNon field="complementsAlimentaires" label="Compléments alimentaires" />
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Préférences et restrictions</div>
        <div className="form-group">
          <label>Aliments non aimés</label>
          <textarea value={data.alimentsNonAimes} onChange={e => upd("alimentsNonAimes", e.target.value)} rows={2} placeholder="Aliments non appréciés…" />
        </div>
        <div className="form-group">
          <label>Régime alimentaire médicalement prescrit</label>
          <div className="hv-checkbox-row">
            {[["regimeSansSucre", "Sans sucre"], ["regimeSansSel", "Sans sel"]].map(([f, lbl]) => (
              <label key={f} className="checkbox-item">
                <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
              </label>
            ))}
          </div>
          <div className="form-group hv-sub-field">
            <label>Autre régime prescrit</label>
            <input type="text" value={data.regimeAutre} onChange={e => upd("regimeAutre", e.target.value)} placeholder="Préciser…" />
          </div>
        </div>
        <div className="form-group">
          <label>Boisson non aimée</label>
          <input type="text" value={data.boissonNonAimee} onChange={e => upd("boissonNonAimee", e.target.value)} placeholder="Boisson(s) non appréciée(s)…" />
        </div>
        <div className="form-group">
          <label>Texture des repas</label>
          <select value={data.texture} onChange={e => upd("texture", e.target.value)}>
            <option value="">— Choisir —</option>
            <option value="normal">Normal</option>
            <option value="hache">Haché</option>
            <option value="mixe_lisse">Mixé lisse</option>
            <option value="mousse">Mixé mousse</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="form-group">
          <label>Allergie ou intolérance alimentaire</label>
          <textarea value={data.allergies} onChange={e => upd("allergies", e.target.value)} rows={2} placeholder="Allergies ou intolérances connues…" />
        </div>
        <div className="form-group">
          <label>Choix personnels sans lien médical (sans viande, végé, vegan…)</label>
          <textarea value={data.choixPersonnels} onChange={e => upd("choixPersonnels", e.target.value)} rows={2} placeholder="Choix alimentaires personnels…" />
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Troubles</div>
        <OuiNon field="troubleAppetit" label="Trouble de l'appétit" />
        <OuiNon field="troubleDeglutition" label="Trouble de la déglutition" />
        {data.troubleDeglutition === "oui" && (
          <div className="hv-indent">
            <OuiNon field="epaississant" label="Usage d'épaississant" />
            <OuiNon field="eauGelifiee" label="Usage d'eau gélifiée" />
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Comportement lors de la prise des repas</div>
        <div className="hv-behavior-grid">
          {[
            ["mangeSeul", "Mange seul"], ["aidePartielle", "Aide partielle"], ["aideTotale", "Aide totale"],
            ["mangeLentement", "Mange lentement"], ["mangeRapidement", "Mange rapidement"],
            ["neResteTable", "Ne reste pas à table"], ["boitSeul", "Boit seul"], ["aStImuler", "À stimuler"],
          ].map(([f, lbl]) => (
            <div key={f} className="hv-behavior-item">
              <span className="hv-behavior-label">{lbl}</span>
              <div className="hv-oui-non-options">
                {["oui", "non"].map(v => (
                  <label key={v} className="hv-radio-option">
                    <input type="radio" name={`${uid}-${f}`} value={v}
                      checked={data[f] === v} onChange={() => upd(f, v)} />
                    {v === "oui" ? "Oui" : "Non"}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Boissons à table</div>
        <div className="hv-checkbox-row hv-checkbox-wrap">
          {[
            ["boissonTableVin", "Vin"], ["boissonTableEau", "Eau"], ["boissonTableSirops", "Sirops"],
            ["boissonTableJus", "Jus de fruits"], ["boissonTableBiere", "Bière"],
          ].map(([f, lbl]) => (
            <label key={f} className="checkbox-item">
              <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
            </label>
          ))}
        </div>
        <div className="form-group hv-sub-field">
          <label>Autres boissons à table</label>
          <input type="text" value={data.boissonTableAutres} onChange={e => upd("boissonTableAutres", e.target.value)} placeholder="Préciser…" />
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Boissons en dehors des repas</div>
        <div className="hv-checkbox-row hv-checkbox-wrap">
          {[
            ["boissonHorsEau", "Eau"], ["boissonHorsSirop", "Sirop"], ["boissonHorsTisane", "Tisane"],
            ["boissonHorsJus", "Jus de fruits"], ["boissonHorsBiere", "Bière"], ["boissonHorsCafe", "Café"],
            ["boissonHorsThe", "Thé"], ["boissonHorsAperitifs", "Apéritifs"], ["boissonHorsAlcools", "Alcools"],
          ].map(([f, lbl]) => (
            <label key={f} className="checkbox-item">
              <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Remarques particulières sur l&apos;alimentation</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Remarques particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Sommeil et repos ──────────────────────────────────────
export function HvSommeilForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    heureLever: "", heureCoucher: "",
    sieste: "", siesteLieu: "", siesteDuree: "",
    regardeTvAvantCoucher: "", regardeTvLieu: "", regardeTvHabille: "",
    positionCouche: "",
    leveSeul: "", coucheSeul: "",
    sommeilRegulier: "", leveNuit: "", leveNuitMotif: "",
    litMedicalise: "", barrieresLit: "",
    rituel: "", remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Horaires</div>
        <div className="form-row">
          <div className="form-group">
            <label>Heure de lever</label>
            <input type="time" value={data.heureLever} onChange={e => upd("heureLever", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Heure de coucher</label>
            <input type="time" value={data.heureCoucher} onChange={e => upd("heureCoucher", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Sieste</div>
        <OuiNon field="sieste" label="Sieste" />
        {data.sieste === "oui" && (
          <div className="hv-indent">
            <div className="form-group">
              <label>Lieu de sieste</label>
              <div className="hv-checkbox-row">
                {["Lit", "Fauteuil"].map(v => (
                  <label key={v} className="hv-radio-option">
                    <input type="radio" name={`${uid}-siesteLieu`} value={v.toLowerCase()}
                      checked={data.siesteLieu === v.toLowerCase()} onChange={() => upd("siesteLieu", v.toLowerCase())} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Durée de la sieste</label>
              <input type="text" value={data.siesteDuree} onChange={e => upd("siesteDuree", e.target.value)} placeholder="Ex : 30 min, 1 heure…" />
            </div>
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Télévision avant coucher</div>
        <OuiNon field="regardeTvAvantCoucher" label="Regarde la télévision avant de se coucher" />
        {data.regardeTvAvantCoucher === "oui" && (
          <div className="hv-indent">
            <div className="form-group">
              <label>Lieu</label>
              <div className="hv-checkbox-row">
                {[["lit", "Au lit"], ["fauteuil", "Au fauteuil"]].map(([v, lbl]) => (
                  <label key={v} className="hv-radio-option">
                    <input type="radio" name={`${uid}-regardeTvLieu`} value={v}
                      checked={data.regardeTvLieu === v} onChange={() => upd("regardeTvLieu", v)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
            {data.regardeTvLieu === "fauteuil" && (
              <div className="form-group">
                <label>État</label>
                <div className="hv-checkbox-row">
                  {[["habille", "Habillé"], ["deshabille", "Déshabillé"]].map(([v, lbl]) => (
                    <label key={v} className="hv-radio-option">
                      <input type="radio" name={`${uid}-regardeTvHabille`} value={v}
                        checked={data.regardeTvHabille === v} onChange={() => upd("regardeTvHabille", v)} />
                      {lbl}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Position et autonomie</div>
        <div className="form-group">
          <label>Position de couchage habituelle</label>
          <div className="hv-checkbox-row">
            {[["dos", "Sur le dos"], ["cote_droit", "Côté droit"], ["cote_gauche", "Côté gauche"]].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-positionCouche`} value={v}
                  checked={data.positionCouche === v} onChange={() => upd("positionCouche", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
        <OuiNon field="leveSeul" label="Se lève seul" />
        <OuiNon field="coucheSeul" label="Se couche seul" />
        <OuiNon field="sommeilRegulier" label="Sommeil régulier" />
        <OuiNon field="leveNuit" label="Se lève la nuit" />
        {data.leveNuit === "oui" && (
          <div className="form-group hv-sub-field">
            <label>Motif du lever nocturne</label>
            <input type="text" value={data.leveNuitMotif} onChange={e => upd("leveNuitMotif", e.target.value)} placeholder="Ex : WC, douleur, insomnie…" />
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Équipement du domicile</div>
        <OuiNon field="litMedicalise" label="Lit médicalisé au domicile" />
        <OuiNon field="barrieresLit" label="Barrières de lit au domicile" />
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Rituel avant le coucher</div>
        <div className="form-group">
          <label>Rituel de coucher (verre d&apos;eau, mouchoir, volets, veilleuse, porte…)</label>
          <textarea value={data.rituel} onChange={e => upd("rituel", e.target.value)} rows={3} placeholder="Décrivez les habitudes de coucher…" />
        </div>
      </div>

      <div className="form-group">
        <label>Remarques particulières sur le sommeil</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Remarques particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Hygiène corporelle et esthétique ─────────────────────
export function HvHygieneForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    momentToiletteAvantPetitDej: false, momentToiletteApresPetitDej: false, momentToiletteSoir: false,
    toiletteAutonomie: "",
    douche: "", bains: "", toiletteLavabo: "", shampoing: "",
    soinsManucure: false, soinsManucureRythme: "",
    soinsCoiffeur: false, soinsCoiffeurFrequence: "",
    soinsRasageSeul: "", soinsRasageType: "",
    soinsMaquillage: false, soinsMaquillagePrecision: "",
    soinsPedicurie: false,
    habillageAutonomie: "", deshabillageAutonomie: "",
    auditionTroubles: "", auditionOreilleD: false, auditionOreilleG: false,
    auditionAppareil: "", auditionGereSeul: "",
    visionTroubles: "", visionPrecision: "",
    lunettes: "", lunettesJournee: "", lunettesLecture: "",
    protheseDentaire: "", protheseDentaireFixe: false, protheseDentaireFixeNiveau: "",
    protheseDentaireComplete: false, protheseDentaireCompleteHaut: false, protheseDentaireCompleteBas: false,
    protheseDentaireGereSeul: "",
    remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));
  const tog = (f) => setData(p => ({ ...p, [f]: !p[f] }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  const Autonomie = ({ field, label }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="hv-checkbox-row">
        {[["seul", "Seul"], ["aide_partielle", "Avec aide partielle"], ["aide_totale", "Avec aide totale"]].map(([v, lbl]) => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {lbl}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Moment de toilette</div>
        <div className="hv-checkbox-row">
          {[
            ["momentToiletteAvantPetitDej", "Avant le petit déjeuner"],
            ["momentToiletteApresPetitDej", "Après le petit déjeuner"],
            ["momentToiletteSoir", "Le soir avant de se déshabiller / coucher"],
          ].map(([f, lbl]) => (
            <label key={f} className="checkbox-item">
              <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
            </label>
          ))}
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Toilette</div>
        <Autonomie field="toiletteAutonomie" label="Toilette" />
        <OuiNon field="douche" label="Douche" />
        <OuiNon field="bains" label="Bains" />
        <OuiNon field="toiletteLavabo" label="Toilette au lavabo" />
        <OuiNon field="shampoing" label="Shampoing" />
        <OuiNon field="soinsPedicurie" label="Soins de pédicurie" />
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Rasage</div>
        <OuiNon field="soinsRasageSeul" label="Rasage seul" />
        {data.soinsRasageSeul === "oui" && (
          <div className="hv-indent">
            <div className="form-group">
              <label>Type de rasoir</label>
              <div className="hv-checkbox-row">
                {[["electrique", "Rasoir électrique"], ["manuel", "Rasoir manuel"]].map(([v, lbl]) => (
                  <label key={v} className="hv-radio-option">
                    <input type="radio" name={`${uid}-soinsRasageType`} value={v}
                      checked={data.soinsRasageType === v} onChange={() => upd("soinsRasageType", v)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Soins esthétiques</div>
        <div className="hv-oui-non-row">
          <span className="hv-oui-non-label">Maquillage</span>
          <label className="checkbox-item">
            <input type="checkbox" checked={data.soinsMaquillage} onChange={() => tog("soinsMaquillage")} />Oui
          </label>
        </div>
        {data.soinsMaquillage && (
          <div className="form-group hv-sub-field">
            <label>Lequel / lesquels</label>
            <input type="text" value={data.soinsMaquillagePrecision} onChange={e => upd("soinsMaquillagePrecision", e.target.value)} placeholder="Ex : fond de teint, rouge à lèvres…" />
          </div>
        )}
        <div className="hv-oui-non-row">
          <span className="hv-oui-non-label">Manucure</span>
          <label className="checkbox-item">
            <input type="checkbox" checked={data.soinsManucure} onChange={() => tog("soinsManucure")} />Oui
          </label>
        </div>
        {data.soinsManucure && (
          <div className="form-group hv-sub-field">
            <label>À quel rythme</label>
            <input type="text" value={data.soinsManucureRythme} onChange={e => upd("soinsManucureRythme", e.target.value)} placeholder="Ex : hebdomadaire, mensuel…" />
          </div>
        )}
        <div className="hv-oui-non-row">
          <span className="hv-oui-non-label">Coiffeur</span>
          <label className="checkbox-item">
            <input type="checkbox" checked={data.soinsCoiffeur} onChange={() => tog("soinsCoiffeur")} />Oui
          </label>
        </div>
        {data.soinsCoiffeur && (
          <div className="form-group hv-sub-field">
            <label>À quelle fréquence</label>
            <input type="text" value={data.soinsCoiffeurFrequence} onChange={e => upd("soinsCoiffeurFrequence", e.target.value)} placeholder="Ex : mensuel, tous les 2 mois…" />
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Habillage et déshabillage</div>
        <Autonomie field="habillageAutonomie" label="Habillage" />
        <Autonomie field="deshabillageAutonomie" label="Déshabillage" />
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Appareillages auditifs</div>
        <OuiNon field="auditionTroubles" label="Troubles de l'audition" />
        {data.auditionTroubles === "oui" && (
          <div className="hv-indent">
            <div className="form-group">
              <label>Oreille(s) concernée(s)</label>
              <div className="hv-checkbox-row">
                {[["auditionOreilleD", "Oreille droite"], ["auditionOreilleG", "Oreille gauche"]].map(([f, lbl]) => (
                  <label key={f} className="checkbox-item">
                    <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
                  </label>
                ))}
              </div>
            </div>
            <OuiNon field="auditionAppareil" label="Port d'un appareil auditif" />
            {data.auditionAppareil === "oui" && (
              <OuiNon field="auditionGereSeul" label="Gère seul son appareil auditif" />
            )}
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Appareillages visuels</div>
        <OuiNon field="visionTroubles" label="Troubles de la vision" />
        {data.visionTroubles === "oui" && (
          <div className="hv-indent">
            <div className="form-group">
              <label>Préciser les troubles</label>
              <input type="text" value={data.visionPrecision} onChange={e => upd("visionPrecision", e.target.value)} placeholder="Ex : myopie, cataracte, DMLA…" />
            </div>
            <OuiNon field="lunettes" label="Port de lunettes" />
            {data.lunettes === "oui" && (
              <div className="hv-indent">
                <OuiNon field="lunettesJournee" label="Toute la journée" />
                <OuiNon field="lunettesLecture" label="Pour lire uniquement" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Prothèses dentaires</div>
        <OuiNon field="protheseDentaire" label="Port de prothèses dentaires" />
        {data.protheseDentaire === "oui" && (
          <div className="hv-indent">
            <div className="hv-oui-non-row">
              <span className="hv-oui-non-label">Appareil fixe</span>
              <label className="checkbox-item">
                <input type="checkbox" checked={data.protheseDentaireFixe} onChange={() => tog("protheseDentaireFixe")} />Oui
              </label>
            </div>
            {data.protheseDentaireFixe && (
              <div className="form-group hv-sub-field">
                <label>Niveau / localisation</label>
                <input type="text" value={data.protheseDentaireFixeNiveau} onChange={e => upd("protheseDentaireFixeNiveau", e.target.value)} placeholder="Ex : molaires, incisives…" />
              </div>
            )}
            <div className="hv-oui-non-row">
              <span className="hv-oui-non-label">Appareil complet</span>
              <label className="checkbox-item">
                <input type="checkbox" checked={data.protheseDentaireComplete} onChange={() => tog("protheseDentaireComplete")} />Oui
              </label>
            </div>
            {data.protheseDentaireComplete && (
              <div className="hv-indent">
                <div className="hv-checkbox-row">
                  {[["protheseDentaireCompleteHaut", "Haut"], ["protheseDentaireCompleteBas", "Bas"]].map(([f, lbl]) => (
                    <label key={f} className="checkbox-item">
                      <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <OuiNon field="protheseDentaireGereSeul" label="Gère seul ses appareils dentaires" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Remarques particulières sur l&apos;hygiène</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Remarques particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Élimination et transit ───────────────────────────────
export function HvEliminationForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    toilettesAutonomie: "",
    incontinenceUrinaire: "", incontinenceFecale: "",
    fuitesUrinaires: "",
    protectionJour: "", protectionJourType: "", protectionJourTaille: "",
    protectionNuit: "", protectionNuitType: "", protectionNuitTaille: "",
    remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  const ProtectionDetails = ({ prefix, label }) => (
    <div className="hv-indent">
      <div className="form-row">
        <div className="form-group">
          <label>Type de protection</label>
          <select value={data[`${prefix}Type`]} onChange={e => upd(`${prefix}Type`, e.target.value)}>
            <option value="">— Choisir —</option>
            <option value="change_complet">Change complet</option>
            <option value="pants">Pants</option>
            <option value="anamini">Anamini</option>
          </select>
        </div>
        <div className="form-group">
          <label>Taille</label>
          <select value={data[`${prefix}Taille`]} onChange={e => upd(`${prefix}Taille`, e.target.value)}>
            <option value="">— Taille —</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Élimination et transit</div>
        <div className="form-group">
          <label>Aller aux toilettes</label>
          <div className="hv-checkbox-row">
            {[["seul", "Seul"], ["avec_aide", "Avec aide"]].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-toilettesAutonomie`} value={v}
                  checked={data.toilettesAutonomie === v} onChange={() => upd("toilettesAutonomie", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
        <OuiNon field="incontinenceUrinaire" label="Incontinence urinaire" />
        <OuiNon field="incontinenceFecale" label="Incontinence fécale" />
        <OuiNon field="fuitesUrinaires" label="Fuites urinaires légères à l'effort" />
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Protections</div>
        <OuiNon field="protectionJour" label="Protection de jour" />
        {data.protectionJour === "oui" && (
          <ProtectionDetails prefix="protectionJour" label="Protection de jour" />
        )}
        <OuiNon field="protectionNuit" label="Protection de nuit" />
        {data.protectionNuit === "oui" && (
          <ProtectionDetails prefix="protectionNuit" label="Protection de nuit" />
        )}
      </div>

      <div className="form-group">
        <label>Remarques particulières sur l&apos;élimination</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Remarques particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Communication ────────────────────────────────────────
export function HvCommunicationForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    langue: "", communication: "", surnom: "",
    sexprimVerbalement: "", saitLire: "", saitEcrire: "",
    comprehension: "",
    commentCommunique: "",
    supportsAuxiliaires: "", supportsDetail: "",
    demandeAttention: "", exprimeRefus: "",
    accepteToucher: "", besoinToucher: "",
    remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Langue et expression</div>
        <div className="form-group">
          <label>Langue de référence</label>
          <input type="text" value={data.langue} onChange={e => upd("langue", e.target.value)} placeholder="Ex : Français, Anglais, LSF…" />
        </div>
        <div className="form-group">
          <label>Préférence / habitude de communication</label>
          <div className="hv-checkbox-row">
            {[["tutoiement", "Tutoiement"], ["vouvoiement", "Vouvoiement"]].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-communication`} value={v}
                  checked={data.communication === v} onChange={() => upd("communication", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Surnom / prénom usuel</label>
          <input type="text" value={data.surnom} onChange={e => upd("surnom", e.target.value)} placeholder="Ex : Mamie, Tonton, Lili…" />
        </div>
        <OuiNon field="sexprimVerbalement" label="Sait s'exprimer verbalement" />
        <OuiNon field="saitLire" label="Sait lire" />
        <OuiNon field="saitEcrire" label="Sait écrire" />
        <div className="form-group">
          <label>Compréhension de phrases et consignes simples</label>
          <div className="hv-checkbox-row">
            {[["totale", "Totale"], ["partielle", "Partielle"]].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-comprehension`} value={v}
                  checked={data.comprehension === v} onChange={() => upd("comprehension", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Modes de communication</div>
        <div className="form-group">
          <label>Comment communique-t-il / elle ? (répond à des questions fermées, par oui/non…)</label>
          <textarea value={data.commentCommunique} onChange={e => upd("commentCommunique", e.target.value)} rows={3} placeholder="Décrivez le mode de communication habituel…" />
        </div>
        <OuiNon field="supportsAuxiliaires" label="Utilise des supports / moyens auxiliaires pour communiquer" />
        {data.supportsAuxiliaires === "oui" && (
          <div className="form-group hv-sub-field">
            <label>Détails des supports utilisés</label>
            <textarea value={data.supportsDetail} onChange={e => upd("supportsDetail", e.target.value)} rows={2} placeholder="Ex : pictogrammes, tablette, signes, PECS…" />
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Comportement relationnel</div>
        <div className="form-group">
          <label>Comment demande-t-il / elle de l&apos;attention ou de l&apos;aide ?</label>
          <textarea value={data.demandeAttention} onChange={e => upd("demandeAttention", e.target.value)} rows={2} placeholder="Ex : appelle, touche le bras, sonne…" />
        </div>
        <div className="form-group">
          <label>Comment exprime-t-il / elle son refus ?</label>
          <textarea value={data.exprimeRefus} onChange={e => upd("exprimeRefus", e.target.value)} rows={2} placeholder="Ex : dit non, se détourne, crie…" />
        </div>
        <OuiNon field="accepteToucher" label="Accepte facilement d'être touché(e)" />
        <OuiNon field="besoinToucher" label="A l'habitude ou le besoin de toucher (dans le contact avec l'autre)" />
      </div>

      <div className="form-group">
        <label>Remarques particulières sur la communication</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Remarques particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Mobilités et déplacements ────────────────────────────
export function HvMobiliteForm() {
  const [uid] = useState(() => Math.random().toString(36).slice(2));
  const [data, setData] = useState({
    lateralite: "",
    deplacement: "",
    canneSimple: false, deuxCannesSimples: false,
    canneAnglaise: false, deuxCannesAnglaises: false,
    deambulateur: false, canneTripode: false,
    fauteuilRoulant: false, fauteuilElectrique: false,
    deplacementAutres: "",
    leverCoucher: "",
    chutes: "", nombreChutes6Mois: "",
    conduiteVoiture: "", conduiteMobylette: "", conduiteVelo: "",
    remarques: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));
  const tog = (f) => setData(p => ({ ...p, [f]: !p[f] }));

  const OuiNon = ({ field, label }) => (
    <div className="hv-oui-non-row">
      <span className="hv-oui-non-label">{label}</span>
      <div className="hv-oui-non-options">
        {["oui", "non"].map(v => (
          <label key={v} className="hv-radio-option">
            <input type="radio" name={`${uid}-${field}`} value={v}
              checked={data[field] === v} onChange={() => upd(field, v)} />
            {v === "oui" ? "Oui" : "Non"}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Latéralité</div>
        <div className="hv-checkbox-row">
          {[["droitier", "Droitier"], ["gaucher", "Gaucher"]].map(([v, lbl]) => (
            <label key={v} className="hv-radio-option">
              <input type="radio" name={`${uid}-lateralite`} value={v}
                checked={data.lateralite === v} onChange={() => upd("lateralite", v)} />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Déplacement</div>
        <div className="form-group">
          <label>Autonomie de déplacement</label>
          <div className="hv-checkbox-row hv-checkbox-wrap">
            {[
              ["seul", "Seul"], ["aide_partielle", "Avec aide partielle"],
              ["aide_totale", "Avec aide totale"], ["alite", "Alité en permanence"],
            ].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-deplacement`} value={v}
                  checked={data.deplacement === v} onChange={() => upd("deplacement", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Aide(s) technique(s) à la marche</label>
          <div className="hv-checkbox-row hv-checkbox-wrap">
            {[
              ["canneSimple", "Canne simple"], ["deuxCannesSimples", "Deux cannes simples"],
              ["canneAnglaise", "Canne anglaise"], ["deuxCannesAnglaises", "Deux cannes anglaises"],
              ["deambulateur", "Déambulateur"], ["canneTripode", "Canne tripode"],
              ["fauteuilRoulant", "Fauteuil roulant"], ["fauteuilElectrique", "Fauteuil électrique"],
            ].map(([f, lbl]) => (
              <label key={f} className="checkbox-item">
                <input type="checkbox" checked={data[f]} onChange={() => tog(f)} />{lbl}
              </label>
            ))}
          </div>
          <div className="form-group hv-sub-field">
            <label>Autres aides techniques</label>
            <input type="text" value={data.deplacementAutres} onChange={e => upd("deplacementAutres", e.target.value)} placeholder="Préciser…" />
          </div>
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Lever / coucher</div>
        <div className="form-group">
          <label>Se lever / se coucher</label>
          <div className="hv-checkbox-row">
            {[["seul", "Seul"], ["aide_partielle", "Avec aide partielle"], ["aide_totale", "Avec aide totale"]].map(([v, lbl]) => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-leverCoucher`} value={v}
                  checked={data.leverCoucher === v} onChange={() => upd("leverCoucher", v)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Chutes</div>
        <OuiNon field="chutes" label="A déjà fait des chutes" />
        {data.chutes === "oui" && (
          <div className="form-group hv-sub-field">
            <label>Nombre de chutes durant les 6 derniers mois</label>
            <input type="number" min="0" value={data.nombreChutes6Mois} onChange={e => upd("nombreChutes6Mois", e.target.value)} placeholder="0" />
          </div>
        )}
      </div>

      <div className="hv-subsection">
        <div className="hv-subsection-title">Conduite</div>
        <OuiNon field="conduiteVoiture" label="Conduit une voiture" />
        <OuiNon field="conduiteMobylette" label="Conduit une mobylette" />
        <OuiNon field="conduiteVelo" label="Conduit un vélo" />
      </div>

      <div className="form-group">
        <label>Observations particulières sur la mobilité</label>
        <textarea value={data.remarques} onChange={e => upd("remarques", e.target.value)} rows={3} placeholder="Observations particulières…" />
      </div>
    </div>
  );
}

// ─── Habitudes de vie : Vie sociale et culturelle ────────────────────────────
export function HvSocialeForm() {
  const [data, setData] = useState({
    activite: "",
    observations: "",
  });
  const upd = (f, v) => setData(p => ({ ...p, [f]: v }));
  const [uid] = useState(() => Math.random().toString(36).slice(2));

  return (
    <div className="hv-form identite-form">
      <div className="hv-subsection">
        <div className="hv-subsection-title">Activité</div>
        <div className="hv-oui-non-row">
          <span className="hv-oui-non-label">Activité(s) sociale(s) et culturelle(s)</span>
          <div className="hv-oui-non-options">
            {["oui", "non"].map(v => (
              <label key={v} className="hv-radio-option">
                <input type="radio" name={`${uid}-activite`} value={v}
                  checked={data.activite === v} onChange={() => upd("activite", v)} />
                {v === "oui" ? "Oui" : "Non"}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Observations particulières sur la vie sociale et culturelle</label>
        <textarea value={data.observations} onChange={e => upd("observations", e.target.value)} rows={6} placeholder="Décrivez les activités, habitudes sociales, loisirs, relations…" />
      </div>
    </div>
  );
}

// ─── Bilans et évaluations : Autres évaluations et bilans ───────────────────
export function AutresEvaluationsForm() {
  const [evaluations, setEvaluations] = useState([
    { id: Date.now(), type: "", date: "", intervenant: "", observations: "" },
  ]);

  const addEval = () =>
    setEvaluations(prev => [
      ...prev,
      { id: Date.now(), type: "", date: "", intervenant: "", observations: "" },
    ]);

  const removeEval = (id) =>
    setEvaluations(prev => prev.filter(e => e.id !== id));

  const updateEval = (id, field, value) =>
    setEvaluations(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e))
    );

  return (
    <div className="autres-eval-form">
      {evaluations.map((ev, idx) => (
        <div key={ev.id} className="autres-eval-block">
          <div className="autres-eval-block-header">
            <span className="autres-eval-numero">Évaluation / Bilan {idx + 1}</span>
            {evaluations.length > 1 && (
              <button
                className="remove-objectif-btn"
                onClick={() => removeEval(ev.id)}
                title="Supprimer cette évaluation"
              >
                ✕
              </button>
            )}
          </div>
          <div className="identite-form">
            <div className="form-row">
              <div className="form-group">
                <label>Type d&apos;évaluation / bilan</label>
                <input
                  type="text"
                  value={ev.type}
                  onChange={e => updateEval(ev.id, "type", e.target.value)}
                  placeholder="Ex : bilan neuropsychologique, MMS, GIR…"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={ev.date}
                  onChange={e => updateEval(ev.id, "date", e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Intervenant(s)</label>
              <input
                type="text"
                value={ev.intervenant}
                onChange={e => updateEval(ev.id, "intervenant", e.target.value)}
                placeholder="Ex : psychologue, médecin, ergothérapeute…"
              />
            </div>
            <div className="form-group">
              <label>Résultats et observations</label>
              <textarea
                value={ev.observations}
                onChange={e => updateEval(ev.id, "observations", e.target.value)}
                placeholder="Résultats, scores, conclusions, recommandations…"
                rows={4}
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-objectif-btn autres-eval-add-btn" onClick={addEval}>
        + Ajouter une évaluation / bilan
      </button>
    </div>
  );
}

// ─── Helper : retourne le composant formulaire selon l'id du module ────────────
const FORM_MAP = {
  "identite__etat_civil": EtatCivilForm,
  "identite__situation_familiale": SituationFamilialeForm,
  "identite__scolarite": ScolariteForm,
  "identite__situation_pro": SituationProForm,
  "identite__droits_mdph": DroitsMDPHForm,
  "identite__droits_logement": DroitsLogementForm,
  "identite__droits_emploi": DroitsEmploiForm,
  "identite__droits_divers": DroitsDiversForm,
  // Recueil des attentes
  "recueil_attentes__personne": AttentesPersonneForm,
  "recueil_attentes__proches_aidants": AttentesProcheAidantsForm,
  "recueil_attentes__representant_legal": AttentesRepresentantLegalForm,
  // Analyse pluriprofessionnelle (blocs répétables par catégorie)
  "analyse_equipe__medical": PluriproBlockForm,
  "analyse_equipe__paramedical": PluriproBlockForm,
  "analyse_equipe__psychologique": PluriproBlockForm,
  "analyse_equipe__social": PluriproBlockForm,
  "analyse_equipe__educatif": PluriproBlockForm,
  "analyse_equipe__loisirs": PluriproBlockForm,
  // Objectifs et moyens à mettre en œuvre
  "objectifs": ObjectifsForm,
  // Réseau et partenaires
  "reseau": ReseauForm,
  // Bilans et évaluations
  "bilan__eval_objectifs_pp": EvalObjectifsPPForm,
  "bilan__eval_stage": EvalStageForm,
  "bilan__autres_evaluations": AutresEvaluationsForm,
  // Habitudes de vie
  "habitudes_vie__hv_alimentation": HvAlimentationForm,
  "habitudes_vie__hv_sommeil": HvSommeilForm,
  "habitudes_vie__hv_hygiene": HvHygieneForm,
  "habitudes_vie__hv_elimination": HvEliminationForm,
  "habitudes_vie__hv_communication": HvCommunicationForm,
  "habitudes_vie__hv_mobilite": HvMobiliteForm,
  "habitudes_vie__hv_sociale": HvSocialeForm,
};

export function getIdentiteForm(moduleId) {
  if (FORM_MAP[moduleId]) return FORM_MAP[moduleId];
  // Prefix match for repeatable items (e.g. "analyse_equipe__medical__1718000000000")
  const lastSep = moduleId.lastIndexOf("__");
  if (lastSep !== -1) {
    const baseId = moduleId.substring(0, lastSep);
    if (FORM_MAP[baseId]) return FORM_MAP[baseId];
  }
  return null;
}
