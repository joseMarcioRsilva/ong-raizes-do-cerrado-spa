/*
  CONTROLADOR DA VIEW "CADASTRO"
  Junta os módulos: máscaras, validação, armazenamento, toast e templates.
*/
import { aplicarMascaras } from '../modules/mascaras.js';
import { validarCampo, validarFormulario, limparValidacao, CAMPOS_VALIDADOS } from '../modules/validacao.js';
import { ler, salvar, remover } from '../modules/storage.js';
import { mostrarToast } from '../modules/toast.js';
import { itemCadastro, estadoVazio } from '../templates/componentes.js';

const CHAVE_CADASTROS = 'cadastros';
const CHAVE_RASCUNHO = 'rascunho-cadastro';
// O rascunho NÃO guarda CPF nem a aceitação dos termos (dados sensíveis / consentimento explícito)
const CAMPOS_DO_RASCUNHO = ['nome', 'email', 'nascimento', 'telefone', 'cep', 'endereco', 'cidade', 'estado', 'participacao', 'horas', 'mensagem'];

export function iniciarCadastro(raiz) {
  const form = raiz.querySelector('[data-form-cadastro]');
  if (!form) return;
  const listaEl = raiz.querySelector('[data-lista-cadastros]');
  const statusRascunho = raiz.querySelector('[data-status-rascunho]');
  const modal = raiz.querySelector('#modal-confirmacao');
  const saidaHoras = raiz.querySelector('#horas-valor');

  aplicarMascaras(form);
  restaurarRascunho(form, statusRascunho);
  renderizarLista(listaEl);
  saidaHoras.value = form.elements.horas.value;

  /* ---------- Eventos de digitação ---------- */
  let temporizador;
  form.addEventListener('input', (evento) => {
    const nome = evento.target.name;
    if (nome === 'horas') saidaHoras.value = evento.target.value;

    // Se o campo já estava com erro, revalida enquanto a pessoa corrige
    if (CAMPOS_VALIDADOS.includes(nome) && evento.target.getAttribute('aria-invalid') === 'true') {
      validarCampo(form, nome);
    }

    // Salva o rascunho 400 ms depois que a pessoa para de digitar (debounce)
    clearTimeout(temporizador);
    temporizador = setTimeout(() => salvarRascunho(form, statusRascunho), 400);
  });

  /* ---------- Ao sair de um campo preenchido, valida ---------- */
  form.addEventListener('focusout', (evento) => {
    const { name: nome, value, type } = evento.target;
    if (!CAMPOS_VALIDADOS.includes(nome) || type === 'radio' || type === 'checkbox') return;
    if (value || evento.target.hasAttribute('aria-invalid')) validarCampo(form, nome);
  });

  /* ---------- Seleções (radio, checkbox, select) ---------- */
  form.addEventListener('change', (evento) => {
    const nome = evento.target.name;
    if (CAMPOS_VALIDADOS.includes(nome) && evento.target.type !== 'text') validarCampo(form, nome);
    salvarRascunho(form, statusRascunho);
  });

  /* ---------- Envio ---------- */
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const erros = validarFormulario(form);

    if (erros.length) {
      const texto = erros.length === 1 ? '1 campo precisa' : `${erros.length} campos precisam`;
      mostrarToast(`${texto} de correção. Veja as mensagens em vermelho.`, 'erro');
      // Leva o foco ao primeiro campo com erro (num grupo de radio, à 1ª opção)
      const campo = form.elements[erros[0].nome];
      (campo instanceof RadioNodeList ? campo[0] : campo).focus();
      return;
    }

    const cadastros = ler(CHAVE_CADASTROS, []);
    cadastros.unshift(coletarDados(form));
    salvar(CHAVE_CADASTROS, cadastros);

    form.reset(); // dispara o evento "reset" abaixo
    renderizarLista(listaEl);
    modal.showModal();
  });

  /* ---------- Limpar ---------- */
  form.addEventListener('reset', (evento) => {
    // isTrusted = true quando a PESSOA clicou em "Limpar";
    // false quando o próprio código chamou form.reset() após o envio
    const limpoPeloUsuario = evento.isTrusted;
    setTimeout(() => { // espera o navegador terminar de limpar os campos
      limparValidacao(form);
      remover(CHAVE_RASCUNHO);
      statusRascunho.textContent = '';
      saidaHoras.value = form.elements.horas.value;
      if (limpoPeloUsuario) mostrarToast('Formulário limpo.', 'info', 3000);
    });
  });

  modal.addEventListener('close', () => {
    mostrarToast('Obrigado! Em breve entraremos em contato.', 'sucesso');
  });

  /* ---------- Remover cadastro salvo (delegação de eventos) ---------- */
  listaEl.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-remover]');
    if (!botao) return;
    const restantes = ler(CHAVE_CADASTROS, []).filter((c) => c.id !== botao.dataset.remover);
    salvar(CHAVE_CADASTROS, restantes);
    renderizarLista(listaEl);
    mostrarToast('Cadastro removido.', 'info', 3000);
  });
}

/*
  Guardamos só o necessário para a lista (princípio da minimização da LGPD):
  CPF, telefone e endereço não vão para o localStorage.
*/
function coletarDados(form) {
  const dados = new FormData(form);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    nome: dados.get('nome').trim(),
    email: dados.get('email').trim(),
    cidade: dados.get('cidade').trim(),
    estado: dados.get('estado'),
    participacao: dados.get('participacao'),
    interesses: dados.getAll('interesses[]'),
    horas: Number(dados.get('horas')),
    criadoEm: new Date().toISOString(),
  };
}

function renderizarLista(listaEl) {
  const cadastros = ler(CHAVE_CADASTROS, []);
  listaEl.innerHTML = cadastros.length
    ? cadastros.map(itemCadastro).join('')
    : estadoVazio('Nenhum cadastro feito neste navegador ainda.');
}

function salvarRascunho(form, statusEl) {
  const rascunho = {};
  CAMPOS_DO_RASCUNHO.forEach((nome) => { rascunho[nome] = form.elements[nome].value; });
  rascunho.interesses = [...form.querySelectorAll('[name="interesses[]"]:checked')].map((c) => c.value);
  rascunho.salvoEm = new Date().toISOString();
  if (salvar(CHAVE_RASCUNHO, rascunho)) {
    statusEl.textContent = `Rascunho salvo automaticamente às ${horaCurta(rascunho.salvoEm)}.`;
  }
}

function restaurarRascunho(form, statusEl) {
  const rascunho = ler(CHAVE_RASCUNHO);
  if (!rascunho) return;
  CAMPOS_DO_RASCUNHO.forEach((nome) => {
    if (rascunho[nome] !== undefined && rascunho[nome] !== '') form.elements[nome].value = rascunho[nome];
  });
  form.querySelectorAll('[name="interesses[]"]').forEach((c) => {
    c.checked = (rascunho.interesses || []).includes(c.value);
  });
  statusEl.textContent = `Recuperamos o rascunho que você começou às ${horaCurta(rascunho.salvoEm)}. Use "Limpar" para descartá-lo.`;
}

const horaCurta = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
