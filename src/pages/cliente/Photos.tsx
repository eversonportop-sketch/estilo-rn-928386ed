import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Tag, Loader2 } from "lucide-react";
import { useWardrobeItems } from "@/hooks/useWardrobeItems";
import { getActiveClientId } from "@/hooks/useActiveClient";
import EmptyState from "@/components/EmptyState";

export default function ClientPhotos() {
  const clientId = getActiveClientId();
  const { data: items, isLoading } = useWardrobeItems(clientId ?? undefined);

  const [filter, setFilter] = useState("todos");

  const categories = Array.from(new Set((items || []).map(i => i.categoria))).filter(Boolean);
  const filtered = filter === "todos" ? (items || []) : (items || []).filter(p => p.categoria === filter);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando peças...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Camera className="w-6 h-6 text-gold" />
              <h1 className="text-2xl md:text-4xl font-display font-light">Minhas Fotos</h1>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm">Suas peças e referências de estilo</p>
          </div>
        </div>
      </motion.div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("todos")}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
              filter === "todos"
                ? "gold-gradient text-primary-foreground"
                : "border border-border hover:border-gold/40"
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
                filter === cat
                  ? "gold-gradient text-primary-foreground"
                  : "border border-border hover:border-gold/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="Você ainda não adicionou peças ao seu guarda-roupa"
          subtitle="Quando sua estrategista registrar peças, elas aparecerão aqui."
          icon={<Camera className="w-7 h-7 text-muted-foreground/40" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-luxury overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {item.foto ? (
                  <img src={item.foto} alt={item.nome} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base mb-1">{item.nome}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-gold" />
                  <span className="text-[10px] text-gold">{item.categoria}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.cor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.cor}</span>}
                  {item.ocasiao && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.ocasiao}</span>}
                </div>
                {item.observacao && <p className="text-xs text-muted-foreground mt-2">{item.observacao}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
