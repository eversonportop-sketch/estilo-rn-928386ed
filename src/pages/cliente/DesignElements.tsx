import { motion } from "framer-motion";
import { Shapes, Loader2 } from "lucide-react";
import { useClientDesignElements } from "@/hooks/useDesignElements";
import { getActiveClientId } from "@/hooks/useActiveClient";
import EmptyState from "@/components/EmptyState";

export default function ClientDesignElements() {
  const clientId = getActiveClientId();
  const { data: elements, isLoading } = useClientDesignElements(clientId ?? undefined);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando elementos...</span>
      </div>
    );
  }

  // Group elements by categoria
  const grouped = (elements || []).reduce<Record<string, typeof elements>>((acc, el) => {
    const cat = el.categoria || "Outros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(el);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

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

      {categories.length === 0 ? (
        <EmptyState
          title="Nenhum elemento de design registrado"
          subtitle="Sua estrategista ainda não registrou seus elementos de design."
          icon={<Shapes className="w-7 h-7 text-muted-foreground/40" />}
        />
      ) : (
        <div className="space-y-6">
          {categories.map((category, groupIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.08 }}
            >
              <h2 className="font-display text-base md:text-lg gold-text mb-3">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {grouped[category]!.map((item) => (
                  <div key={item.id} className="card-luxury p-4 md:p-5">
                    <p className="font-display text-sm md:text-base mb-1">{item.descricao}</p>
                    {item.observacao && (
                      <p className="text-xs text-muted-foreground italic">{item.observacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
