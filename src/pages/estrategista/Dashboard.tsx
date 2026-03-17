import { motion } from "framer-motion";
import { Users, TrendingUp, Shirt, Image, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useClients } from "@/hooks/useClients";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useTotalLooks() {
  return useQuery({
    queryKey: ["looks_count_all"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("looks")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function useTotalWardrobeItems() {
  return useQuery({
    queryKey: ["wardrobe_items_count_all"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("wardrobe_items")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export default function StrategistDashboard() {
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: totalLooks } = useTotalLooks();
  const { data: totalItems } = useTotalWardrobeItems();

  const totalClients = clients?.length ?? 0;
  const activeClients = clients?.filter((c) => c.status === "ativo").length ?? 0;
  const recentClients = (clients || []).slice(0, 4);

  const stats = [
    { label: "Total de Clientes", value: String(totalClients), icon: Users },
    { label: "Consultorias Ativas", value: String(activeClients), icon: TrendingUp },
    { label: "Peças Cadastradas", value: String(totalItems ?? 0), icon: Shirt },
    { label: "Looks Criados", value: String(totalLooks ?? 0), icon: Image },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-display font-light mb-1">Painel</h1>
        <p className="text-muted-foreground text-sm mb-10">Visão geral da sua consultoria de imagem</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="card-luxury p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-gold" />
            </div>
            <p className="text-3xl font-display font-light">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-display font-light mb-6">Clientes Recentes</h2>
        {loadingClients ? (
          <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
          </div>
        ) : recentClients.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhum cliente cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentClients.map((client, i) => (
              <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }} className="card-luxury p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-lg">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <span className="text-xs bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/20 capitalize">
                    {client.status || "novo"}
                  </span>
                </div>
                {client.profession && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="text-foreground font-medium">Profissão:</span> {client.profession}
                  </p>
                )}
                {client.objective && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-foreground font-medium">Objetivo:</span> {client.objective}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/estrategista/clientes/${client.id}`} className="text-xs px-4 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">Ver Perfil</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
