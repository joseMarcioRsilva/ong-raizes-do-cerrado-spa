/*
  DADOS DOS PROJETOS E DA AGENDA
  Separar os dados da apresentação permite que, no futuro, este array
  venha de uma API (back-end) sem mudar nenhum template.
*/

export const projetos = [
  {
    id: 'hortas',
    titulo: 'Hortas Comunitárias',
    imagem: 'horta',
    alt: 'Ilustração de canteiros de horta com alfaces e cenouras',
    legenda: 'Horta do bairro Ipanema, 2025',
    descricao: 'Transformamos terrenos baldios em hortas cuidadas pela própria comunidade. A colheita é dividida entre as famílias participantes.',
    categorias: ['Meio ambiente', 'Alimentação'],
    status: 'Em andamento',
    precisaVoluntarios: false,
    destaques: ['18 hortas ativas', 'Encontros aos sábados, 7h'],
  },
  {
    id: 'escola',
    titulo: 'Escola Viva do Cerrado',
    imagem: 'oficina',
    alt: 'Ilustração de um quadro com uma folha desenhada, representando uma aula',
    legenda: 'Oficina em escola municipal',
    descricao: 'Oficinas de educação ambiental em escolas públicas: compostagem, plantas nativas do Cerrado e uso consciente da água.',
    categorias: ['Educação', 'Meio ambiente'],
    status: 'Em andamento',
    precisaVoluntarios: false,
    destaques: ['12 escolas parceiras', 'Público: 8 a 14 anos'],
  },
  {
    id: 'cozinha',
    titulo: 'Cozinha Solidária',
    imagem: 'cozinha',
    alt: 'Ilustração de uma panela fumegante',
    legenda: 'Cozinha Solidária',
    descricao: 'Refeições preparadas com alimentos das nossas hortas, servidas três vezes por semana para pessoas em situação de vulnerabilidade.',
    categorias: ['Alimentação'],
    status: 'Em andamento',
    precisaVoluntarios: true,
    destaques: ['300 refeições por semana', 'Precisa de voluntários na cozinha'],
  },
];

export const agenda = [
  { atividade: 'Mutirão na horta', dia: 'Sábado', inicio: '07:00', fim: '11:00', vagas: 20 },
  { atividade: 'Oficina nas escolas', dia: 'Quarta-feira', inicio: '14:00', fim: '16:00', vagas: 6 },
  { atividade: 'Cozinha Solidária', dia: 'Seg., Qua. e Sex.', inicio: '10:00', fim: '13:00', vagas: 8 },
];
