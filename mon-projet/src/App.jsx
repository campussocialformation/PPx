import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  MouseSensor,
  TouchSensor,
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
import { getIdentiteForm, PPContext } from "./IdentiteModules";
import { exporterWord } from "./wordExport";

// Légende des groupes couleur
const GROUPES = [
  { id: 1, label: "Identité et éléments du parcours" },
  { id: 2, label: "Analyse des attentes et besoins" },
  { id: 3, label: "Projet" },
  { id: 4, label: "Vie quotidienne" },
  { id: 5, label: "Bilans et évaluations" },
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
          { id: "orientation_pro", label: "Orientation pro.", repeatable: true },
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
        id: "reseau",
        label: "Réseau et partenaires",
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
      {
        id: "bilan",
        label: "Bilans et évaluations",
        obligatoire: true,
        groupe: 5,
        sousModules: [
          { id: "eval_objectifs_pp", label: "Évaluation des objectifs du PP" },
          { id: "eval_stage", label: "Évaluation de stage et accueil temporaire" },
          { id: "autres_evaluations", label: "Autres évaluations et bilans" },
        ],
      },
    ],
  },
  enfant: { label: "Pôle Enfant", modules: [] },
  pro: { label: "Pôle Pro", modules: [] },
};

// ─── Utilitaires localStorage ─────────────────────────────────────────────────

const LS_PROJECTS_KEY = "pp_projects";
const LS_ACTIVE_KEY = "pp_active_project_id";

function lsGetProjects() {
  try { return JSON.parse(localStorage.getItem(LS_PROJECTS_KEY) || "[]"); }
  catch { return []; }
}

function lsSaveProjects(projects) {
  try { localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(projects)); }
  catch {}
}

function newProjectId() { return `proj_${Date.now()}`; }

// ─── Élément draggable depuis la palette ──────────────────────────────────────

function DraggableTextItem() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: "PALETTE_TEXT" });
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

// ─── Module draggable dans la zone de composition ─────────────────────────────

function SortableModule({ id, label, groupe, isTexteLibre, texte, onRemove, onUpdateTexte }) {
  const [expanded, setExpanded] = useState(id === "objectifs");
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const FormComponent = isTexteLibre ? null : getIdentiteForm(id);
  const groupeClass = groupe ? ` groupe-${groupe}` : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-module-wrapper${expanded ? " expanded" : ""}${groupeClass}${isTexteLibre ? " texte-libre-wrapper" : ""}`}
    >
      <div className={`sortable-module${isTexteLibre ? " texte-libre-module" : ""}`}>
        <span {...attributes} {...listeners} className="drag-handle">⠿</span>
        {isTexteLibre ? (
          <textarea
            className="texte-libre-input"
            placeholder="Précisez votre pensée ici…"
            value={texte}
            onChange={(e) => onUpdateTexte(id, e.target.value)}
            rows={2}
          />
        ) : FormComponent ? (
          <button className="module-expand-btn" onClick={() => setExpanded((v) => !v)}>
            <span className="expand-arrow">{expanded ? "▾" : "▸"}</span>
            <span className="module-label">{label}</span>
          </button>
        ) : (
          <span className="module-label">{label}</span>
        )}
        <button onClick={() => onRemove(id)} className="remove-btn">✕</button>
      </div>
      {expanded && FormComponent && (
        <div className="module-form-container">
          <FormComponent moduleId={id} />
        </div>
      )}
    </div>
  );
}

// ─── Module dans le panneau gauche ────────────────────────────────────────────

function ModuleBox({ module, onAdd, onAddSub }) {
  const [open, setOpen] = useState(false);
  const groupeClass = module.groupe ? ` groupe-${module.groupe}` : "";

  return (
    <div className={`module-box${groupeClass}`}>
      <div className="module-box-header" onClick={() => setOpen(!open)}>
        <span>{open ? "▾" : "▸"} {module.label}</span>
        {!module.obligatoire && <span className="badge-optionnel">optionnel</span>}
        {module.sousModules === null && (
          <button className="add-btn" onClick={(e) => { e.stopPropagation(); onAdd(module); }}>+</button>
        )}
      </div>
      {open && module.sousModules && (
        <div className="sous-modules">
          <button
            className="add-btn-all"
            onClick={() => module.sousModules.filter((s) => !s.consentement).forEach((s) => onAddSub(s, module.id, module.groupe))}
          >
            + Tout ajouter
          </button>
          {module.sousModules.map((sub) => (
            <div key={sub.id} className="sous-module-item">
              <span>{sub.label}</span>
              <button className="add-btn" onClick={() => onAddSub(sub, module.id, module.groupe)}>+</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Modal consentement ───────────────────────────────────────────────────────

function ConsentementModal({ onConfirm, onRefuse }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">⚠️</div>
        <h3>Attention</h3>
        <p>
          L'inclusion des attentes des aidants nécessite le{" "}
          <strong>consentement explicite de la personne</strong> ou un cadre juridique établi (tutelle, curatelle).
        </p>
        <p>Confirmez-vous l'ajout de cette section ?</p>
        <div className="modal-actions">
          <button className="btn-confirmer" onClick={onConfirm}>Confirmer</button>
          <button className="btn-ignorer" onClick={onRefuse}>Ignorer cette section</button>
        </div>
      </div>
    </div>
  );
}

// ─── Zone de dépôt par groupe couleur ─────────────────────────────────────────

function GroupDropZone({ groupeId, label, items, activeDragGroupe, onRemove, onUpdateTexte }) {
  const { setNodeRef, isOver } = useDroppable({ id: `zone-groupe-${groupeId}` });
  const isTargeted = activeDragGroupe === groupeId || activeDragGroupe === "text";

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone groupe-${groupeId}${isTargeted ? " is-active-target" : ""}${isOver ? " is-over" : ""}`}
    >
      <div className="drop-zone-header">{label}</div>
      <SortableContext items={items.map((m) => m.id)} strategy={verticalListSortingStrategy}>
        <div className="drop-zone-content">
          {items.length === 0 && (
            <div className="drop-zone-empty">
              {isTargeted ? "↓ Déposez ici" : "Aucun module — utilisez le panneau gauche"}
            </div>
          )}
          {items.map((module) => (
            <SortableModule
              key={module.id}
              id={module.id}
              label={module.label}
              groupe={module.groupe}
              isTexteLibre={module.id.startsWith("texte_libre__")}
              texte={module.texte || ""}
              onRemove={onRemove}
              onUpdateTexte={onUpdateTexte}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── App principale ───────────────────────────────────────────────────────────

export default function App() {
  // État du projet actif
  const [poleActif, setPoleActif] = useState("adulte");
  const [composition, setComposition] = useState([]);
  const [formsData, setFormsDataState] = useState({});
  const [objectifsData, setObjectifsData] = useState([]);
  const [nomProjet, setNomProjet] = useState("Nouveau projet");
  const [projetActifId, setProjetActifId] = useState(null);

  // Gestion multi-projets
  const [projets, setProjets] = useState([]);
  const [showProjets, setShowProjets] = useState(false);
  const [editingNom, setEditingNom] = useState(false);
  const [nomTemp, setNomTemp] = useState("");

  // UI
  const [showConsentement, setShowConsentement] = useState(false);
  const [modulePendant, setModulePendant] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragGroupe, setActiveDragGroupe] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // setFormData pour les formulaires
  const setFormData = useCallback((moduleId, data) => {
    setFormsDataState((prev) => ({ ...prev, [moduleId]: data }));
  }, []);

  // Charger un projet depuis son objet complet
  const chargerProjet = useCallback((projet) => {
    setNomProjet(projet.nom || "Nouveau projet");
    setPoleActif(projet.poleActif || "adulte");
    setComposition(projet.composition || []);
    setFormsDataState(projet.formsData || {});
    setObjectifsData(projet.objectifsData || []);
    setProjetActifId(projet.id);
  }, []);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const stored = lsGetProjects();
    const activeId = localStorage.getItem(LS_ACTIVE_KEY);
    if (stored.length > 0) {
      const active = stored.find((p) => p.id === activeId) || stored[stored.length - 1];
      chargerProjet(active);
      setProjets(stored.map((p) => ({ id: p.id, nom: p.nom })));
    } else {
      const id = newProjectId();
      const defaut = { id, nom: "Nouveau projet", poleActif: "adulte", composition: [], formsData: {}, objectifsData: [] };
      lsSaveProjects([defaut]);
      localStorage.setItem(LS_ACTIVE_KEY, id);
      setProjetActifId(id);
      setProjets([{ id, nom: "Nouveau projet" }]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sauvegarde automatique debounced 800ms
  const saveRef = useRef(null);
  useEffect(() => {
    if (!projetActifId) return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      const stored = lsGetProjects();
      const idx = stored.findIndex((p) => p.id === projetActifId);
      const projetData = { id: projetActifId, nom: nomProjet, poleActif, composition, formsData, objectifsData };
      if (idx !== -1) stored[idx] = projetData;
      else stored.push(projetData);
      lsSaveProjects(stored);
      localStorage.setItem(LS_ACTIVE_KEY, projetActifId);
      setProjets(stored.map((p) => ({ id: p.id, nom: p.nom })));
    }, 800);
    return () => { if (saveRef.current) clearTimeout(saveRef.current); };
  }, [composition, formsData, objectifsData, nomProjet, poleActif, projetActifId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Créer un nouveau projet
  const creerProjet = () => {
    const id = newProjectId();
    const nouveau = { id, nom: "Nouveau projet", poleActif: "adulte", composition: [], formsData: {}, objectifsData: [] };
    const stored = lsGetProjects();
    stored.push(nouveau);
    lsSaveProjects(stored);
    localStorage.setItem(LS_ACTIVE_KEY, id);
    chargerProjet(nouveau);
    setProjets(stored.map((p) => ({ id: p.id, nom: p.nom })));
    setShowProjets(false);
  };

  // Switcher vers un autre projet
  const switcherProjet = (id) => {
    if (id === projetActifId) { setShowProjets(false); return; }
    const stored = lsGetProjects();
    const projet = stored.find((p) => p.id === id);
    if (projet) { chargerProjet(projet); setShowProjets(false); }
  };

  // Supprimer un projet
  const supprimerProjet = (id) => {
    const stored = lsGetProjects();
    const filtered = stored.filter((p) => p.id !== id);
    if (filtered.length === 0) {
      const newId = newProjectId();
      filtered.push({ id: newId, nom: "Nouveau projet", poleActif: "adulte", composition: [], formsData: {}, objectifsData: [] });
    }
    lsSaveProjects(filtered);
    if (id === projetActifId) chargerProjet(filtered[filtered.length - 1]);
    setProjets(filtered.map((p) => ({ id: p.id, nom: p.nom })));
  };

  // Renommer le projet actif
  const validerRenommage = () => {
    setNomProjet(nomTemp.trim() || "Nouveau projet");
    setEditingNom(false);
  };

  // Export Word
  const handleExportWord = async () => {
    await exporterWord(nomProjet, composition, formsData, objectifsData);
  };

  const modules = POLES[poleActif].modules;

  // Ajouter module
  const closeSidebarOnMobile = () => { if (window.innerWidth <= 768) setSidebarOpen(false); };

  const ajouterModule = (module) => {
    if (module.consentement) { setModulePendant(module); setShowConsentement(true); return; }
    if (!composition.find((m) => m.id === module.id)) {
      setComposition([...composition, { id: module.id, label: module.label, groupe: module.groupe }]);
      closeSidebarOnMobile();
    }
  };

  const ajouterSousModule = (sub, parentId, groupe) => {
    if (sub.consentement) { setModulePendant({ ...sub, parentId, groupe, isSub: true }); setShowConsentement(true); return; }
    if (sub.repeatable) {
      const uniqueId = `${parentId}__${sub.id}__${Date.now()}`;
      setComposition((prev) => [...prev, { id: uniqueId, label: sub.label, groupe }]);
    } else {
      const compositeId = `${parentId}__${sub.id}`;
      if (!composition.find((m) => m.id === compositeId)) {
        setComposition([...composition, { id: compositeId, label: sub.label, groupe }]);
      }
    }
    closeSidebarOnMobile();
  };

  const supprimerModule = (id) => setComposition(composition.filter((m) => m.id !== id));

  const updateTexte = (id, texte) =>
    setComposition((prev) => prev.map((m) => (m.id === id ? { ...m, texte } : m)));

  const handleConsentementConfirm = () => {
    setShowConsentement(false);
    if (modulePendant) {
      if (modulePendant.isSub) {
        const compositeId = `${modulePendant.parentId}__${modulePendant.id}`;
        if (!composition.find((m) => m.id === compositeId)) {
          setComposition([...composition, { id: compositeId, label: modulePendant.label, groupe: modulePendant.groupe }]);
        }
      } else if (!composition.find((m) => m.id === modulePendant.id)) {
        setComposition([...composition, { id: modulePendant.id, label: modulePendant.label, groupe: modulePendant.groupe }]);
      }
    }
    setModulePendant(null);
  };

  const handleConsentementRefuse = () => { setShowConsentement(false); setModulePendant(null); };

  // Drag & Drop
  const handleDragStart = ({ active }) => {
    setActiveDragId(active.id);
    if (active.id === "PALETTE_TEXT") {
      setActiveDragGroupe("text");
    } else {
      const module = composition.find((m) => m.id === active.id);
      setActiveDragGroupe(module?.groupe ?? null);
    }
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    setActiveDragGroupe(null);
    const { active, over } = event;
    if (!over) return;

    if (active.id === "PALETTE_TEXT") {
      const overId = String(over.id);
      let targetGroupe = null;
      if (overId.startsWith("zone-groupe-")) targetGroupe = Number(overId.replace("zone-groupe-", ""));
      else { const om = composition.find((m) => m.id === over.id); targetGroupe = om?.groupe ?? null; }
      const newId = `texte_libre__${Date.now()}`;
      const newItem = { id: newId, label: "Texte libre", groupe: targetGroupe, texte: "" };
      setComposition((prev) => {
        if (overId.startsWith("zone-groupe-")) return [...prev, newItem];
        const overIndex = prev.findIndex((m) => m.id === over.id);
        if (overIndex !== -1) { const u = [...prev]; u.splice(overIndex + 1, 0, newItem); return u; }
        return [...prev, newItem];
      });
      return;
    }

    if (active.id !== over.id) {
      const activeModule = composition.find((m) => m.id === active.id);
      const overId = String(over.id);
      let overGroupe;
      if (overId.startsWith("zone-groupe-")) overGroupe = Number(overId.replace("zone-groupe-", ""));
      else { const om = composition.find((m) => m.id === over.id); overGroupe = om?.groupe ?? null; }
      if (activeModule?.groupe !== overGroupe) return;
      setComposition((prev) => {
        const oldIndex = prev.findIndex((m) => m.id === active.id);
        const newIndex = prev.findIndex((m) => m.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) return arrayMove(prev, oldIndex, newIndex);
        return prev;
      });
    }
  };

  return (
    <PPContext.Provider value={{ objectifsData, setObjectifsData, formsData, setFormData }}>
      <div className="app">
        {/* Barre du haut */}
        <header className="header">
          <button
            className="btn-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Ouvrir le menu des modules"
          >
            ☰
          </button>
          <h1>Projet Personnalisé</h1>

          {/* Nom du projet + sélecteur de projets */}
          <div className="header-projet">
            {editingNom ? (
              <input
                className="projet-nom-input"
                value={nomTemp}
                autoFocus
                onChange={(e) => setNomTemp(e.target.value)}
                onBlur={validerRenommage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") validerRenommage();
                  if (e.key === "Escape") setEditingNom(false);
                }}
              />
            ) : (
              <button
                className="projet-nom-btn"
                onClick={() => { setNomTemp(nomProjet); setEditingNom(true); }}
                title="Cliquer pour renommer"
              >
                {nomProjet} ✎
              </button>
            )}

            <div className="projet-switcher-wrapper">
              <button
                className="btn-projets"
                onClick={() => setShowProjets((v) => !v)}
                title="Gérer les projets"
              >
                ▾ Projets ({projets.length})
              </button>
              {showProjets && (
                <div className="projets-dropdown">
                  {projets.map((p) => (
                    <div key={p.id} className={`projets-item${p.id === projetActifId ? " actif" : ""}`}>
                      <button className="projets-item-nom" onClick={() => switcherProjet(p.id)}>
                        {p.id === projetActifId ? "▶ " : ""}{p.nom}
                      </button>
                      {projets.length > 1 && (
                        <button
                          className="projets-item-del"
                          onClick={() => supprimerProjet(p.id)}
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="projets-nouveau" onClick={creerProjet}>
                    + Nouveau projet
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-export-word" onClick={handleExportWord} title="Exporter en Word (.docx)">
              ⬇ Word
            </button>
            <select
              className="pole-select"
              value={poleActif}
              onChange={(e) => { setPoleActif(e.target.value); setComposition([]); }}
            >
              <option value="adulte">Pôle Adulte</option>
              <option value="enfant">Pôle Enfant</option>
              <option value="pro">Pôle Pro</option>
            </select>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="main">
            {sidebarOpen && (
              <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}
            {/* Panneau gauche */}
            <aside className={`sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
              <div className="sidebar-mobile-header">
                <h2>Modules disponibles</h2>
                <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Fermer">✕</button>
              </div>
              <div className="sidebar-palette-section">
                <DraggableTextItem />
              </div>
              {(() => {
                const groups = {};
                modules.forEach((m) => { const g = m.groupe ?? 0; if (!groups[g]) groups[g] = []; groups[g].push(m); });
                return Object.entries(groups).map(([gId, gModules]) => {
                  const groupeInfo = GROUPES.find((g) => g.id === Number(gId));
                  return (
                    <div key={gId} className={`sidebar-group groupe-${gId}`}>
                      {groupeInfo && <div className="sidebar-group-header">{groupeInfo.label}</div>}
                      {gModules.map((module) => (
                        <ModuleBox key={module.id} module={module} onAdd={ajouterModule} onAddSub={ajouterSousModule} />
                      ))}
                    </div>
                  );
                });
              })()}
            </aside>

            {/* Zone de composition — key = projetActifId pour forcer remount si projet change */}
            <main className="composition" key={projetActifId}>
              <h2>Composition du projet</h2>
              {GROUPES.map((groupe) => (
                <GroupDropZone
                  key={groupe.id}
                  groupeId={groupe.id}
                  label={groupe.label}
                  items={composition.filter((m) => m.groupe === groupe.id)}
                  activeDragGroupe={activeDragGroupe}
                  onRemove={supprimerModule}
                  onUpdateTexte={updateTexte}
                />
              ))}
            </main>
          </div>

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

        {showConsentement && (
          <ConsentementModal onConfirm={handleConsentementConfirm} onRefuse={handleConsentementRefuse} />
        )}

        {/* Overlay pour fermer le dropdown projets */}
        {showProjets && <div className="dropdown-overlay" onClick={() => setShowProjets(false)} />}
      </div>
    </PPContext.Provider>
  );
}
