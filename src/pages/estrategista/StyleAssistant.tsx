import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

const suggestedPrompts = [
  "Que look usar para uma reunião profissional?",
  "Quais cores combinam com a paleta da cliente?",
  "Como montar um look elegante?",
  "Que roupas combinam com o estilo identificado?",
];

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function StyleAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou a Assistente de Looks.\n\nPosso ajudar com combinações de looks, sugestões de cores e recomendações personalizadas com base no perfil das suas clientes.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "Obrigada pela sua pergunta! Para oferecer recomendações personalizadas, vou analisar o perfil de estilo e a paleta da cliente. Em breve terei uma sugestão completa para você. ✨" },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 md:p-8 pb-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-4xl font-display font-light mb-1">Assistente de Looks</h1>
          <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6">Inteligência artificial para consultoria de imagem</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-2xl ${msg.role === "user" ? "ml-auto" : ""}`}
          >
            <div className={`p-3 md:p-4 rounded-xl text-sm leading-relaxed ${
              msg.role === "assistant"
                ? "card-luxury"
                : "gold-gradient text-primary-foreground"
            }`}>
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 md:p-8 pt-4">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 md:px-4 py-2 rounded-full border border-border hover:border-gold/40 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-3 md:px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
          />
          <button 
            onClick={() => sendMessage(input)} 
            className="px-3 md:px-4 py-3 rounded-xl gold-gradient text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
