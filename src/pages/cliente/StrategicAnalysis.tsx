import { motion } from "framer-motion";
import { Target, FileText, Loader2 } from "lucide-react";
import { useClientStrategicAnalysis } from "@/hooks/useStrategicAnalysis";
import { getActiveClientId } from "@/hooks/useActiveClient";
import EmptyState from "@/components/EmptyState";

export default function ClientStrategicAnalysis() {
  const clientId = getActiveClientId();
  const { data: analysis, isLoading } = useClientStrategicAnalysis(clientId ?? undefined);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando análise...</span>
      </div>
    );
  }

  if (!analysis) {
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
        <EmptyState
          title="Análise ainda não registrada"
          subtitle="Sua estrategista ainda não registrou a análise estratégica de imagem."
          icon={<FileText className="w-7 h-7 text-muted-foreground/40" />}
        />
      </div>
    );
  }

  const sections = [
    { label: "Objetivo de Imagem", value: analysis.image_objective },
    { label: "Pontos Fortes", value: analysis.strengths },
    { label: "Desafios", value: analysis.challenges },
    { label: "Posicionamento", value: analysis.positioning },
    { label: "Marca Pessoal", value: analysis.personal_brand },
    { label: "Estilo de Vida", value: analysis.lifestyle },
    { label: "Profissão", value: analysis.profession },
    { label: "Objetivo de Comunicação", value: analysis.communication_objective },
    { label: "Recomendações", value: analysis.recommendations },
    { label: "Observações", value: analysis.notes },
  ].filter(s => s.value);

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
        {sections.map((section, idx) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="card-luxury p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-gold" />
              <h2 className="font-display text-lg md:text-xl">{section.label}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
