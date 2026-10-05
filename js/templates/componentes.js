/*
  SISTEMA DE TEMPLATES
  Cada função recebe DADOS e devolve uma string HTML (template literal).
  Assim o mesmo componente visual é reaproveitado em qualquer view.

  SEGURANÇA: todo texto que vem de dados passa por escaparHTML() antes de
  entrar no template. Sem isso, um nome digitado como <script>... no
  formulário seria executado ao ser exibido (ataque XSS).
*/

export function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* ---------- Badge ---------- */
export function badge(texto, variante = '') {
  const classe = variante ? `badge badge--${variante}` : 'badge';
  return `<li class="${classe}">${escaparHTML(texto)}</li>`;
}

/* ---------- Cartão de projeto ---------- */
export function cartaoProjeto(projeto) {
  const badges = [
    badge(`● ${projeto.status}`, 'sucesso'),
    ...projeto.categorias.map((cat) => badge(cat, cat === 'Educação' || cat === 'Meio ambiente' ? 'info' : '')),
    projeto.precisaVoluntarios ? badge('⚠ Precisa de voluntários', 'aviso') : '',
  ].join('');

  const destaques = projeto.destaques.map((d) => `<li>${escaparHTML(d)}</li>`).join('');

  return `
    <article class="cartao cartao--projeto" id="${escaparHTML(projeto.id)}">
      <figure>
        <picture>
          <source srcset="imagens/${projeto.imagem}.webp" type="image/webp">
          <img src="imagens/${projeto.imagem}.png" alt="${escaparHTML(projeto.alt)}" width="320" height="180" loading="lazy">
        </picture>
        <figcaption>${escaparHTML(projeto.legenda)}</figcaption>
      </figure>
      <header>
        <h3>${escaparHTML(projeto.titulo)}</h3>
        <ul class="badges" aria-label="Status e categorias">${badges}</ul>
      </header>
      <p>${escaparHTML(projeto.descricao)}</p>
      <ul>${destaques}</ul>
    </article>`;
}

/* ---------- Botão de filtro (chip) ---------- */
export function botaoFiltro(categoria, ativo) {
  return `<button type="button" class="filtro" data-categoria="${escaparHTML(categoria)}"
            aria-pressed="${ativo}">${escaparHTML(categoria)}</button>`;
}

/* ---------- Linha da agenda ---------- */
export function linhaAgenda(item) {
  const hora = (h) => `<time datetime="${h}">${Number(h.slice(0, 2))}h</time>`;
  return `
    <tr>
      <th scope="row">${escaparHTML(item.atividade)}</th>
      <td>${escaparHTML(item.dia)}</td>
      <td>${hora(item.inicio)} às ${hora(item.fim)}</td>
      <td>${item.vagas}</td>
    </tr>`;
}

/* ---------- Item da lista de cadastros salvos ---------- */
export function itemCadastro(cadastro) {
  const tipos = { voluntario: 'Voluntário', doador: 'Doador', ambos: 'Voluntário e doador' };
  const data = new Date(cadastro.criadoEm).toLocaleDateString('pt-BR');
  return `
    <li class="item-cadastro">
      <div>
        <strong>${escaparHTML(cadastro.nome)}</strong>
        <ul class="badges" aria-label="Tipo de participação">${badge(tipos[cadastro.participacao] || '—', 'sucesso')}</ul>
        <span class="ajuda">${escaparHTML(cadastro.cidade)} (${escaparHTML(cadastro.estado)}) · cadastrado em ${data}</span>
      </div>
      <button type="button" class="botao botao--secundario botao--pequeno"
              data-remover="${escaparHTML(cadastro.id)}"
              aria-label="Remover cadastro de ${escaparHTML(cadastro.nome)}">Remover</button>
    </li>`;
}

/* ---------- Estado vazio ---------- */
export function estadoVazio(mensagem) {
  return `<li class="estado-vazio">${escaparHTML(mensagem)}</li>`;
}
