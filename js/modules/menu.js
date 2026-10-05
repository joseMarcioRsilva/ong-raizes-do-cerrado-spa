/*
  MENU HAMBÚRGUER (abaixo de 768px)
  O CSS faz o visual; aqui só alternamos a classe e o aria-expanded.
*/
export function iniciarMenu() {
  const botao = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');
  if (!botao || !menu) return;

  const definir = (aberto) => {
    menu.classList.toggle('menu--aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.querySelector('.sr-only').textContent =
      aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação';
  };

  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('menu--aberto')) {
      definir(false);
      botao.focus();
    }
  });

  // Ao escolher um link, o menu fecha (a SPA troca a view sem recarregar)
  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) definir(false);
  });
}

/* Marca o link da rota atual com aria-current="page" */
export function marcarRotaAtiva(nomeDaRota) {
  document.querySelectorAll('[data-rota]').forEach((link) => {
    if (link.dataset.rota === nomeDaRota) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
