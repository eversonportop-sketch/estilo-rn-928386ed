import { motion } from "framer-motion";
import { Target, FileText } from "lucide-react";

const objectives = [
  { label: "Autoridade", desc: "Transmitir poder e liderança" },
  { label: "Elegância", desc: "Sofisticação e refinamento" },
  { label: "Acessibilidade", desc: "Proximidade e empatia" },
  { label: "Credibilidade", desc: "Confiança e profissionalismo" },
  { label: "Modernidade", desc: "Atualidade e inovação" },
  { label: "Confiança", desc: "Segurança e certeza" },
  { label: "Sofisticação", desc: "Luxo e distinção" },
  { label: "Praticidade", desc: "Funcionalidade e objetividade" },
];

export default function ClientStrategicAnalysis() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Análise Estratégica</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Seu posicionamento estratégico de imagem definido pela sua estrategista
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-gold" />
            <h2 className="font-display text-lg md:text-xl">Objetivos de Imagem</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {objectives.map((obj, idx) => (
              <motion.div
                key={obj.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className={`p-3 md:p-4 rounded-xl border text-center transition-all ${
                  ["Autoridade", "Credibilidade", "Sofisticação"].includes(obj.label)
                    ? "border-gold/50 bg-gold/5"
                    : "border-border/50 opacity-50"
                }`}
              >
                <p className="font-display text-sm md:text-base mb-1">{obj.label}</p>
                <p className="text-[10px] text-muted-foreground">{obj.desc}</p>
                {["Autoridade", "Credibilidade", "Sofisticação"].includes(obj.label) && (
                  <span className="inline-block mt-2 text-[9px] text-gold border border-gold/30 px-2 py-0.5 rounded-full">Selecionado</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-luxury p-6 md:p-8">
          <h2 className="font-display text-lg md:text-xl mb-4">Análise Estratégica da Consultora</h2>
          <div className="card-luxury p-4 md:p-5 bg-muted/30">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Com base na análise realizada, identifico uma profissional que busca transmitir autoridade e sofisticação, 
              mantendo credibilidade no ambiente corporativo. O posicionamento estratégico deve equilibrar poder e 
              acessibilidade, criando uma imagem forte mas não intimidadora. Recomendo peças de alfaiataria de qualidade, 
              paleta em tons profundos e acessórios estratégicos que ampliem a percepção de liderança."
            </p>
            <p className="text-xs text-gold mt-3">— Sua Estrategista de Imagem</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
