export type FieldType = 
  | 'texto_curto' 
  | 'texto_longo' 
  | 'selecao_unica' 
  | 'multipla_escolha' 
  | 'escala' 
  | 'upload_imagem' 
  | 'observacao';

export interface FieldOption {
  id: string;
  label: string;
}

export interface ConsultingField {
  id: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  required?: boolean;
}

export interface ConsultingStage {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  fields: ConsultingField[];
  order: number;
}

export interface StyleIdentity {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: { hex: string; name: string }[];
  metals: string;
  tips: string;
}

export interface BodySilhouette {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
}

export const defaultStyles: StyleIdentity[] = [
  { id: '1', name: 'Glamurosa', description: 'Luxo, brilho e sofisticação. Presença marcante em qualquer ambiente.', icon: '✨', tags: ['brilho', 'elegância', 'luxo'] },
  { id: '2', name: 'Natural', description: 'Autenticidade, conforto e simplicidade. Visual despretensioso e acessível.', icon: '🌿', tags: ['conforto', 'simplicidade', 'autenticidade'] },
  { id: '3', name: 'Artística', description: 'Criatividade, expressão e originalidade. Visual único e experimental.', icon: '🎨', tags: ['criatividade', 'originalidade', 'expressão'] },
  { id: '4', name: 'Teatral', description: 'Drama, impacto e presença de palco. Visual memorável e ousado.', icon: '🎭', tags: ['drama', 'impacto', 'ousadia'] },
  { id: '5', name: 'Jovial', description: 'Frescor, energia e dinamismo. Visual moderno e descontraído.', icon: '⚡', tags: ['energia', 'juventude', 'dinamismo'] },
  { id: '6', name: 'Nostálgica', description: 'Charme vintage, referências históricas. Elegância atemporal.', icon: '🕰️', tags: ['vintage', 'retrô', 'clássico'] },
  { id: '7', name: 'Ponderado', description: 'Equilíbrio, discrição e neutralidade. Visual versátil e adaptável.', icon: '⚖️', tags: ['equilíbrio', 'discrição', 'versatilidade'] },
  { id: '8', name: 'Contemporânea', description: 'Modernidade, tendências atuais. Visual urbano e atualizado.', icon: '🏙️', tags: ['moderno', 'urbano', 'atual'] },
  { id: '9', name: 'Sofisticada', description: 'Refinamento, qualidade e atenção aos detalhes. Elegância intencional.', icon: '💎', tags: ['refinamento', 'qualidade', 'detalhes'] },
  { id: '10', name: 'Inovadora', description: 'Vanguarda, tecnologia e futuro. Visual que desafia convenções.', icon: '🚀', tags: ['vanguarda', 'futuro', 'inovação'] },
];

export const defaultPalettes: ColorPalette[] = [
  {
    id: '1',
    name: 'Verão Suave',
    description: 'Cores suaves, acinzentadas e delicadas. Tom frio e elegante.',
    colors: [
      { hex: '#E6D5D8', name: 'Rosa Antigo' },
      { hex: '#A4B8C4', name: 'Azul Acinzentado' },
      { hex: '#C7B8A5', name: 'Bege Suave' },
      { hex: '#9EB3A1', name: 'Verde Sálvia' },
      { hex: '#D4C4D9', name: 'Lavanda' },
      { hex: '#B5A7A7', name: 'Taupe' },
    ],
    metals: 'Prata, Ouro Rosé',
    tips: 'Evite cores muito vibrantes. Prefira tons suaves e acinzentados.',
  },
  {
    id: '2',
    name: 'Inverno Profundo',
    description: 'Cores intensas, contrastantes e vibrantes. Tons frios e profundos.',
    colors: [
      { hex: '#0D0D0D', name: 'Preto Profundo' },
      { hex: '#1B2A4A', name: 'Marinho Intenso' },
      { hex: '#8B0000', name: 'Bordô' },
      { hex: '#2D5A27', name: 'Verde Floresta' },
      { hex: '#4A0E4E', name: 'Roxo Escuro' },
      { hex: '#C0C0C0', name: 'Prata' },
    ],
    metals: 'Prata, Ródio, Ouro Branco',
    tips: 'Use cores de alto contraste. Preto é sua cor-âncora.',
  },
  {
    id: '3',
    name: 'Inverno Frio',
    description: 'Cores puras, intensas e geladas. Visual elegante e marcante.',
    colors: [
      { hex: '#000000', name: 'Preto Puro' },
      { hex: '#FFFFFF', name: 'Branco Puro' },
      { hex: '#191970', name: 'Azul Meia-Noite' },
      { hex: '#DC143C', name: 'Vermelho Cereja' },
      { hex: '#4B0082', name: 'Índigo' },
      { hex: '#008B8B', name: 'Ciano Escuro' },
    ],
    metals: 'Prata, Platina',
    tips: 'Alto contraste é sua marca. Use branco e preto como base.',
  },
  {
    id: '4',
    name: 'Outono Profundo',
    description: 'Cores ricas, quentes e terrosas. Sofisticação natural.',
    colors: [
      { hex: '#3D2314', name: 'Marrom Café' },
      { hex: '#8B4513', name: 'Terracota' },
      { hex: '#556B2F', name: 'Verde Oliva' },
      { hex: '#CD853F', name: 'Peru' },
      { hex: '#D2691E', name: 'Ferrugem' },
      { hex: '#DEB887', name: 'Camelo' },
    ],
    metals: 'Ouro, Bronze, Cobre',
    tips: 'Cores da natureza no outono. Terrosos são sua base.',
  },
  {
    id: '5',
    name: 'Primavera Clara',
    description: 'Cores claras, quentes e luminosas. Frescor e delicadeza.',
    colors: [
      { hex: '#FFE4B5', name: 'Pêssego' },
      { hex: '#98FB98', name: 'Verde Menta' },
      { hex: '#87CEEB', name: 'Azul Céu' },
      { hex: '#FFB6C1', name: 'Rosa Claro' },
      { hex: '#F0E68C', name: 'Caqui Claro' },
      { hex: '#E6E6FA', name: 'Lavanda Clara' },
    ],
    metals: 'Ouro Claro, Ouro Rosé',
    tips: 'Cores claras e luminosas. Evite tons muito pesados.',
  },
  {
    id: '6',
    name: 'Inverno Brilhante',
    description: 'Cores vivas, saturadas e intensas. Impacto visual máximo.',
    colors: [
      { hex: '#FF1493', name: 'Rosa Choque' },
      { hex: '#00CED1', name: 'Turquesa' },
      { hex: '#9400D3', name: 'Violeta' },
      { hex: '#FF4500', name: 'Laranja Vermelho' },
      { hex: '#00FF00', name: 'Lima' },
      { hex: '#FF00FF', name: 'Magenta' },
    ],
    metals: 'Prata Polida, Ródio',
    tips: 'Cores vibrantes são seu forte. Use com confiança.',
  },
  {
    id: '7',
    name: 'Outono Suave',
    description: 'Cores quentes, suaves e aconchegantes. Elegância natural.',
    colors: [
      { hex: '#C4A77D', name: 'Dourado Suave' },
      { hex: '#A0826D', name: 'Café com Leite' },
      { hex: '#8B7355', name: 'Bronze Suave' },
      { hex: '#9E9D7D', name: 'Verde Musgo' },
      { hex: '#BC8F8F', name: 'Rosa Antigo' },
      { hex: '#E0C9A6', name: 'Areia' },
    ],
    metals: 'Ouro Fosco, Bronze',
    tips: 'Tons suaves e acolhedores. Neutrals são sua base.',
  },
  {
    id: '8',
    name: 'Primavera Quente',
    description: 'Cores vibrantes, quentes e alegres. Energia solar.',
    colors: [
      { hex: '#FF6347', name: 'Coral' },
      { hex: '#FFA500', name: 'Laranja' },
      { hex: '#FAFAD2', name: 'Amarelo Claro' },
      { hex: '#90EE90', name: 'Verde Claro' },
      { hex: '#F0E68C', name: 'Amarelo Mostarda' },
      { hex: '#DDA0DD', name: 'Ameixa Clara' },
    ],
    metals: 'Ouro Amarelo, Dourado',
    tips: 'Cores quentes e alegres. Coral é sua cor de destaque.',
  },
  {
    id: '9',
    name: 'Verão Frio',
    description: 'Cores frias, suaves e elegantes. Sofisticação discreta.',
    colors: [
      { hex: '#B0C4DE', name: 'Azul Aço Claro' },
      { hex: '#D8BFD8', name: 'Cardo' },
      { hex: '#C0C0C0', name: 'Prata' },
      { hex: '#778899', name: 'Cinza Ardósia' },
      { hex: '#ADD8E6', name: 'Azul Claro' },
      { hex: '#E6E6FA', name: 'Lavanda' },
    ],
    metals: 'Prata, Ouro Branco',
    tips: 'Tons frios e suaves. Azul é sua cor-âncora.',
  },
  {
    id: '10',
    name: 'Verão Claro',
    description: 'Cores claras, suaves e luminosas. Delicadeza e leveza.',
    colors: [
      { hex: '#F5F5DC', name: 'Bege Claro' },
      { hex: '#E0FFFF', name: 'Ciano Claro' },
      { hex: '#FFF0F5', name: 'Lavanda Rosa' },
      { hex: '#F0FFF0', name: 'Menta Suave' },
      { hex: '#FFFACD', name: 'Limão Suave' },
      { hex: '#F5F5F5', name: 'Branco Gelo' },
    ],
    metals: 'Prata Fosca, Ouro Rosé',
    tips: 'Cores muito claras e suaves. Evite preto puro.',
  },
  {
    id: '11',
    name: 'Primavera Brilhante',
    description: 'Cores vivas, quentes e radiantes. Presença solar.',
    colors: [
      { hex: '#FFD700', name: 'Dourado' },
      { hex: '#FF6B6B', name: 'Coral Vivo' },
      { hex: '#4ECDC4', name: 'Turquesa Quente' },
      { hex: '#95E1D3', name: 'Menta Viva' },
      { hex: '#F38181', name: 'Salmão' },
      { hex: '#AA96DA', name: 'Lilás Vivo' },
    ],
    metals: 'Ouro Brilhante, Dourado',
    tips: 'Cores vivas e alegres. Use para criar impacto.',
  },
  {
    id: '12',
    name: 'Outono Quente',
    description: 'Cores ricas, quentes e saturadas. Terra e fogo.',
    colors: [
      { hex: '#B22222', name: 'Vermelho Tijolo' },
      { hex: '#D2691E', name: 'Chocolate' },
      { hex: '#FF8C00', name: 'Laranja Escuro' },
      { hex: '#DAA520', name: 'Dourado Antigo' },
      { hex: '#6B8E23', name: 'Verde Oliva' },
      { hex: '#8B4513', name: 'Marrom Sela' },
    ],
    metals: 'Ouro, Bronze, Cobre',
    tips: 'Tons ricos e terrosos. Evite cores frias.',
  },
];

export const defaultSilhouettes: BodySilhouette[] = [
  { id: '1', name: 'Silhueta Ampulheta X', description: 'Ombros e quadris alinhados com cintura bem definida.', recommendations: ['Valorizar a cintura', 'Roupas ajustadas', 'Decotes em V'] },
  { id: '2', name: 'Silhueta em 8', description: 'Similar à ampulheta, mas com curvas mais acentuadas.', recommendations: ['Tecidos fluidos', 'Cintura marcada', 'Evitar volumes extras'] },
  { id: '3', name: 'Silhueta Triângulo em A', description: 'Ombros mais estreitos que os quadris.', recommendations: ['Valorizar ombros', 'Decotes detalhados', 'Saias evasê'] },
  { id: '4', name: 'Silhueta Curvilínea', description: 'Curvas acentuadas em todo o corpo.', recommendations: ['Roupas estruturadas', 'Tecidos com caimento', 'Evitar excesso de volume'] },
  { id: '5', name: 'Silhueta Triângulo Invertido', description: 'Ombros mais largos que os quadris.', recommendations: ['Equilibrar parte inferior', 'Saias com volume', 'Decotes em V'] },
  { id: '6', name: 'Retângulo', description: 'Ombros, cintura e quadris alinhados.', recommendations: ['Criar curvas', 'Cintos e faixas', 'Volumes estratégicos'] },
  { id: '7', name: 'Oblonga', description: 'Corpo alongado e esguio.', recommendations: ['Quebrar verticalidade', 'Camadas', 'Detalhes horizontais'] },
];

export const defaultConsultingStages: ConsultingStage[] = [
  {
    id: '1',
    name: 'Anamnese',
    description: 'Coleta de informações sobre a cliente',
    isActive: true,
    order: 1,
    fields: [
      { id: '1-1', label: 'Qual sua profissão?', type: 'texto_curto' },
      { id: '1-2', label: 'Como você deseja ser percebida profissionalmente?', type: 'texto_longo' },
      { id: '1-3', label: 'Quais roupas você mais usa no dia a dia?', type: 'multipla_escolha', options: [
        { id: 'a', label: 'Jeans e camiseta' },
        { id: 'b', label: 'Vestidos' },
        { id: 'c', label: 'Ternos/Alfaiataria' },
        { id: 'd', label: 'Roupas esportivas' },
      ]},
      { id: '1-4', label: 'Qual seu objetivo com a consultoria?', type: 'texto_longo' },
    ],
  },
  {
    id: '2',
    name: 'Análise Estratégica de Imagem',
    description: 'Posicionamento estratégico da imagem da cliente',
    isActive: true,
    order: 2,
    fields: [
      { id: '2-1', label: 'Objetivos de imagem identificados', type: 'multipla_escolha', options: [
        { id: 'a', label: 'Autoridade' },
        { id: 'b', label: 'Elegância' },
        { id: 'c', label: 'Acessibilidade' },
        { id: 'd', label: 'Credibilidade' },
        { id: 'e', label: 'Modernidade' },
        { id: 'f', label: 'Confiança' },
        { id: 'g', label: 'Sofisticação' },
        { id: 'h', label: 'Praticidade' },
      ]},
      { id: '2-2', label: 'Análise estratégica', type: 'observacao' },
    ],
  },
  {
    id: '3',
    name: 'Identidade de Estilo',
    description: 'Definição do estilo predominante e secundário',
    isActive: true,
    order: 3,
    fields: [],
  },
  {
    id: '4',
    name: 'Coloração Pessoal',
    description: 'Análise de cores e definição da paleta',
    isActive: true,
    order: 4,
    fields: [],
  },
  {
    id: '5',
    name: 'Morfologia',
    description: 'Análise da silhueta corporal',
    isActive: true,
    order: 5,
    fields: [],
  },
  {
    id: '6',
    name: 'Elementos de Design',
    description: 'Recomendações de linhas, formas e texturas',
    isActive: true,
    order: 6,
    fields: [],
  },
  {
    id: '7',
    name: 'Composições Estratégicas de Looks',
    description: 'Criação de looks personalizados',
    isActive: true,
    order: 7,
    fields: [],
  },
];
