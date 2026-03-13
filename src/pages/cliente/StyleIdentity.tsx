import { motion } from "framer-motion";
import { User } from "lucide-react";
import { defaultStyles } from "@/types/consultingStructure";

export default function ClientStyleIdentity() {
  const predominant = defaultStyles.find(s => s.name === "Sofisticada")!;
  const secondary = defaultStyles.find(s => s.name === "Contemporânea")!;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Identidade de Estilo</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">Sua personalidade de moda definida pela análise de estilo</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6 md:p-8">
          <span className="text-3xl md:text-4xl mb-3 block">{predominant.icon}</span>
          <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-1">Estilo Predominante</p>
          <h2 className="font-display text-2xl md:text-3xl mb-2">{predominant.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{predominant.description}</p>
          <div className="flex flex-wrap gap-2">
            {predominant.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">{tag}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-luxury p-6 md:p-8 opacity-80">
          <span className="text-3xl md:text-4xl mb-3 block">{secondary.icon}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Estilo Secundário</p>
          <h2 className="font-display text-2xl md:text-3xl mb-2">{secondary.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{secondary.description}</p>
          <div className="flex flex-wrap gap-2">
            {secondary.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border">{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-luxury p-6 md:p-8">
        <h2 className="font-display text-lg md:text-xl mb-6">Todos os Estilos da Metodologia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {defaultStyles.map((style) => {
            const isActive = style.name === predominant.name || style.name === secondary.name;
            return (
              <div
                key={style.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  style.name === predominant.name
                    ? "border-gold/60 bg-gold/10"
                    : style.name === secondary.name
                    ? "border-gold/30 bg-gold/5"
                    : "border-border/40 opacity-50"
                }`}
              >
                <span className="text-xl md:text-2xl block mb-1">{style.icon}</span>
                <p className="text-xs font-medium">{style.name}</p>
                {style.name === predominant.name && (
                  <span className="text-[9px] text-gold block mt-1">Predominante</span>
                )}
                {style.name === secondary.name && (
                  <span className="text-[9px] text-muted-foreground block mt-1">Secundário</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
