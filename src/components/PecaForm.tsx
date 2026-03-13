import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { CATEGORIAS, OCASIOES, CORES_COMUNS } from "@/types/wardrobe";
import type { PecaGuardaRoupa, Categoria, Ocasiao } from "@/types/wardrobe";

interface PecaFormProps {
  onSave: (peca: Omit<PecaGuardaRoupa, "id">) => void;
  onClose: () => void;
  initial?: PecaGuardaRoupa;
  criadoPor: "estrategista" | "cliente";
}

export default function PecaForm({ onSave, onClose, initial, criadoPor }: PecaFormProps) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [categoria, setCategoria] = useState<Categoria>(initial?.categoria ?? "Blusas");
  const [cor, setCor] = useState(initial?.cor ?? "");
  const [ocasiao, setOcasiao] = useState<Ocasiao>(initial?.ocasiao ?? "Trabalho");
  const [observacao, setObservacao] = useState(initial?.observacao ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSave({ nome: nome.trim(), categoria, cor, ocasiao, observacao, criadoPor });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="font-display text-2xl font-light">{initial ? "Editar Peça" : "Adicionar Peça"}</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Photo placeholder */}
            <div className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-muted/30 cursor-pointer hover:border-gold/40 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">Foto da peça (em breve)</span>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Nome da peça</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Ex: Blazer Alfaiataria"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as Categoria)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Cor</label>
                <select
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="">Selecione</option>
                  {CORES_COMUNS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Ocasião</label>
              <select
                value={ocasiao}
                onChange={(e) => setOcasiao(e.target.value as Ocasiao)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {OCASIOES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Observações</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                placeholder="Notas estratégicas sobre a peça..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium">
                {initial ? "Salvar Alterações" : "Adicionar Peça"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
