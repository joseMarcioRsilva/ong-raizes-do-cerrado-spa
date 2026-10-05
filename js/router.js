/*
  ROTEADOR DA SPA (navegação por hash)
  Endereços no formato  #/rota  ou  #/rota/ancora
    #/inicio            → html/inicio.html
    #/projetos          → html/projetos.html
    #/projetos/hortas   → html/projetos.html e rola até o cartão "hortas"
    #/cadastro          → html/cadastro.html
  Usamos o hash (#) porque ele não recarrega a página e funciona em
  qualquer hospedagem estática, como o GitHub Pages, sem configurar servidor.
*/
import { marcarRotaAtiva } from './modules/menu.js';
import { iniciarProjetos } from './pages/projetos.js';
import { iniciarCadastro } from './pages/cadastro.js';

const rotas = {
  inicio:   { view: 'html/inicio.html',   titulo: 'Início' },
  projetos: { view: 'html/projetos.html', titulo: 'Projetos', iniciar: iniciarProjetos },
  cadastro: { view: 'html/cadastro.html', titulo: 'Cadastro', iniciar: iniciarCadastro },
};
const VIEW_404 = { view: 'html/404.html', titulo: 'Página não encontrada' };

const cacheDeViews = new Map(); // cada view é baixada só uma vez
let primeiraNavegacao = true;

async function carregarView(caminho) {
  if (cacheDeViews.has(caminho)) return cacheDeViews.get(caminho);
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error(`Falha ao carregar ${caminho}: ${resposta.status}`);
  const html = await resposta.text();
  cacheDeViews.set(caminho, html);
  return html;
}

function lerRota() {
  // "#/projetos/hortas".split('/') → ["#", "projetos", "hortas"]
  const [, nome, ancora] = location.hash.split('/');
  return { nome: nome || 'inicio', ancora: ancora || null };
}

async function navegar() {
  // Âncoras comuns (ex.: "#app" do link "Pular para o conteúdo") não são rotas
  if (location.hash && !location.hash.startsWith('#/')) return;

  const { nome, ancora } = lerRota();
  const rota = rotas[nome] || VIEW_404;
  const app = document.getElementById('app');

  try {
    app.innerHTML = await carregarView(rota.view);
  } catch (erro) {
    console.error(erro);
    app.innerHTML = `
      <section class="container secao">
        <div class="alerta alerta--erro" role="alert">
          <span class="alerta__icone" aria-hidden="true">✕</span>
          <div>
            <strong class="alerta__titulo">Não foi possível carregar esta página</strong>
            <p>Verifique sua conexão. Se você abriu o arquivo direto do computador,
               use a extensão Live Server do VS Code.</p>
          </div>
        </div>
      </section>`;
    return;
  }

  document.title = `${rota.titulo} | ONG Raízes do Cerrado`;
  marcarRotaAtiva(rotas[nome] ? nome : null);
  rota.iniciar?.(app, ancora); // cada view inicializa seus próprios eventos

  // Animação de entrada da nova view
  app.classList.remove('view-entrando');
  void app.offsetWidth; // força o navegador a reiniciar a animação
  app.classList.add('view-entrando');

  if (ancora) {
    document.getElementById(ancora)?.scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo(0, 0);
  }

  // Acessibilidade: após navegar, o foco vai para o título da nova página,
  // para o leitor de tela anunciar a mudança (exceto no primeiro carregamento)
  if (!primeiraNavegacao) app.querySelector('h1')?.focus({ preventScroll: Boolean(ancora) });
  primeiraNavegacao = false;
}

export function iniciarRoteador() {
  window.addEventListener('hashchange', navegar);
  navegar();
}
