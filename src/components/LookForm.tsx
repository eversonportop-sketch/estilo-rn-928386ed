import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { OCASIOES } from "@/types/wardrobe";
import type { Look, PecaGuardaRoupa, Ocasiao } from "@/types/wardrobe";

interface LookFormProps {
  onSave: (look: Omit<Look, "id">) => void;
  onClose: () => void;
  pecas: PecaGuardaRoupa[];
  initial?: Look;
  criadoPor: "estrategista" | "cliente";
}

export default function LookForm({ onSave, onClose, pecas, initial, criadoPor }: LookFormProps) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [ocasiao, setOcasiao] = useState<Ocasiao>((initial?.ocasiao as Ocasiao) ?? "Trabalho");
  const [selectedPecas, setSelectedPecas] = useState<string[]>(initial?.pecas ?? []);
  const [observacao, setObservacao] = useState(initial?.observacao ?? "");

  const togglePeca = (id: string) => {
    setSelectedPecas((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || selectedPecas.length === 0) return;
    onSave({ nome: nome.trim(), ocasiao, pecas: selectedPecas, observacao, criadoPor });
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
          className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="font-display text-2xl font-light">{initial ? "Editar Look" : "Criar Look"}</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Nome do look</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Ex: Power Meeting"
                required
              />
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
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Selecionar peças ({selectedPecas.length} selecionada{selectedPecas.length !== 1 ? "s" : ""})
              </label>
              {pecas.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhuma peça no guarda-roupa.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                  {pecas.map((peca) => {
                    const selected = selectedPecas.includes(peca.id);
                    return (
                      <button
                        key={peca.id}
                        type="button"
                        onClick={() => togglePeca(peca.id)}
                        className={`relative p-3 rounded-xl border text-left text-xs transition-all ${
                          selected
                            ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                            : "border-border hover:border-gold/30"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gold-gradient flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                        <span className="font-medium block truncate">{peca.nome}</span>
                        <span className="text-muted-foreground">{peca.categoria}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Observação estratégica</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                placeholder="Notas sobre este look..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={selectedPecas.length === 0}
                className="flex-1 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium disabled:opacity-40"
              >
                {initial ? "Salvar Alterações" : "Criar Look"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
