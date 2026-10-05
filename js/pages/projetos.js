/*
  CONTROLADOR DA VIEW "PROJETOS"
  Renderiza filtros, cartões e agenda a partir dos dados, usando os templates.
*/
import { projetos, agenda } from '../data/projetos.js';
import { cartaoProjeto, botaoFiltro, linhaAgenda } from '../templates/componentes.js';
import { ler, salvar } from '../modules/storage.js';

export function iniciarProjetos(raiz, ancora) {
  const lista = raiz.querySelector('[data-lista-projetos]');
  const filtros = raiz.querySelector('[data-filtros]');
  const corpoAgenda = raiz.querySelector('[data-agenda]');

  // Agenda: um template por linha
  corpoAgenda.innerHTML = agenda.map(linhaAgenda).join('');

  // Categorias sem repetição (Set) + "Todos"
  const categorias = ['Todos', ...new Set(projetos.flatMap((p) => p.categorias))];

  // O último filtro escolhido fica salvo no localStorage
  let ativo = ler('filtro-projetos', 'Todos');
  if (!categorias.includes(ativo)) ativo = 'Todos';
  // Se o usuário veio por um link direto a um projeto, mostramos todos
  if (ancora && projetos.some((p) => p.id === ancora)) ativo = 'Todos';

  const renderizar = () => {
    filtros.innerHTML = categorias.map((c) => botaoFiltro(c, c === ativo)).join('');
    const visiveis = ativo === 'Todos'
      ? projetos
      : projetos.filter((p) => p.categorias.includes(ativo));
    lista.innerHTML = visiveis.map(cartaoProjeto).join('');
  };

  renderizar();

  // Delegação de eventos: um único ouvinte para todos os botões de filtro
  filtros.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-categoria]');
    if (!botao) return;
    ativo = botao.dataset.categoria;
    salvar('filtro-projetos', ativo);
    renderizar();
    // Depois de redesenhar, devolvemos o foco ao botão clicado (teclado)
    filtros.querySelector(`[data-categoria="${CSS.escape(ativo)}"]`)?.focus();
  });
}
