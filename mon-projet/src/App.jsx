import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getIdentiteForm } from "./IdentiteModules";

// Légende des groupes couleur
const GROUPES = [
  { id: 1, label: "Identité et éléments du parcours" },
  { id: 2, label: "Analyse des attentes et besoins" },
  { id: 3, label: "Projet" },
  { id: 4, label: "Vie quotidienne" },
];

// Configuration des modules par pôle
const POLES = {
  adulte: {
    label: "Pôle Adulte",
    modules: [
      {
        id: "identite",
        label: "Identité et éléments du parcours",
        obligatoire: true,
        groupe: 1,
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
        id: "recueil_attentes",
        label: "Recueil des attentes",
        obligatoire: true,
        groupe: 2,
        sousModules: [
          { id: "personne", label: "Attentes de la personne" },
          { id: "proches_aidants", label: "Attentes des proches aidants", consentement: true },
          { id: "representant_legal", label: "Attentes du représentant légal", consentement: true },
        ],
      },
      {
        id: "analyse_equipe",
        label: "Analyse de l'équipe pluriprofessionnelle",
        obligatoire: true,
        groupe: 2,
        sousModules: [
          { id: "medical", label: "Médical", repeatable: true },
          { id: "paramedical", label: "Paramédical", repeatable: true },
          { id: "psychologique", label: "Suivi psychologique", repeatable: true },
          { id: "social", label: "Social", repeatable: true },
          { id: "educatif", label: "Éducatif", repeatable: true },
          { id: "loisirs", label: "Loisirs", repeatable: true },
        ],
      },
      {
        id: "objectifs",
        label: "Objectifs et moyens à mettre en œuvre",
        obligatoire: true,
        groupe: 3,
        sousModules: null,
      },
      {
        id: "parcours_futur",
        label: "Éléments du parcours futur",
        obligatoire: true,
        groupe: 3,
        sousModules: null,
      },
      {
        id: "reseau",
        label: "Réseau et partenaires",
        obligatoire: true,
        groupe: 3,
        sousModules: null,
      },
      {
        id: "bilan",
        label: "Bilan et évaluation",
        obligatoire: true,
        groupe: 3,
        sousModules: null,
      },
      {
        id: "habitudes_vie",
        label: "Habitudes de vie",
        obligatoire: false,
        groupe: 4,
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

// Élément draggable depuis la palette (colonne gauche)
function DraggableTextItem() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: "PALETTE_TEXT",
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`palette-text-item${isDragging ? " is-dragging" : ""}`}
    >
      <span className="palette-text-icon">¶</span>
      <div className="palette-text-content">
        <div className="palette-text-label">Texte libre</div>
        <div className="palette-text-hint">Glisser pour ajouter une note</div>
      </div>
      <span className="drag-handle palette-drag-handle">⠿</span>
    </div>
  );
}

// Composant module draggable dans la zone de composition
function SortableModule({ id, label, groupe, isTexteLibre, texte, onRemove, onUpdateTexte }) {
  const [expanded, setExpanded] = useState(id === "objectifs");
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const FormComponent = isTexteLibre ? null : getIdentiteForm(id);
  const groupeClass = groupe ? ` groupe-${groupe}` : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-module-wrapper${expanded ? " expanded" : ""}${groupeClass}${isTexteLibre ? " texte-libre-wrapper" : ""}`}
    >
      <div className={`sortable-module${isTexteLibre ? " texte-libre-module" : ""}`}>
        <span {...attributes} {...listeners} className="drag-handle">
          ⠿
        </span>
        {isTexteLibre ? (
          <textarea
            className="texte-libre-input"
            placeholder="Précisez votre pensée ici…"
            value={texte}
            onChange={(e) => onUpdateTexte(id, e.target.value)}
            rows={2}
          />
        ) : FormComponent ? (
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
  const groupeClass = module.groupe ? ` groupe-${module.groupe}` : "";

  return (
    <div className={`module-box${groupeClass}`}>
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
              module.sousModules
                .filter((s) => !s.consentement)
                .forEach((s) => onAddSub(s, module.id, module.groupe))
            }
          >
            + Tout ajouter
          </button>
          {module.sousModules.map((sub) => (
            <div key={sub.id} className="sous-module-item">
              <span>{sub.label}</span>
              <button
                className="add-btn"
                onClick={() => onAddSub(sub, module.id, module.groupe)}
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
  const [activeDragId, setActiveDragId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  // Zone de dépôt pour la composition (utile quand vide)
  const { setNodeRef: setCompositionRef } = useDroppable({
    id: "composition-zone",
  });

  const modules = POLES[poleActif].modules;

  const ajouterModule = (module) => {
    if (module.consentement) {
      setModulePendant(module);
      setShowConsentement(true);
      return;
    }
    if (!composition.find((m) => m.id === module.id)) {
      setComposition([
        ...composition,
        { id: module.id, label: module.label, groupe: module.groupe },
      ]);
    }
  };

  const ajouterSousModule = (sub, parentId, groupe) => {
    if (sub.consentement) {
      setModulePendant({ ...sub, parentId, groupe, isSub: true });
      setShowConsentement(true);
      return;
    }
    if (sub.repeatable) {
      const uniqueId = `${parentId}__${sub.id}__${Date.now()}`;
      setComposition((prev) => [
        ...prev,
        { id: uniqueId, label: sub.label, groupe },
      ]);
    } else {
      const compositeId = `${parentId}__${sub.id}`;
      if (!composition.find((m) => m.id === compositeId)) {
        setComposition([
          ...composition,
          { id: compositeId, label: sub.label, groupe },
        ]);
      }
    }
  };

  const supprimerModule = (id) => {
    setComposition(composition.filter((m) => m.id !== id));
  };

  const updateTexte = (id, texte) => {
    setComposition((prev) => prev.map((m) => (m.id === id ? { ...m, texte } : m)));
  };

  const handleConsentementConfirm = () => {
    setShowConsentement(false);
    if (modulePendant) {
      if (modulePendant.isSub) {
        const compositeId = `${modulePendant.parentId}__${modulePendant.id}`;
        if (!composition.find((m) => m.id === compositeId)) {
          setComposition([
            ...composition,
            { id: compositeId, label: modulePendant.label, groupe: modulePendant.groupe },
          ]);
        }
      } else if (!composition.find((m) => m.id === modulePendant.id)) {
        setComposition([
          ...composition,
          { id: modulePendant.id, label: modulePendant.label, groupe: modulePendant.groupe },
        ]);
      }
    }
    setModulePendant(null);
  };

  const handleConsentementRefuse = () => {
    setShowConsentement(false);
    setModulePendant(null);
  };

  const handleDragStart = ({ active }) => {
    setActiveDragId(active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (!over) return;

    // Cas 1 : dépôt d'un élément texte libre depuis la palette
    if (active.id === "PALETTE_TEXT") {
      const newId = `texte_libre__${Date.now()}`;
      const newItem = { id: newId, label: "Texte libre", groupe: null, texte: "" };

      setComposition((prev) => {
        if (over.id === "composition-zone") {
          return [...prev, newItem];
        }
        const overIndex = prev.findIndex((m) => m.id === over.id);
        if (overIndex !== -1) {
          const updated = [...prev];
          updated.splice(overIndex + 1, 0, newItem);
          return updated;
        }
        return [...prev, newItem];
      });
      return;
    }

    // Cas 2 : réordonnancement des éléments de la composition
    if (active.id !== over.id) {
      setComposition((prev) => {
        const oldIndex = prev.findIndex((m) => m.id === active.id);
        const newIndex = prev.findIndex((m) => m.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prev, oldIndex, newIndex);
        }
        return prev;
      });
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="main">
          {/* Panneau gauche */}
          <aside className="sidebar">
            <h2>Modules disponibles</h2>

            {/* Élément texte libre — glissable à volonté */}
            <div className="sidebar-palette-section">
              <DraggableTextItem />
            </div>

            {(() => {
              const groups = {};
              modules.forEach((m) => {
                const g = m.groupe ?? 0;
                if (!groups[g]) groups[g] = [];
                groups[g].push(m);
              });
              return Object.entries(groups).map(([gId, gModules]) => {
                const groupeInfo = GROUPES.find((g) => g.id === Number(gId));
                return (
                  <div key={gId} className={`sidebar-group groupe-${gId}`}>
                    {groupeInfo && (
                      <div className="sidebar-group-header">{groupeInfo.label}</div>
                    )}
                    {gModules.map((module) => (
                      <ModuleBox
                        key={module.id}
                        module={module}
                        onAdd={ajouterModule}
                        onAddSub={ajouterSousModule}
                      />
                    ))}
                  </div>
                );
              });
            })()}
          </aside>

          {/* Zone de composition */}
          <main className="composition" ref={setCompositionRef}>
            <h2>Composition du projet</h2>
            {composition.length === 0 && (
              <p className={`placeholder${activeDragId === "PALETTE_TEXT" ? " drop-hint" : ""}`}>
                {activeDragId === "PALETTE_TEXT"
                  ? "Déposez la note ici"
                  : "Ajoutez des modules depuis le panneau gauche pour composer votre projet."}
              </p>
            )}
            <SortableContext
              items={composition.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {composition.map((module, index) => {
                // Le texte libre hérite la couleur du bloc précédent dans la mise en page
                let effectiveGroupe = module.groupe;
                if (module.id.startsWith("texte_libre__")) {
                  for (let i = index - 1; i >= 0; i--) {
                    if (!composition[i].id.startsWith("texte_libre__")) {
                      effectiveGroupe = composition[i].groupe;
                      break;
                    }
                  }
                }

                return (
                  <SortableModule
                    key={module.id}
                    id={module.id}
                    label={module.label}
                    groupe={effectiveGroupe}
                    isTexteLibre={module.id.startsWith("texte_libre__")}
                    texte={module.texte || ""}
                    onRemove={supprimerModule}
                    onUpdateTexte={updateTexte}
                  />
                );
              })}
            </SortableContext>
          </main>
        </div>

        {/* Aperçu visuel pendant le glisser-déposer */}
        <DragOverlay>
          {activeDragId === "PALETTE_TEXT" && (
            <div className="palette-text-item is-overlay">
              <span className="palette-text-icon">¶</span>
              <div className="palette-text-content">
                <div className="palette-text-label">Texte libre</div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
