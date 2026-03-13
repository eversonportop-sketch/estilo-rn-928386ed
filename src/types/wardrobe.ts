export type Categoria = "Blusas" | "Calças" | "Vestidos" | "Sapatos" | "Acessórios" | "Terceiras Peças";
export type Ocasiao = "Trabalho" | "Reunião" | "Casual" | "Evento" | "Viagem" | "Dia a dia";
export type OrigemPeca = "estrategista" | "cliente";

export interface PecaGuardaRoupa {
  id: string;
  nome: string;
  categoria: Categoria;
  cor: string;
  ocasiao: Ocasiao;
  observacao: string;
  foto?: string;
  criadoPor: OrigemPeca;
}

export interface Look {
  id: string;
  nome: string;
  ocasiao: Ocasiao | string;
  pecas: string[]; // IDs das peças
  observacao: string;
  criadoPor: OrigemPeca;
}

export interface Inspiracao {
  id: string;
  imagem?: string;
  ocasiao: string;
  notaEstilo: string;
}

export interface PlanejamentoDia {
  dia: string;
  lookId: string | null;
}

export const CATEGORIAS: Categoria[] = ["Blusas", "Calças", "Vestidos", "Sapatos", "Acessórios", "Terceiras Peças"];
export const OCASIOES: Ocasiao[] = ["Trabalho", "Reunião", "Casual", "Evento", "Viagem", "Dia a dia"];
export const FILTRO_CATEGORIAS = ["Todas", ...CATEGORIAS] as const;
export const CORES_COMUNS = ["Preto", "Branco", "Off-white", "Marinho", "Bordô", "Bege", "Cinza", "Nude", "Azul", "Vermelho", "Verde", "Rosa"];
export const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const;
