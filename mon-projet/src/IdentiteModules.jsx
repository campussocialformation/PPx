import { useState } from "react";

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
};

export function getIdentiteForm(moduleId) {
  return FORM_MAP[moduleId] || null;
}
