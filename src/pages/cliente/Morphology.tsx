import { motion } from "framer-motion";
import { Scan } from "lucide-react";
import { defaultSilhouettes } from "@/types/consultingStructure";

export default function ClientMorphology() {
  const assigned = defaultSilhouettes.find(s => s.name === "Silhueta Ampulheta X")!;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Scan className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Morfologia</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">Análise da sua silhueta corporal e recomendações estratégicas</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6 md:p-8 mb-6">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Silhueta Identificada</p>
        <h2 className="font-display text-2xl md:text-3xl mb-2">{assigned.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">{assigned.description}</p>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Recomendações Estratégicas</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {assigned.recommendations.map((rec) => (
              <div key={rec} className="card-luxury p-3 md:p-4 bg-muted/30 text-center">
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-lg md:text-xl mb-4">Silhuetas da Metodologia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {defaultSilhouettes.map((sil) => {
            const isAssigned = sil.id === assigned.id;
            return (
              <div
                key={sil.id}
                className={`card-luxury p-4 md:p-5 transition-all ${isAssigned ? "ring-1 ring-gold/40" : "opacity-60"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-sm">{sil.name}</h3>
                  {isAssigned && <span className="text-[10px] text-gold border border-gold/30 px-2 py-0.5 rounded-full">Sua silhueta</span>}
                </div>
                <p className="text-xs text-muted-foreground">{sil.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
