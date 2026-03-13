import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import rnLogo from "@/assets/rn-logo.png";

export default function LoginPage() {
  const navigate = useNavigate();

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
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/40" 
              />
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-1.5">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground text-sm placeholder:text-primary-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/40" 
              />
            </div>
          </div>

          <p className="text-xs text-primary-foreground/40 text-center mb-4">Selecione seu portal para demonstração:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/estrategista")}
              className="px-4 py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Área da Estrategista
            </button>
            <button
              onClick={() => navigate("/cliente")}
              className="px-4 py-3 rounded-xl border border-gold/30 text-gold text-sm font-medium hover:bg-gold/5 transition-colors"
            >
              Área da Cliente
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-primary-foreground/30 mt-6 md:mt-8 tracking-wider">
          © 2026 RN — Todos os direitos reservados
        </p>
      </motion.div>
    </div>
  );
}
