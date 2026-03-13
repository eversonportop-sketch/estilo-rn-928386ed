import { useState } from "react";
import type { PecaGuardaRoupa, Look, OrigemPeca, Inspiracao, PlanejamentoDia } from "@/types/wardrobe";
import { DIAS_SEMANA } from "@/types/wardrobe";

const INITIAL_PECAS: PecaGuardaRoupa[] = [
  { id: "1", nome: "Blazer Alfaiataria", categoria: "Terceiras Peças", cor: "Preto", ocasiao: "Reunião", observacao: "Peça-chave para reuniões. Corte estruturado.", criadoPor: "estrategista" },
  { id: "2", nome: "Camisa Seda", categoria: "Blusas", cor: "Off-white", ocasiao: "Trabalho", observacao: "Versátil. Combina com paleta Inverno Profundo.", criadoPor: "estrategista" },
  { id: "3", nome: "Calça Reta", categoria: "Calças", cor: "Marinho", ocasiao: "Trabalho", observacao: "Corte clássico, cintura alta. Base do guarda-roupa.", criadoPor: "estrategista" },
  { id: "4", nome: "Vestido Midi", categoria: "Vestidos", cor: "Bordô", ocasiao: "Evento", observacao: "Para eventos e jantares. Tom impactante.", criadoPor: "cliente" },
  { id: "5", nome: "Scarpin", categoria: "Sapatos", cor: "Nude", ocasiao: "Trabalho", observacao: "Alongamento visual. Combina com tudo.", criadoPor: "estrategista" },
  { id: "6", nome: "Bolsa Estruturada", categoria: "Acessórios", cor: "Preto", ocasiao: "Dia a dia", observacao: "Tamanho médio, alça de corrente prateada.", criadoPor: "cliente" },
];

const INITIAL_LOOKS: Look[] = [
  { id: "1", nome: "Power Meeting", ocasiao: "Reunião", pecas: ["1", "2", "3", "5"], observacao: "Look de autoridade para reuniões importantes.", criadoPor: "estrategista" },
  { id: "2", nome: "Casual Friday", ocasiao: "Trabalho", pecas: ["2", "3", "6"], observacao: "Elegante sem ser formal.", criadoPor: "estrategista" },
  { id: "3", nome: "Gala Night", ocasiao: "Evento", pecas: ["4", "5", "6"], observacao: "Impactante para eventos noturnos.", criadoPor: "cliente" },
];

const INITIAL_INSPIRACOES: Inspiracao[] = [
  { id: "1", ocasiao: "Trabalho", notaEstilo: "Look executivo com blazer estruturado e calça de alfaiataria. Tons neutros com acessório dourado." },
  { id: "2", ocasiao: "Reunião", notaEstilo: "Vestido midi em tom sóbrio com scarpin. Elegância discreta para reuniões de negócio." },
  { id: "3", ocasiao: "Casual Sofisticado", notaEstilo: "Calça reta com blusa de seda e bolsa estruturada. Casual mas com acabamento premium." },
  { id: "4", ocasiao: "Evento", notaEstilo: "Vestido em tom impactante com acessórios statement. Para causar impressão em eventos." },
  { id: "5", ocasiao: "Viagem", notaEstilo: "Peças versáteis em tecidos confortáveis. Mix de looks que funcionam em diferentes ocasiões." },
  { id: "6", ocasiao: "Fim de Semana", notaEstilo: "Look relaxado mas elegante. Terceira peça leve com jeans de bom caimento." },
];

const INITIAL_PLANEJAMENTO: PlanejamentoDia[] = DIAS_SEMANA.map((dia) => ({ dia, lookId: null }));

export function useWardrobe() {
  const [pecas, setPecas] = useState<PecaGuardaRoupa[]>(INITIAL_PECAS);
  const [looks, setLooks] = useState<Look[]>(INITIAL_LOOKS);
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>(INITIAL_INSPIRACOES);
  const [planejamento, setPlanejamento] = useState<PlanejamentoDia[]>(INITIAL_PLANEJAMENTO);

  const addPeca = (peca: Omit<PecaGuardaRoupa, "id">) => {
    const newPeca = { ...peca, id: Date.now().toString() };
    setPecas((prev) => [...prev, newPeca]);
    return newPeca;
  };

  const addMultiplePecas = (items: Omit<PecaGuardaRoupa, "id">[]) => {
    const newPecas = items.map((p, i) => ({ ...p, id: (Date.now() + i).toString() }));
    setPecas((prev) => [...prev, ...newPecas]);
    return newPecas;
  };

  const updatePeca = (id: string, data: Partial<PecaGuardaRoupa>) => {
    setPecas((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePeca = (id: string) => {
    setPecas((prev) => prev.filter((p) => p.id !== id));
  };

  const addLook = (look: Omit<Look, "id">) => {
    const newLook = { ...look, id: Date.now().toString() };
    setLooks((prev) => [...prev, newLook]);
    return newLook;
  };

  const updateLook = (id: string, data: Partial<Look>) => {
    setLooks((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteLook = (id: string) => {
    setLooks((prev) => prev.filter((l) => l.id !== id));
  };

  const getPecaById = (id: string) => pecas.find((p) => p.id === id);

  const addInspiracao = (insp: Omit<Inspiracao, "id">) => {
    const newInsp = { ...insp, id: Date.now().toString() };
    setInspiracoes((prev) => [...prev, newInsp]);
    return newInsp;
  };

  const deleteInspiracao = (id: string) => {
    setInspiracoes((prev) => prev.filter((i) => i.id !== id));
  };

  const assignLookToDay = (dia: string, lookId: string | null) => {
    setPlanejamento((prev) => prev.map((p) => p.dia === dia ? { ...p, lookId } : p));
  };

  const generateSmartLook = (): { pecas: PecaGuardaRoupa[]; ocasiao: string } | null => {
    if (pecas.length < 2) return null;
    // Simple heuristic: pick compatible pieces from different categories
    const categoriesOrder: string[] = ["Blusas", "Calças", "Sapatos", "Acessórios", "Terceiras Peças", "Vestidos"];
    const selected: PecaGuardaRoupa[] = [];
    const usedCategories = new Set<string>();

    // Shuffle pecas for variety
    const shuffled = [...pecas].sort(() => Math.random() - 0.5);

    for (const peca of shuffled) {
      if (!usedCategories.has(peca.categoria) && selected.length < 4) {
        selected.push(peca);
        usedCategories.add(peca.categoria);
      }
    }

    if (selected.length < 2) return null;

    // Determine occasion by most common
    const ocasiaoCount: Record<string, number> = {};
    selected.forEach((p) => {
      ocasiaoCount[p.ocasiao] = (ocasiaoCount[p.ocasiao] || 0) + 1;
    });
    const ocasiao = Object.entries(ocasiaoCount).sort((a, b) => b[1] - a[1])[0][0];

    return { pecas: selected, ocasiao };
  };

  const detectClothingFromImage = (_imageUrl: string): Promise<Omit<PecaGuardaRoupa, "id" | "criadoPor">[]> => {
    // Mock detection - in production this would call an AI API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDetections: Omit<PecaGuardaRoupa, "id" | "criadoPor">[] = [
          { nome: "Blazer Preto", categoria: "Terceiras Peças", cor: "Preto", ocasiao: "Trabalho", observacao: "Blazer estruturado detectado" },
          { nome: "Camisa Branca", categoria: "Blusas", cor: "Branco", ocasiao: "Trabalho", observacao: "Camisa social clássica" },
          { nome: "Calça Social Preta", categoria: "Calças", cor: "Preto", ocasiao: "Reunião", observacao: "Calça de alfaiataria" },
        ];
        resolve(mockDetections);
      }, 1500);
    });
  };

  return {
    pecas, looks, inspiracoes, planejamento,
    addPeca, addMultiplePecas, updatePeca, deletePeca,
    addLook, updateLook, deleteLook, getPecaById,
    addInspiracao, deleteInspiracao,
    assignLookToDay, generateSmartLook, detectClothingFromImage,
  };
}
