import { motion } from "framer-motion";
import { Palette, Star, Target, Eye, Sparkles, CheckCircle2, Circle, ClipboardList, FileText, User, Scan, Shapes, Image, Loader2 } from "lucide-react";
import { useWardrobeContext } from "@/contexts/WardrobeContext";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { useClientJourney } from "@/hooks/useClientJourney";

const journeySteps = [
  { label: "Anamnese", icon: ClipboardList, url: "/cliente/anamnese" },
  { label: "Análise Estratégica", icon: FileText, url: "/cliente/analise" },
  { label: "Morfologia", icon: Scan, url: "/cliente/morfologia" },
  { label: "Identidade de Estilo", icon: User, url: "/cliente/identidade-estilo" },
  { label: "Coloração", icon: Palette, url: "/cliente/coloracao" },
  { label: "Elementos de Design", icon: Shapes, url: "/cliente/elementos" },
  { label: "Composição de Looks", icon: Image, url: "/cliente/looks" },
];

export default function ClientDashboard() {
  const { looks, getPecaById } = useWardrobeContext();
  const { data: journey, isLoading: journeyLoading } = useClientJourney();
  const looksRecomendados = looks.filter((l) => l.criadoPor === "estrategista");

  const journeyStepKeys = ["anamnese", "analise", "morfologia", "identidade", "coloracao", "elementos", "looks"];
  const getStepCompleted = (key: string) => journey?.steps?.find(s => s.key === key)?.completed ?? false;
  const completedCount = journeyStepKeys.filter(getStepCompleted).length;

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-light mb-1">Bem-vinda, Marina</h1>
        <p className="text-muted-foreground text-sm mb-10">Sua estratégia de imagem personalizada</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Estilo Predominante", value: "Clássico Elegante", icon: Star },
          { label: "Estilo Secundário", value: "Contemporâneo", icon: Eye },
          { label: "Paleta de Cores", value: "Inverno Profundo", icon: Palette },
          { label: "Objetivo de Imagem", value: "Autoridade", icon: Target },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-luxury p-6">
            <card.icon className="w-5 h-5 text-gold mb-3" />
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="font-display text-lg">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Jornada da Consultoria */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-display font-light mb-6">Jornada da Consultoria</h2>
        <div className="card-luxury p-6 mb-12">
          {journeyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gold" />
              <span className="ml-2 text-sm text-muted-foreground">Carregando progresso...</span>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {journeySteps.map((step, i) => {
                  const completed = getStepCompleted(journeyStepKeys[i]);
                  return (
                    <Link
                      key={step.label}
                      to={step.url}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0">
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-gold" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <step.icon className={`w-4 h-4 flex-shrink-0 ${completed ? "text-gold" : "text-muted-foreground/50"}`} />
                      <span className={`text-sm font-body ${completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      {completed && (
                        <span className="ml-auto text-[10px] uppercase tracking-wider text-gold font-medium">Concluída</span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progresso geral</span>
                  <span className="text-gold font-medium">{completedCount} de 7 etapas</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${(completedCount / 7) * 100}%` }} />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <h2 className="text-2xl font-display font-light mb-6">Looks Recomendados para Você</h2>

      {looksRecomendados.length === 0 ? (
        <EmptyState title="Nenhum look recomendado ainda." subtitle="Sua estrategista ainda não criou looks para você." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {looksRecomendados.map((look, i) => (
            <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="card-luxury overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                <span className="text-4xl opacity-20">✨</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg mb-1">{look.nome}</h3>
                <span className="text-xs text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full">{look.ocasiao}</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {look.pecas.map((pid) => {
                    const peca = getPecaById(pid);
                    return peca ? (
                      <span key={pid} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{peca.nome}</span>
                    ) : null;
                  })}
                </div>
                {look.observacao && <p className="text-xs text-muted-foreground mt-2">{look.observacao}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
