import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { defaultPalettes } from "@/types/consultingStructure";

export default function ClientPersonalColoring() {
  const assignedPalette = defaultPalettes.find(p => p.name === "Inverno Profundo")!;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Coloração Pessoal</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Paleta de cores definida pela análise de coloração pessoal
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-gold font-medium uppercase tracking-wider">Paleta Atribuída</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl gold-text mb-2">{assignedPalette.name}</h2>
        <p className="text-sm text-muted-foreground mb-8">{assignedPalette.description}</p>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-8">
          {assignedPalette.colors.map((cor) => (
            <div key={cor.hex} className="text-center">
              <div
                className="aspect-square rounded-xl border border-border/50 shadow-sm mb-2"
                style={{ backgroundColor: cor.hex }}
              />
              <p className="text-xs font-medium">{cor.name}</p>
              <p className="text-[10px] text-muted-foreground">{cor.hex}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="card-luxury p-4 bg-muted/30">
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-2">Dicas de Uso</p>
            <p className="text-muted-foreground text-sm">{assignedPalette.tips}</p>
          </div>
          <div className="card-luxury p-4 bg-muted/30">
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-2">Metais Recomendados</p>
            <p className="text-muted-foreground text-sm">{assignedPalette.metals}</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-lg md:text-xl mb-4">Todas as Paletas da Metodologia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {defaultPalettes.map((palette) => {
            const isAssigned = palette.id === assignedPalette.id;
            return (
              <div
                key={palette.id}
                className={`card-luxury p-4 transition-all ${isAssigned ? "ring-1 ring-gold/40" : "opacity-60"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm">{palette.name}</h3>
                  {isAssigned && <span className="text-[10px] text-gold border border-gold/30 px-2 py-0.5 rounded-full">Sua paleta</span>}
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {palette.colors.map(c => (
                    <div
                      key={c.hex}
                      className="aspect-square rounded"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
