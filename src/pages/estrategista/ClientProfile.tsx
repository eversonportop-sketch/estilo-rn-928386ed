import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Briefcase, Target, Loader2 } from "lucide-react";
import { useClient } from "@/hooks/useClients";

export default function ClientProfile() {
  const { id } = useParams();
  const { data: client, isLoading } = useClient(id);

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4">Informações Pessoais</h2>
          <div className="space-y-3">
            {client.email && <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-gold" /><span>{client.email}</span></div>}
            {client.phone && <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-gold" /><span>{client.phone}</span></div>}
            {client.profession && <div className="flex items-center gap-3 text-sm"><Briefcase className="w-4 h-4 text-gold" /><span>{client.profession}</span></div>}
            {client.objective && <div className="flex items-center gap-3 text-sm"><Target className="w-4 h-4 text-gold" /><span>{client.objective}</span></div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-luxury p-6">
          <h2 className="font-display text-xl mb-4">Anotações da Estrategista</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Sem anotações.</p>
        </motion.div>
      </div>
    </div>
  );
}
