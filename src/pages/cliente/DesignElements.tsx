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

  const fields = [
    { key: "lines", label: "Linhas" },
    { key: "shapes", label: "Formas" },
    { key: "scale", label: "Escala" },
    { key: "contrast", label: "Contraste" },
    { key: "textures", label: "Texturas" },
    { key: "fabrics", label: "Tecidos" },
    { key: "prints", label: "Estampas" },
    { key: "accessories", label: "Acessórios" },
    { key: "recommendations", label: "Recomendações" },
    { key: "notes", label: "Observações" },
  ];

  const hasData = elements && Object.values(elements).some((v) => typeof v === "string" && v.trim() !== "");

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

      {!hasData ? (
        <EmptyState
          title="Nenhum elemento de design registrado"
          subtitle="Sua estrategista ainda não registrou seus elementos de design."
          icon={<Shapes className="w-7 h-7 text-muted-foreground/40" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label }) => {
            const value = elements?.[key as keyof typeof elements];
            if (!value) return null;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-luxury p-4 md:p-5"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <p className="font-display text-sm md:text-base">{value as string}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
