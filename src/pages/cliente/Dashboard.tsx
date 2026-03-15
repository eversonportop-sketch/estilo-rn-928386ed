import { motion } from "framer-motion";
import { Palette, Star, Target, Eye, Sparkles } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getActiveClientId } from "@/hooks/useActiveClient";

function useDashboardData() {
  const clientId = getActiveClientId();

  const { data: clientData } = useQuery({
    queryKey: ['dashboard_client', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data } = await supabase.from('clients').select('name').eq('id', clientId!).maybeSingle();
      return data;
    },
  });

  const { data: styles } = useQuery({
    queryKey: ['dashboard_styles', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data } = await supabase
        .from('client_style_profiles')
        .select('style_profiles ( name )')
        .eq('client_id', clientId!);
      return (data || []).map((item: any) => item.style_profiles?.name).filter(Boolean);
    },
  });

  const { data: palette } = useQuery({
    queryKey: ['dashboard_palette', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data } = await supabase
        .from('client_color_palettes')
        .select('season_name')
        .eq('client_id', clientId!)
        .maybeSingle();
      return data?.season_name ?? null;
    },
  });

  const { data: analysis } = useQuery({
    queryKey: ['dashboard_analysis', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data } = await supabase
        .from('client_strategic_analysis')
        .select('image_objective')
        .eq('client_id', clientId!)
        .maybeSingle();
      return data?.image_objective ?? null;
    },
  });

  const { data: looks } = useQuery({
    queryKey: ['dashboard_looks', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data } = await supabase
        .from('looks')
        .select('id, nome, ocasiao, observacao, criado_por')
        .eq('client_id', clientId!)
        .eq('criado_por', 'estrategista')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  return {
    clientName: clientData?.name ?? null,
    predominantStyle: styles?.[0] ?? null,
    secondaryStyle: styles?.[1] ?? null,
    palette,
    objective: analysis,
    looksRecomendados: looks ?? [],
  };
}

export default function ClientDashboard() {
  const { clientName, predominantStyle, secondaryStyle, palette, objective, looksRecomendados } = useDashboardData();

  const cards = [
    { label: "Estilo Predominante", value: predominantStyle || "Ainda não definido", icon: Star },
    { label: "Estilo Secundário", value: secondaryStyle || "Ainda não definido", icon: Eye },
    { label: "Paleta de Cores", value: palette || "Ainda não definida", icon: Palette },
    { label: "Objetivo de Imagem", value: objective || "Ainda não definido", icon: Target },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-light mb-1">
          {clientName ? `Bem-vinda, ${clientName}` : "Bem-vinda"}
        </h1>
        <p className="text-muted-foreground text-sm mb-10">Sua estratégia de imagem personalizada</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-luxury p-6">
            <card.icon className="w-5 h-5 text-gold mb-3" />
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="font-display text-lg">{card.value}</p>
          </motion.div>
        ))}
      </div>



      <h2 className="text-2xl font-display font-light mb-6">Looks Recomendados para Você</h2>

      {looksRecomendados.length === 0 ? (
        <EmptyState title="Nenhum look recomendado ainda." subtitle="Sua estrategista ainda não criou looks para você." icon={<Sparkles className="w-7 h-7 text-muted-foreground/40" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {looksRecomendados.map((look: any, i: number) => (
            <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="card-luxury overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                <span className="text-4xl opacity-20">✨</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg mb-1">{look.nome}</h3>
                <span className="text-xs text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full">{look.ocasiao}</span>
                {look.observacao && <p className="text-xs text-muted-foreground mt-2">{look.observacao}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
