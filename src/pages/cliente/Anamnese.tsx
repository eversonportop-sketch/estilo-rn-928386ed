import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, ClipboardList } from "lucide-react";

const questions = [
  { id: "1", label: "Qual é a sua profissão?", type: "texto_curto", placeholder: "Ex: Advogada, Médica, Empresária..." },
  { id: "2", label: "Como você deseja ser percebida profissionalmente?", type: "texto_longo", placeholder: "Descreva como você quer que as pessoas te vejam no ambiente profissional..." },
  {
    id: "3",
    label: "Quais roupas você mais usa no dia a dia?",
    type: "multipla_escolha",
    options: ["Jeans e camiseta", "Vestidos", "Ternos/Alfaiataria", "Roupas esportivas", "Misto de estilos"],
  },
  { id: "4", label: "Qual é o seu objetivo com a consultoria?", type: "texto_longo", placeholder: "O que espera alcançar com a consultoria de imagem?" },
  {
    id: "5",
    label: "Como você se sente em relação ao seu guarda-roupa atual?",
    type: "escala",
    options: ["1 - Muito insatisfeita", "2", "3 - Neutro", "4", "5 - Muito satisfeita"],
  },
  { id: "6", label: "Existem eventos ou situações específicas para as quais você precisa de looks?", type: "texto_longo", placeholder: "Ex: Apresentações, casamentos, viagens corporativas..." },
];

export default function ClientAnamnese() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleText = (id: string, value: string) => setAnswers(prev => ({ ...prev, [id]: value }));
  const handleMultiple = (id: string, option: string) => {
    const current = (answers[id] as string[]) || [];
    const updated = current.includes(option) ? current.filter(x => x !== option) : [...current, option];
    setAnswers(prev => ({ ...prev, [id]: updated }));
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="p-4 md:p-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
          <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl mb-2">Anamnese Enviada!</h2>
          <p className="text-muted-foreground text-sm md:text-base">Suas respostas foram registradas. Sua estrategista irá analisar e dar continuidade à consultoria.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-6 h-6 text-gold" />
          <h1 className="text-2xl md:text-4xl font-display font-light">Minha Anamnese</h1>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-8 md:mb-10">
          Responda às perguntas abaixo para que sua estrategista possa criar uma consultoria totalmente personalizada para você.
        </p>
      </motion.div>

      <div className="space-y-6 md:space-y-8">
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="card-luxury p-4 md:p-6"
          >
            <label className="text-sm md:text-base font-medium block mb-3">
              <span className="text-gold font-display mr-2">{idx + 1}.</span>
              {q.label}
            </label>

            {q.type === "texto_curto" && (
              <input
                type="text"
                placeholder={q.placeholder}
                value={(answers[q.id] as string) || ""}
                onChange={e => handleText(q.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
              />
            )}

            {q.type === "texto_longo" && (
              <textarea
                placeholder={q.placeholder}
                value={(answers[q.id] as string) || ""}
                onChange={e => handleText(q.id, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-gold/40 resize-none"
              />
            )}

            {q.type === "multipla_escolha" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options!.map(opt => {
                  const selected = ((answers[q.id] as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleMultiple(q.id, opt)}
                      className={`px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                        selected ? "border-gold/50 bg-gold/10 text-foreground" : "border-border hover:border-gold/30 hover:bg-muted/30"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "escala" && (
              <div className="flex flex-col sm:flex-row gap-2">
                {[1, 2, 3, 4, 5].map(n => {
                  const selected = answers[q.id] === n.toString();
                  return (
                    <button
                      key={n}
                      onClick={() => handleText(q.id, n.toString())}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                        selected ? "border-gold gold-gradient text-primary-foreground" : "border-border hover:border-gold/30"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Enviar Respostas
        </button>
      </motion.div>
    </div>
  );
}
