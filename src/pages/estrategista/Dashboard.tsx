import { motion } from "framer-motion";
import { Users, TrendingUp, Shirt, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useWardrobeContext } from "@/contexts/WardrobeContext";

const recentClients = [
  { id: 1, nome: "Marina Oliveira", email: "marina@email.com", estilo: "Clássico Elegante", paleta: "Inverno Profundo", objetivo: "Autoridade Profissional", progresso: 75, etapas: { diagnostico: true, perfil: true, paleta: true, guardaroupa: true, looks: false } },
  { id: 2, nome: "Carolina Santos", email: "carolina@email.com", estilo: "Contemporâneo", paleta: "Primavera Clara", objetivo: "Modernidade", progresso: 45, etapas: { diagnostico: true, perfil: true, paleta: false, guardaroupa: false, looks: false } },
  { id: 3, nome: "Beatriz Lima", email: "beatriz@email.com", estilo: "Romântico", paleta: "Verão Suave", objetivo: "Elegância", progresso: 90, etapas: { diagnostico: true, perfil: true, paleta: true, guardaroupa: true, looks: true } },
  { id: 4, nome: "Ana Paula Costa", email: "ana@email.com", estilo: "Natural", paleta: "Outono Quente", objetivo: "Acessibilidade", progresso: 30, etapas: { diagnostico: true, perfil: false, paleta: false, guardaroupa: false, looks: false } },
];

const etapaLabels = [
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "perfil", label: "Perfil de estilo" },
  { key: "paleta", label: "Paleta de cores" },
  { key: "guardaroupa", label: "Guarda-roupa" },
  { key: "looks", label: "Looks criados" },
];

export default function StrategistDashboard() {
  const { pecas, looks } = useWardrobeContext();

  const stats = [
    { label: "Total de Clientes", value: "24", icon: Users, change: "+3 este mês" },
    { label: "Consultorias Ativas", value: "8", icon: TrendingUp, change: "5 concluídas" },
    { label: "Peças Cadastradas", value: String(pecas.length), icon: Shirt, change: `${pecas.filter(p => p.criadoPor === "estrategista").length} pela estrategista` },
    { label: "Looks Criados", value: String(looks.length), icon: Image, change: `${looks.filter(l => l.criadoPor === "estrategista").length} pela estrategista` },
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
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <p className="text-3xl font-display font-light">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-display font-light mb-6">Clientes Recentes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentClients.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }} className="card-luxury p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-lg">{client.nome}</h3>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <span className="text-xs bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/20">{client.estilo}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-muted-foreground">Paleta:</span><p className="font-medium">{client.paleta}</p></div>
                <div><span className="text-muted-foreground">Objetivo:</span><p className="font-medium">{client.objetivo}</p></div>
              </div>

              {/* Progress steps */}
              <div className="flex gap-1 mb-3">
                {etapaLabels.map(({ key, label }) => (
                  <div key={key} className="flex-1" title={label}>
                    <div className={`h-1.5 rounded-full ${(client.etapas as any)[key] ? "gold-gradient" : "bg-muted"}`} />
                    <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progresso da Consultoria</span>
                  <span className="text-gold-dark font-medium">{client.progresso}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gold-gradient rounded-full transition-all duration-500" style={{ width: `${client.progresso}%` }} />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link to={`/estrategista/clientes/${client.id}`} className="text-xs px-4 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">Ver Perfil</Link>
                <button className="text-xs px-4 py-2 rounded-lg gold-gradient text-primary-foreground hover:opacity-90 transition-opacity">Continuar Estratégia</button>
                <button className="text-xs px-4 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">Editar Paleta</button>
                <button className="text-xs px-4 py-2 rounded-lg border border-border hover:border-gold/40 transition-colors">Adicionar Look</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
