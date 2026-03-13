import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, RefreshCw, Save } from "lucide-react";
import type { PecaGuardaRoupa, Look, Ocasiao } from "@/types/wardrobe";
import { OCASIOES } from "@/types/wardrobe";

interface SmartLookGeneratorProps {
  onSave: (look: Omit<Look, "id">) => void;
  onClose: () => void;
  generateSmartLook: () => { pecas: PecaGuardaRoupa[]; ocasiao: string } | null;
  criadoPor: "estrategista" | "cliente";
}

export default function SmartLookGenerator({ onSave, onClose, generateSmartLook, criadoPor }: SmartLookGeneratorProps) {
  const [generated, setGenerated] = useState<{ pecas: PecaGuardaRoupa[]; ocasiao: string } | null>(null);
  const [nome, setNome] = useState("");
  const [observacao, setObservacao] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const result = generateSmartLook();
      setGenerated(result);
      if (result) {
        setNome(`Look ${result.ocasiao}`);
        setObservacao(`Look gerado automaticamente para ${result.ocasiao.toLowerCase()}.`);
      }
      setGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    if (!generated || !nome.trim()) return;
    onSave({
      nome: nome.trim(),
      ocasiao: generated.ocasiao as Ocasiao,
      pecas: generated.pecas.map((p) => p.id),
      observacao,
      criadoPor,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-display text-2xl font-light">Gerar Look Inteligente</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {!generated && !generating && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
                <p className="text-sm text-muted-foreground mb-6">
                  O sistema vai selecionar peças compatíveis do seu guarda-roupa e sugerir um look completo.
                </p>
                <button onClick={handleGenerate} className="px-6 py-3 rounded-lg gold-gradient text-primary-foreground text-sm font-medium">
                  ✨ Gerar Look
                </button>
              </div>
            )}

            {generating && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Analisando combinações...</p>
              </div>
            )}

            {generated && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Peças selecionadas</label>
                  <div className="space-y-2">
                    {generated.pecas.map((peca) => (
                      <div key={peca.id} className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-gold/5">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">👗</div>
                        <div>
                          <p className="text-sm font-medium">{peca.nome}</p>
                          <p className="text-xs text-muted-foreground">{peca.categoria} • {peca.cor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-3 py-2 rounded-lg bg-gold/10 text-xs text-gold-dark">
                  Ocasião sugerida: <strong>{generated.ocasiao}</strong>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Nome do look</label>
                  <input value={nome} onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Observação</label>
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Gerar Outro
                  </button>
                  <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium">
                    <Save className="w-3.5 h-3.5" /> Salvar Look
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
