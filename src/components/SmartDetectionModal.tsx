import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, Trash2, Pencil, Sparkles } from "lucide-react";
import { CATEGORIAS, OCASIOES, CORES_COMUNS } from "@/types/wardrobe";
import type { PecaGuardaRoupa, Categoria, Ocasiao } from "@/types/wardrobe";

interface DetectedItem {
  nome: string;
  categoria: Categoria;
  cor: string;
  ocasiao: Ocasiao;
  observacao: string;
  confirmed: boolean;
  editing: boolean;
}

interface SmartDetectionModalProps {
  onSave: (items: Omit<PecaGuardaRoupa, "id">[]) => void;
  onClose: () => void;
  criadoPor: "estrategista" | "cliente";
  multiItem?: boolean;
}

export default function SmartDetectionModal({ onSave, onClose, criadoPor, multiItem = false }: SmartDetectionModalProps) {
  const [detecting, setDetecting] = useState(false);
  const [items, setItems] = useState<DetectedItem[]>([]);
  const [hasUploaded, setHasUploaded] = useState(false);

  const handleUpload = () => {
    setDetecting(true);
    setHasUploaded(true);
    // Mock AI detection
    setTimeout(() => {
      if (multiItem) {
        setItems([
          { nome: "Blazer Preto", categoria: "Terceiras Peças", cor: "Preto", ocasiao: "Trabalho", observacao: "Blazer estruturado detectado", confirmed: false, editing: false },
          { nome: "Camisa Branca", categoria: "Blusas", cor: "Branco", ocasiao: "Trabalho", observacao: "Camisa social clássica", confirmed: false, editing: false },
          { nome: "Calça Social Preta", categoria: "Calças", cor: "Preto", ocasiao: "Reunião", observacao: "Calça de alfaiataria", confirmed: false, editing: false },
          { nome: "Vestido Vermelho", categoria: "Vestidos", cor: "Vermelho", ocasiao: "Evento", observacao: "Vestido midi detectado", confirmed: false, editing: false },
        ]);
      } else {
        setItems([
          { nome: "Vestido Midi", categoria: "Vestidos", cor: "Preto", ocasiao: "Evento", observacao: "Vestido midi detectado automaticamente", confirmed: false, editing: false },
        ]);
      }
      setDetecting(false);
    }, 2000);
  };

  const toggleConfirm = (idx: number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, confirmed: !item.confirmed } : item));
  };

  const toggleEdit = (idx: number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, editing: !item.editing } : item));
  };

  const updateItem = (idx: number, data: Partial<DetectedItem>) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, ...data } : item));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const confirmed = items.filter((i) => i.confirmed).map(({ confirmed, editing, ...rest }) => ({ ...rest, criadoPor }));
    if (confirmed.length > 0) {
      onSave(confirmed);
      onClose();
    }
  };

  const confirmedCount = items.filter((i) => i.confirmed).length;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-display text-2xl font-light">
                {multiItem ? "Importar Roupas por Foto" : "Detecção Inteligente"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {!hasUploaded && (
              <div onClick={handleUpload}
                className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 bg-muted/30 cursor-pointer hover:border-gold/40 transition-colors">
                <Upload className="w-10 h-10 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">
                  {multiItem ? "Envie uma foto com várias peças" : "Envie uma foto da peça"}
                </span>
                <span className="text-xs text-muted-foreground/60">Clique para simular upload</span>
              </div>
            )}

            {detecting && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <p className="text-sm text-muted-foreground">Analisando imagem...</p>
              </div>
            )}

            {!detecting && items.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "peça detectada" : "peças detectadas"}. Confirme ou edite antes de salvar.
                </p>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className={`rounded-xl border p-4 transition-all ${item.confirmed ? "border-gold bg-gold/5" : "border-border"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display text-base">{item.nome}</h4>
                        <div className="flex gap-1.5">
                          <button onClick={() => toggleEdit(idx)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => removeItem(idx)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleConfirm(idx)}
                            className={`p-1.5 rounded-lg transition-colors ${item.confirmed ? "gold-gradient text-primary-foreground" : "border border-border hover:border-gold/40"}`}>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {!item.editing ? (
                        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-full bg-muted">{item.categoria}</span>
                          <span className="px-2 py-0.5 rounded-full bg-muted">{item.cor}</span>
                          <span className="px-2 py-0.5 rounded-full bg-muted">{item.ocasiao}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Nome</label>
                            <input value={item.nome} onChange={(e) => updateItem(idx, { nome: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Categoria</label>
                            <select value={item.categoria} onChange={(e) => updateItem(idx, { categoria: e.target.value as any })}
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs">
                              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Cor</label>
                            <select value={item.cor} onChange={(e) => updateItem(idx, { cor: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs">
                              {CORES_COMUNS.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Ocasião</label>
                            <select value={item.ocasiao} onChange={(e) => updateItem(idx, { ocasiao: e.target.value as any })}
                              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs">
                              {OCASIOES.map((o) => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={confirmedCount === 0}
                    className="flex-1 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium disabled:opacity-40">
                    Adicionar {confirmedCount} {confirmedCount === 1 ? "peça" : "peças"}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
