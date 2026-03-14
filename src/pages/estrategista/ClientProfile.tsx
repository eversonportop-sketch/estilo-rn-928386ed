import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Briefcase, Target, Loader2, ClipboardList, Palette, User, Ruler, Sparkles } from "lucide-react";
import { useClient } from "@/hooks/useClients";
import { useClientStrategicAnalysis } from "@/hooks/useStrategicAnalysis";
import { useClientMorphology } from "@/hooks/useMorphology";
import { useClientDesignElements } from "@/hooks/useDesignElements";
import { useLooks } from "@/hooks/useLooks";
import { useWardrobeItems } from "@/hooks/useWardrobeItems";

export default function ClientProfile() {
  const { id } = useParams();
  const { data: client, isLoading } = useClient(id);
  const { data: analysis } = useClientStrategicAnalysis(id);
  const { data: morphology } = useClientMorphology(id);
  const { data: designElements } = useClientDesignElements(id);
  const { data: looks } = useLooks(id);
  const { data: wardrobeItems } = useWardrobeItems(id);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando perfil...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <Link to="/estrategista/clientes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para Clientes
        </Link>
        <p className="text-muted-foreground">Cliente não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <Link to="/estrategista/clientes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Clientes
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-light mb-1">{client.name}</h1>
        <p className="text-muted-foreground text-sm mb-10">Ficha completa da cliente</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><User className="w-4 h-4 text-gold" /> Informações Pessoais</h2>
          <div className="space-y-3">
            {client.email && <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-gold" /><span>{client.email}</span></div>}
            {client.phone && <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-gold" /><span>{client.phone}</span></div>}
            {client.profession && <div className="flex items-center gap-3 text-sm"><Briefcase className="w-4 h-4 text-gold" /><span>{client.profession}</span></div>}
            {client.objective && <div className="flex items-center gap-3 text-sm"><Target className="w-4 h-4 text-gold" /><span>{client.objective}</span></div>}
          </div>
        </motion.div>

        {/* Strategic Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-gold" /> Análise Estratégica</h2>
          {analysis ? (
            <div className="space-y-2 text-sm">
              {analysis.objetivo_imagem && <p><span className="text-muted-foreground">Objetivo:</span> {analysis.objetivo_imagem}</p>}
              {analysis.pontos_fortes_visuais && <p><span className="text-muted-foreground">Pontos fortes:</span> {analysis.pontos_fortes_visuais}</p>}
              {analysis.estrategia_posicionamento && <p><span className="text-muted-foreground">Estratégia:</span> {analysis.estrategia_posicionamento}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Análise ainda não registrada.</p>
          )}
        </motion.div>

        {/* Morphology */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><Ruler className="w-4 h-4 text-gold" /> Morfologia</h2>
          {morphology ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Silhueta:</span> {morphology.silhouette_name}</p>
              {morphology.notes && <p><span className="text-muted-foreground">Notas:</span> {morphology.notes}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Morfologia ainda não registrada.</p>
          )}
        </motion.div>

        {/* Design Elements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-gold" /> Elementos de Design</h2>
          {designElements && designElements.length > 0 ? (
            <div className="space-y-2">
              {designElements.map(el => (
                <div key={el.id} className="text-sm">
                  <span className="text-gold text-xs">{el.categoria}</span>
                  <p>{el.descricao}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Elementos ainda não registrados.</p>
          )}
        </motion.div>

        {/* Summary Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-luxury p-6 lg:col-span-2">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> Resumo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display text-gold">{wardrobeItems?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Peças no Guarda-roupa</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-gold">{looks?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Looks Criados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-gold">{designElements?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Elementos de Design</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-gold">{analysis ? "✓" : "—"}</p>
              <p className="text-xs text-muted-foreground">Análise Estratégica</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
