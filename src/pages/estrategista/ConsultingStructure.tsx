import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, 
  Settings, ToggleLeft, ToggleRight, Edit2, Check, X
} from "lucide-react";
import { defaultConsultingStages, ConsultingStage, ConsultingField, FieldType } from "@/types/consultingStructure";

const fieldTypeLabels: Record<FieldType, string> = {
  texto_curto: "Texto curto",
  texto_longo: "Texto longo",
  selecao_unica: "Seleção única",
  multipla_escolha: "Múltipla escolha",
  escala: "Escala",
  upload_imagem: "Upload de imagem",
  observacao: "Campo de observação",
};

export default function ConsultingStructure() {
  const [stages, setStages] = useState<ConsultingStage[]>(defaultConsultingStages);
  const [expandedStage, setExpandedStage] = useState<string | null>("1");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showNewStageForm, setShowNewStageForm] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const toggleStageActive = (id: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const moveStage = (id: string, dir: "up" | "down") => {
    setStages(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((dir === "up" && idx === 0) || (dir === "down" && idx === prev.length - 1)) return prev;
      const newStages = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      [newStages[idx], newStages[swapIdx]] = [newStages[swapIdx], newStages[idx]];
      return newStages.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const deleteStage = (id: string) => {
    setStages(prev => prev.filter(s => s.id !== id));
  };

  const startEditName = (stage: ConsultingStage) => {
    setEditingStageId(stage.id);
    setEditingName(stage.name);
  };

  const saveEditName = (id: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, name: editingName } : s));
    setEditingStageId(null);
  };

  const addNewStage = () => {
    if (!newStageName.trim()) return;
    const newStage: ConsultingStage = {
      id: Date.now().toString(),
      name: newStageName.trim(),
      isActive: true,
      order: stages.length + 1,
      fields: [],
    };
    setStages(prev => [...prev, newStage]);
    setNewStageName("");
    setShowNewStageForm(false);
  };

  const addField = (stageId: string, type: FieldType) => {
    const newField: ConsultingField = {
      id: Date.now().toString(),
      label: "Nova pergunta",
      type,
      options: (type === "selecao_unica" || type === "multipla_escolha") 
        ? [{ id: "1", label: "Opção 1" }, { id: "2", label: "Opção 2" }] 
        : undefined,
    };
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, fields: [...s.fields, newField] } : s));
  };

  const updateFieldLabel = (stageId: string, fieldId: string, label: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? {
      ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, label } : f)
    } : s));
  };

  const deleteField = (stageId: string, fieldId: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? {
      ...s, fields: s.fields.filter(f => f.id !== fieldId)
    } : s));
  };

  const addOption = (stageId: string, fieldId: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? {
      ...s, fields: s.fields.map(f => f.id === fieldId ? {
        ...f, options: [...(f.options || []), { id: Date.now().toString(), label: "Nova opção" }]
      } : f)
    } : s));
  };

  const updateOption = (stageId: string, fieldId: string, optionId: string, label: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? {
      ...s, fields: s.fields.map(f => f.id === fieldId ? {
        ...f, options: (f.options || []).map(o => o.id === optionId ? { ...o, label } : o)
      } : f)
    } : s));
  };

  const deleteOption = (stageId: string, fieldId: string, optionId: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? {
      ...s, fields: s.fields.map(f => f.id === fieldId ? {
        ...f, options: (f.options || []).filter(o => o.id !== optionId)
      } : f)
    } : s));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-display font-light mb-1">Estrutura da Consultoria</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Configure as etapas e perguntas da sua metodologia</p>
          </div>
          <button
            onClick={() => setShowNewStageForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nova Etapa
          </button>
        </div>
      </motion.div>

      {showNewStageForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-4 md:p-6 mb-6">
          <h3 className="font-display text-base md:text-lg mb-4">Criar Nova Etapa</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              placeholder="Nome da etapa..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            <div className="flex gap-2">
              <button onClick={addNewStage} className="px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm hover:opacity-90 transition-opacity">
                Criar
              </button>
              <button onClick={() => setShowNewStageForm(false)} className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted/50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`card-luxury overflow-hidden transition-opacity ${!stage.isActive ? "opacity-60" : ""}`}
          >
            {/* Stage Header */}
            <div className="p-4 md:p-5 flex items-center gap-2 md:gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab hidden sm:block" />
              
              <div className="flex flex-col gap-1 mr-1">
                <button 
                  onClick={() => moveStage(stage.id, "up")} 
                  disabled={idx === 0}
                  className="p-0.5 hover:text-gold disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => moveStage(stage.id, "down")} 
                  disabled={idx === stages.length - 1}
                  className="p-0.5 hover:text-gold disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              <span className="text-xs text-gold font-medium w-5 shrink-0">{idx + 1}</span>

              <div className="flex-1 min-w-0">
                {editingStageId === stage.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gold/30 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-gold/40"
                      autoFocus
                    />
                    <button onClick={() => saveEditName(stage.id)} className="p-1 text-green-600 hover:opacity-80">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingStageId(null)} className="p-1 text-muted-foreground hover:opacity-80">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm md:text-base truncate">{stage.name}</span>
                    {stage.description && (
                      <span className="text-[10px] text-muted-foreground hidden md:inline truncate">— {stage.description}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  {stage.fields.length} campo{stage.fields.length !== 1 ? "s" : ""}
                </span>
                <button 
                  onClick={() => startEditName(stage)} 
                  className="p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold transition-colors"
                  title="Editar nome"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => toggleStageActive(stage.id)} 
                  className={`p-1.5 rounded-lg transition-colors ${stage.isActive ? "text-gold hover:bg-gold/10" : "text-muted-foreground hover:bg-muted"}`}
                  title={stage.isActive ? "Desativar" : "Ativar"}
                >
                  {stage.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => deleteStage(stage.id)} 
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  title="Excluir etapa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {expandedStage === stage.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stage Fields */}
            {expandedStage === stage.id && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="border-t border-border/50 px-4 md:px-5 py-4 space-y-3 bg-muted/20"
              >
                {stage.fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum campo adicionado. Use os botões abaixo para adicionar perguntas.
                  </p>
                )}

                {stage.fields.map((field) => (
                  <div key={field.id} className="card-luxury p-3 md:p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateFieldLabel(stage.id, field.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
                        />
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          {fieldTypeLabels[field.type]}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteField(stage.id, field.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {(field.type === "selecao_unica" || field.type === "multipla_escolha") && (
                      <div className="pl-2 space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Opções</p>
                        {(field.options || []).map((opt) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-${field.type === "selecao_unica" ? "full" : "sm"} border border-gold/30 shrink-0`} />
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateOption(stage.id, field.id, opt.id, e.target.value)}
                              className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-gold/30"
                            />
                            <button 
                              onClick={() => deleteOption(stage.id, field.id, opt.id)}
                              className="p-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addOption(stage.id, field.id)}
                          className="text-xs text-gold hover:underline flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Adicionar opção
                        </button>
                      </div>
                    )}

                    {field.type === "escala" && (
                      <div className="flex gap-2 pl-2">
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-xs text-muted-foreground">{n}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Field Buttons */}
                <div className="pt-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Settings className="w-3 h-3" /> Adicionar campo
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(fieldTypeLabels) as FieldType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => addField(stage.id, type)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-gold/40 hover:bg-gold/5 transition-colors"
                      >
                        + {fieldTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {stages.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-display text-xl mb-2">Nenhuma etapa configurada</p>
          <p className="text-sm">Crie a primeira etapa da sua consultoria.</p>
        </div>
      )}
    </div>
  );
}
