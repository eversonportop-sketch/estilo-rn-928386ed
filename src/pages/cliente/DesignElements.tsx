import { motion } from "framer-motion";
import { Shapes } from "lucide-react";

const elements = [
  {
    category: "Linhas e Formas",
    items: [
      { label: "Linhas", value: "Retas e diagonais", note: "Transmitem autoridade e definição" },
      { label: "Formas", value: "Geométricas e estruturadas", note: "Peças de alfaiataria e blazers" },
    ],
  },
  {
    category: "Tecidos e Texturas",
    items: [
      { label: "Fibras Têxteis", value: "Seda, lã fria, crepe", note: "Tecidos nobres com bom caimento" },
      { label: "Texturas", value: "Lisas, sutilmente texturizadas", note: "Evite estampas chamativas" },
    ],
  },
  {
    category: "Acessórios",
    items: [
      { label: "Bolsas", value: "Estruturadas, clássicas", note: "Couro em preto ou marinho" },
      { label: "Sapatos", value: "Scarpins, mules e botas finas", note: "Salto médio a alto" },
      { label: "Joias", value: "Minimalistas em prata", note: "Menos é mais" },
      { label: "Carteiras", value: "Slim, couro de qualidade", note: "Tom neutro ou metálico" },
    ],
  },
  {
    category: "Visual",
    items: [
      { label: "Contraste", value: "Alto contraste é seu diferencial", note: "Preto com branco ou off-white" },
      { label: "Proporção Visual", value: "Equilibrada, verticalidade", note: "Peças que alongam a silhueta" },
    ],
  },
];

export default function ClientDesignElements() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Shapes className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Meus Elementos de Design</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Recomendações de linhas, formas, tecidos e acessórios para o seu estilo
        </p>
      </motion.div>

      <div className="space-y-6">
        {elements.map((group, groupIdx) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.08 }}
          >
            <h2 className="font-display text-base md:text-lg gold-text mb-3">{group.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div key={item.label} className="card-luxury p-4 md:p-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-display text-sm md:text-base mb-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground italic">{item.note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
