import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setActiveClientId } from "@/hooks/useActiveClient";
import { toast } from "sonner";
import rnLogo from "@/assets/rn-logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Preencha email e senha.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const userId = data.user.id;

      // Check if user is a strategist (has role)
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'strategist')
        .maybeSingle();

      if (role) {
        navigate("/estrategista");
        return;
      }

      // Check if user is a client
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (client) {
        setActiveClientId(client.id);
        navigate("/cliente");
        return;
      }

      // Fallback - no role found
      toast.error("Usuário sem permissão. Contate sua estrategista.");
      await supabase.auth.signOut();
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground relative overflow-hidden px-4">
      {/* Subtle gold line accent */}
      <div className="absolute top-0 left-0 w-full h-px gold-gradient opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-px gold-gradient opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 md:mb-10">
          <img src={rnLogo} alt="RN" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 object-contain" />
          <h1 className="text-sm md:text-base font-display tracking-[0.15em] md:tracking-[0.2em] text-primary-foreground">Consulting</h1>
          <p className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-primary-foreground/50 uppercase mt-2 leading-tight">
            Consultoria & Posicionamento<br />Estratégico de Imagem
          </p>
        </div>

        <div className="bg-card/5 backdrop-blur border border-primary-foreground/10 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-lg md:text-xl text-primary-foreground text-center mb-6">Entrar na Plataforma</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/40" 
              />
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-1.5">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/40" 
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Entrar
          </button>
        </div>

        <p className="text-center text-[10px] text-primary-foreground/30 mt-6 md:mt-8 tracking-wider">
          © 2026 RN — Todos os direitos reservados
        </p>
      </motion.div>
    </div>
  );
}
