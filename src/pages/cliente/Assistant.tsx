import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useWardrobeContext } from "@/contexts/WardrobeContext";

const suggestedPrompts = [
  "Que look usar para uma reunião profissional?",
  "Como combinar calça preta?",
  "Que roupa usar para evento?",
  "Quais cores combinam com minha paleta?",
];

interface Message { role: "assistant" | "user"; content: string; suggestions?: string[] }

function generateResponse(input: string, context: { pecasNames: string[]; looksNames: string[] }): Message {
  const lower = input.toLowerCase();
  const { pecasNames, looksNames } = context;

  if (lower.includes("reunião") || lower.includes("profissional")) {
    return {
      role: "assistant",
      content: "Para uma reunião profissional, recomendo um look que transmita autoridade e elegância.\n\nBaseado no seu perfil **Clássico Elegante** e paleta **Inverno Profundo**, sugiro:",
      suggestions: ["Blazer de alfaiataria em tom escuro", "Camisa de seda off-white", "Calça reta de cintura alta", "Scarpin nude para alongamento visual"],
    };
  }
  if (lower.includes("calça preta") || lower.includes("combinar")) {
    return {
      role: "assistant",
      content: "A calça preta é uma peça coringa! Para seu perfil, ótimas combinações incluem:",
      suggestions: ["Com camisa de seda para o trabalho", "Com blazer para reuniões", "Com blusa estruturada para eventos", "Com peças em tons de marinho ou bordô da sua paleta"],
    };
  }
  if (lower.includes("evento")) {
    return {
      role: "assistant",
      content: "Para eventos, sua paleta Inverno Profundo brilha em tons impactantes:",
      suggestions: ["Vestido midi em bordô", "Acessórios em dourado", "Scarpin ou sandália de salto", "Bolsa estruturada como complemento"],
    };
  }
  if (lower.includes("cor") || lower.includes("paleta")) {
    return {
      role: "assistant",
      content: "Sua paleta **Inverno Profundo** favorece tons intensos e contrastantes:\n\n**Cores ideais:** Preto, marinho, bordô, off-white, cinza escuro\n**Metais:** Prata e ouro branco\n**Evitar:** Tons pastéis e amarelados",
    };
  }

  return {
    role: "assistant",
    content: `Baseado no seu perfil Clássico Elegante e na paleta Inverno Profundo, posso ajudar! Você tem **${pecasNames.length} peças** no guarda-roupa e **${looksNames.length} looks** montados.\n\nTente perguntar sobre combinações específicas, como looks para reunião, evento ou trabalho. ✨`,
  };
}

export default function ClientAssistant() {
  const { pecas, looks } = useWardrobeContext();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou sua **Assistente de Looks**.\n\nPosso ajudar com combinações de looks, sugestões de cores e recomendações personalizadas com base no seu perfil.\n\nO que gostaria de saber?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    const response = generateResponse(text, {
      pecasNames: pecas.map((p) => p.nome),
      looksNames: looks.map((l) => l.nome),
    });
    setMessages((prev) => [...prev, userMsg, response]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-8 pb-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-4xl font-display font-light mb-1">Assistente de Looks</h1>
          <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6">Sua consultora virtual de imagem</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-2xl ${msg.role === "user" ? "ml-auto" : ""}`}>
            <div className={`p-4 rounded-xl text-sm leading-relaxed ${msg.role === "assistant" ? "card-luxury" : "gold-gradient text-primary-foreground"}`}>
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={k}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              ))}
            </div>
            {msg.suggestions && (
              <div className="mt-2 space-y-1.5">
                {msg.suggestions.map((s, j) => (
                  <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/5 border border-gold/10 text-xs">
                    <Sparkles className="w-3 h-3 text-gold shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-8 pt-4">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {suggestedPrompts.map((prompt) => (
            <button key={prompt} onClick={() => sendMessage(prompt)} className="text-xs px-4 py-2 rounded-full border border-border hover:border-gold/40 whitespace-nowrap transition-colors">
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Digite sua pergunta..." className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-gold/40" />
          <button onClick={() => sendMessage(input)} className="px-4 py-3 rounded-xl gold-gradient text-primary-foreground hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
