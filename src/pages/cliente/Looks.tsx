import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useLooks } from "@/hooks/useLooks";
import { useWardrobeItems } from "@/hooks/useWardrobeItems";
import { getActiveClientId } from "@/hooks/useActiveClient";
import EmptyState from "@/components/EmptyState";
import { useState } from "react";
import { OCASIOES } from "@/types/wardrobe";

const FILTROS_OCASIAO = ["Todos", ...OCASIOES] as const;

export default function ClientLooks() {
  const clientId = getActiveClientId();
  const { data: looks, isLoading: looksLoading } = useLooks(clientId ?? undefined);
  const { data: wardrobeItems } = useWardrobeItems(clientId ?? undefined);
  const [activeFilter, setActiveFilter] = useState("Todos");

  const getPecaName = (id: string) => wardrobeItems?.find(p => p.id === id)?.name ?? null;

  const looksEstrategista = (looks || []).filter(l => l.created_by_role === "estrategista");
  const looksCliente = (looks || []).filter(l => l.created_by_role === "cliente");
  const applyFilter = (list: typeof looks) =>
    activeFilter === "Todos" ? (list || []) : (list || []).filter(l => l.name?.includes(activeFilter));

  if (looksLoading) {
    return (
      <div className="p-8 lg:p-12 max-w-6xl flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando looks...</span>
      </div>
    );
  }

  const renderLookCard = (look: any, i: number) => (
    <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-luxury overflow-hidden group">
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-5xl opacity-20">✨</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-xl">{look.nome}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-dark">{look.ocasiao}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(look.pecas || []).map((pid: string) => {
            const name = getPecaName(pid);
            return name ? <span key={pid} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{name}</span> : null;
          })}
        </div>
        {look.observacao && <p className="text-xs text-muted-foreground mb-2">{look.observacao}</p>}
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${look.criado_por === "estrategista" ? "bg-gold/10 text-gold-dark" : "bg-muted text-muted-foreground"}`}>
          {look.criado_por === "estrategista" ? "Criado pela estrategista" : "Criado por mim"}
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
          ) : applyFilter(looksEstrategista).map((look, i) => renderLookCard(look, i))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-light mb-6">Looks criados por mim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applyFilter(looksCliente).length === 0 ? (
            <EmptyState title="Seu guarda-roupa estratégico ainda não possui looks cadastrados." subtitle="Quando você ou sua estrategista criarem looks, eles aparecerão aqui." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
          ) : applyFilter(looksCliente).map((look, i) => renderLookCard(look, i))}
        </div>
      </section>
    </div>
  );
}
