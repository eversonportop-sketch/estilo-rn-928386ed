import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useWardrobeContext } from "@/contexts/WardrobeContext";
import { OCASIOES } from "@/types/wardrobe";
import type { Look } from "@/types/wardrobe";
import LookForm from "@/components/LookForm";
import SmartLookGenerator from "@/components/SmartLookGenerator";
import EmptyState from "@/components/EmptyState";

const FILTROS_OCASIAO = ["Todos", ...OCASIOES] as const;

export default function ClientLooks() {
  const { looks, pecas, addLook, updateLook, deleteLook, getPecaById, generateSmartLook } = useWardrobeContext();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [showSmartGen, setShowSmartGen] = useState(false);
  const [editingLook, setEditingLook] = useState<Look | undefined>();

  const looksEstrategista = looks.filter((l) => l.criadoPor === "estrategista");
  const looksCliente = looks.filter((l) => l.criadoPor === "cliente");
  const applyFilter = (list: Look[]) => activeFilter === "Todos" ? list : list.filter((l) => l.ocasiao === activeFilter);

  const handleSave = (data: Omit<Look, "id">) => {
    if (editingLook) updateLook(editingLook.id, data);
    else addLook(data);
    setEditingLook(undefined);
  };

  const handleEdit = (look: Look) => {
    if (look.criadoPor !== "cliente") return;
    setEditingLook(look);
    setShowForm(true);
  };

  const renderLookCard = (look: Look, i: number, canEdit: boolean) => (
    <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-luxury overflow-hidden group">
      <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
        <span className="text-5xl opacity-20">✨</span>
        {canEdit && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleEdit(look)} className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-gold/40 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => deleteLook(look.id)} className="p-2 rounded-lg bg-card/90 border border-border/50 hover:border-destructive/40 transition-colors text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-xl">{look.nome}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-dark">{look.ocasiao}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {look.pecas.map((pid) => {
            const peca = getPecaById(pid);
            return peca ? <span key={pid} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{peca.nome}</span> : null;
          })}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{look.observacao}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${look.criadoPor === "estrategista" ? "bg-gold/10 text-gold-dark" : "bg-muted text-muted-foreground"}`}>
          {look.criadoPor === "estrategista" ? "Criado pela estrategista" : "Criado por mim"}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-display font-light mb-1">Meus Looks</h1>
          <p className="text-muted-foreground text-sm">Looks montados especialmente para você</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSmartGen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-gold/40 text-sm transition-colors">
            <Sparkles className="w-4 h-4" /> Gerar Look Inteligente
          </button>
          <button onClick={() => { setEditingLook(undefined); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm">
            <Plus className="w-4 h-4" /> Criar Look
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
        {FILTROS_OCASIAO.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeFilter === f ? "gold-gradient text-primary-foreground" : "border border-border hover:border-gold/40"}`}>
            {f}
          </button>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl font-light mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" /> Looks recomendados pela estrategista
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applyFilter(looksEstrategista).length === 0 ? (
            <EmptyState title="Nenhum look recomendado ainda." subtitle="Sua estrategista ainda não criou looks para você." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
          ) : applyFilter(looksEstrategista).map((look, i) => renderLookCard(look, i, false))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-light mb-6">Looks criados por mim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applyFilter(looksCliente).length === 0 ? (
            <EmptyState title="Nenhum look criado ainda." subtitle="Crie seu primeiro look." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
          ) : applyFilter(looksCliente).map((look, i) => renderLookCard(look, i, true))}
        </div>
      </section>

      {showForm && <LookForm onSave={handleSave} onClose={() => { setShowForm(false); setEditingLook(undefined); }} pecas={pecas} initial={editingLook} criadoPor="cliente" />}
      {showSmartGen && <SmartLookGenerator onSave={handleSave} onClose={() => setShowSmartGen(false)} generateSmartLook={generateSmartLook} criadoPor="cliente" />}
    </div>
  );
}
