import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { OCASIOES } from "@/types/wardrobe";

interface InspiracaoFormProps {
  onSave: (data: { ocasiao: string; notaEstilo: string }) => void;
  onClose: () => void;
}

export default function InspiracaoForm({ onSave, onClose }: InspiracaoFormProps) {
  const [ocasiao, setOcasiao] = useState("Trabalho");
  const [notaEstilo, setNotaEstilo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notaEstilo.trim()) return;
    onSave({ ocasiao, notaEstilo: notaEstilo.trim() });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="font-display text-2xl font-light">Salvar Inspiração</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-muted/30 cursor-pointer hover:border-gold/40 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">Imagem de referência (em breve)</span>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Ocasião</label>
              <select value={ocasiao} onChange={(e) => setOcasiao(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                {[...OCASIOES, "Casual Sofisticado", "Fim de Semana"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Nota de estilo</label>
              <textarea value={notaEstilo} onChange={(e) => setNotaEstilo(e.target.value)} rows={3} required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                placeholder="Descreva a inspiração..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium">Salvar</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
