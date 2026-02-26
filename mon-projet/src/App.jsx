import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getIdentiteForm } from "./IdentiteModules";

// Configuration des modules par pôle
const POLES = {
  adulte: {
    label: "Pôle Adulte",
    modules: [
      {
        id: "identite",
        label: "Identité et situation administrative",
        obligatoire: true,
        sousModules: [
          { id: "etat_civil", label: "État civil" },
          { id: "situation_familiale", label: "Situation familiale" },
          { id: "scolarite", label: "Scolarité / Formation / Diplôme" },
          { id: "situation_pro", label: "Situation professionnelle" },
          { id: "droits_mdph", label: "Accès aux droits MDPH" },
          { id: "droits_logement", label: "Accès aux droits logement" },
          { id: "droits_emploi", label: "Accès aux droits emploi" },
          { id: "droits_divers", label: "Accès aux droits divers" },
        ],
      },
      {
        id: "parcours_precedent",
        label: "Éléments du précédent parcours",
        obligatoire: true,
        sousModules: [
          { id: "parcours_scolaire", label: "Parcours scolaire" },
          { id: "parcours_institutionnel", label: "Parcours institutionnel" },
          { id: "parcours_familial", label: "Parcours familial" },
          { id: "parcours_geographique", label: "Parcours géographique" },
        ],
      },
      {
        id: "recueil_attentes",
        label: "Recueil des attentes",
        obligatoire: true,
        sousModules: null,
        consentement: true,
      },
      {
        id: "analyse_equipe",
        label: "Analyse de l'équipe pluriprofessionnelle",
        obligatoire: true,
        sousModules: [
          { id: "educ_coordo", label: "Éducateur coordinateur" },
          { id: "equipe_quotidien", label: "Équipe du quotidien" },
          { id: "ergo", label: "Ergothérapeute" },
          { id: "psychomot", label: "Psychomotricien" },
          { id: "medecin_general", label: "Médecin généraliste" },
          { id: "medecin_psy", label: "Médecin psychiatre" },
        ],
      },
      {
        id: "objectifs",
        label: "Objectifs et moyens à mettre en œuvre",
        obligatoire: true,
        sousModules: null,
      },
      {
        id: "parcours_futur",
        label: "Éléments du parcours futur",
        obligatoire: true,
        sousModules: null,
      },
      {
        id: "reseau",
        label: "Réseau et partenaires",
        obligatoire: true,
        sousModules: null,
      },
      {
        id: "bilan",
        label: "Bilan et évaluation",
        obligatoire: true,
        sousModules: null,
      },
      {
        id: "habitudes_vie",
        label: "Habitudes de vie",
        obligatoire: false,
        sousModules: [
          { id: "hv_alimentation", label: "Alimentation" },
          { id: "hv_sommeil", label: "Sommeil et repos" },
          { id: "hv_hygiene", label: "Hygiène corporelle" },
          { id: "hv_elimination", label: "Élimination et transit" },
          { id: "hv_communication", label: "Communication" },
          { id: "hv_mobilite", label: "Mobilités et déplacements" },
          { id: "hv_sociale", label: "Vie sociale et culturelle" },
        ],
      },
    ],
  },
  enfant: {
    label: "Pôle Enfant",
    modules: [],
  },
  pro: {
    label: "Pôle Pro",
    modules: [],
  },
};

// Composant module draggable dans la zone de composition
function SortableModule({ id, label, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const FormComponent = getIdentiteForm(id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-module-wrapper${expanded ? " expanded" : ""}`}
    >
      <div className="sortable-module">
        <span {...attributes} {...listeners} className="drag-handle">
          ⠿
        </span>
        {FormComponent ? (
          <button
            className="module-expand-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            <span className="expand-arrow">{expanded ? "▾" : "▸"}</span>
            <span className="module-label">{label}</span>
          </button>
        ) : (
          <span className="module-label">{label}</span>
        )}
        <button onClick={() => onRemove(id)} className="remove-btn">
          ✕
        </button>
      </div>
      {expanded && FormComponent && (
        <div className="module-form-container">
          <FormComponent />
        </div>
      )}
    </div>
  );
}

// Composant module dans le panneau gauche
function ModuleBox({ module, onAdd, onAddSub }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="module-box">
      <div className="module-box-header" onClick={() => setOpen(!open)}>
        <span>
          {open ? "▾" : "▸"} {module.label}
        </span>
        {!module.obligatoire && (
          <span className="badge-optionnel">optionnel</span>
        )}
        {module.sousModules === null && (
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(module);
            }}
          >
            +
          </button>
        )}
      </div>

      {open && module.sousModules && (
        <div className="sous-modules">
          <button
            className="add-btn-all"
            onClick={() =>
              module.sousModules.forEach((s) => onAddSub(s, module.id))
            }
          >
            + Tout ajouter
          </button>
          {module.sousModules.map((sub) => (
            <div key={sub.id} className="sous-module-item">
              <span>{sub.label}</span>
              <button
                className="add-btn"
                onClick={() => onAddSub(sub, module.id)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modal consentement
function ConsentementModal({ onConfirm, onRefuse }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">⚠️</div>
        <h3>Attention</h3>
        <p>
          L'inclusion des attentes des aidants nécessite le{" "}
          <strong>consentement explicite de la personne</strong> ou un cadre
          juridique établi (tutelle, curatelle).
        </p>
        <p>Confirmez-vous l'ajout de cette section ?</p>
        <div className="modal-actions">
          <button className="btn-confirmer" onClick={onConfirm}>
            Confirmer
          </button>
          <button className="btn-ignorer" onClick={onRefuse}>
            Ignorer cette section
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [poleActif, setPoleActif] = useState("adulte");
  const [composition, setComposition] = useState([]);
  const [showConsentement, setShowConsentement] = useState(false);
  const [modulePendant, setModulePendant] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const modules = POLES[poleActif].modules;

  const ajouterModule = (module) => {
    if (module.consentement) {
      setModulePendant(module);
      setShowConsentement(true);
      return;
    }
    if (!composition.find((m) => m.id === module.id)) {
      setComposition([...composition, { id: module.id, label: module.label }]);
    }
  };

  const ajouterSousModule = (sub, parentId) => {
    const compositeId = `${parentId}__${sub.id}`;
    if (!composition.find((m) => m.id === compositeId)) {
      setComposition([...composition, { id: compositeId, label: sub.label }]);
    }
  };

  const supprimerModule = (id) => {
    setComposition(composition.filter((m) => m.id !== id));
  };

  const handleConsentementConfirm = () => {
    setShowConsentement(false);
    if (modulePendant && !composition.find((m) => m.id === modulePendant.id)) {
      setComposition([
        ...composition,
        { id: modulePendant.id, label: modulePendant.label },
      ]);
    }
    setModulePendant(null);
  };

  const handleConsentementRefuse = () => {
    setShowConsentement(false);
    setModulePendant(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = composition.findIndex((m) => m.id === active.id);
      const newIndex = composition.findIndex((m) => m.id === over.id);
      setComposition(arrayMove(composition, oldIndex, newIndex));
    }
  };

  return (
    <div className="app">
      {/* Barre du haut */}
      <header className="header">
        <h1>Projet Personnalisé</h1>
        <select
          className="pole-select"
          value={poleActif}
          onChange={(e) => {
            setPoleActif(e.target.value);
            setComposition([]);
          }}
        >
          <option value="adulte">Pôle Adulte</option>
          <option value="enfant">Pôle Enfant</option>
          <option value="pro">Pôle Pro</option>
        </select>
      </header>

      <div className="main">
        {/* Panneau gauche */}
        <aside className="sidebar">
          <h2>Modules disponibles</h2>
          {modules.map((module) => (
            <ModuleBox
              key={module.id}
              module={module}
              onAdd={ajouterModule}
              onAddSub={ajouterSousModule}
            />
          ))}
        </aside>

        {/* Zone de composition */}
        <main className="composition">
          <h2>Composition du projet</h2>
          {composition.length === 0 && (
            <p className="placeholder">
              Ajoutez des modules depuis le panneau gauche pour composer votre
              projet.
            </p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={composition.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {composition.map((module) => (
                <SortableModule
                  key={module.id}
                  id={module.id}
                  label={module.label}
                  onRemove={supprimerModule}
                />
              ))}
            </SortableContext>
          </DndContext>
        </main>
      </div>

      {/* Modal consentement */}
      {showConsentement && (
        <ConsentementModal
          onConfirm={handleConsentementConfirm}
          onRefuse={handleConsentementRefuse}
        />
      )}
    </div>
  );
}
