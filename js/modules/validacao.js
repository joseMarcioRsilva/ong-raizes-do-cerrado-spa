/*
  VALIDAÇÃO DO FORMULÁRIO DE CADASTRO
  Cada regra recebe o valor do campo e devolve:
    ''         → campo válido
    'mensagem' → texto do erro, mostrado abaixo do campo
  O formulário usa "novalidate": o JavaScript assume a validação para
  dar mensagens claras e checar o que o HTML não consegue (ex.: dígitos
  verificadores do CPF e idade mínima).
*/

/* CPF: confere os dois dígitos verificadores (algoritmo oficial da Receita) */
export function cpfValido(cpf) {
  const n = cpf.replace(/\D/g, '');
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false; // 111.111.111-11 etc.

  const digito = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) soma += Number(n[i]) * (quantidade + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

function calcularIdade(dataISO) {
  const nascimento = new Date(`${dataISO}T00:00:00`);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

const regras = {
  nome: (v) => {
    if (!v.trim()) return 'Informe seu nome completo.';
    if (/[^A-Za-zÀ-ÿ' ]/.test(v)) return 'Use apenas letras e espaços.';
    if (v.trim().split(/\s+/).length < 2) return 'Digite nome e sobrenome.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Digite um e-mail válido, como nome@exemplo.com.';
    return '';
  },
  cpf: (v) => {
    if (!v) return 'Informe seu CPF.';
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)) return 'Complete o CPF no formato 000.000.000-00.';
    if (!cpfValido(v)) return 'CPF inválido. Confira os números digitados.';
    return '';
  },
  nascimento: (v) => {
    if (!v) return 'Informe sua data de nascimento.';
    const idade = calcularIdade(v);
    if (Number.isNaN(idade) || idade > 110 || idade < 0) return 'Digite uma data de nascimento válida.';
    if (idade < 16) return 'Voluntários precisam ter pelo menos 16 anos.';
    return '';
  },
  telefone: (v) => {
    if (!v) return 'Informe um telefone para contato.';
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(v)) return 'Complete o telefone com DDD: (00) 00000-0000.';
    return '';
  },
  cep: (v) => {
    if (!v) return 'Informe seu CEP.';
    if (!/^\d{5}-\d{3}$/.test(v)) return 'Complete o CEP no formato 00000-000.';
    return '';
  },
  endereco: (v) => (v.trim().length < 5 ? 'Informe rua e número.' : ''),
  cidade: (v) => (v.trim().length < 2 ? 'Informe sua cidade.' : ''),
  estado: (v) => (!v ? 'Selecione seu estado.' : ''),
  participacao: (v) => (!v ? 'Escolha como você quer participar.' : ''),
  termos: (marcado) => (!marcado ? 'É preciso aceitar o uso dos dados para concluir.' : ''),
};

export const CAMPOS_VALIDADOS = Object.keys(regras);

/* Lê o valor de um campo pelo "name" (funciona para radio e checkbox) */
function valorDo(form, nome) {
  const campo = form.elements[nome];
  if (campo.type === 'checkbox') return campo.checked;
  return campo.value; // em grupos de radio, RadioNodeList.value = opção marcada
}

/* Elementos de controle do campo (um input, ou vários radios) */
function controlesDo(form, nome) {
  const campo = form.elements[nome];
  return campo instanceof RadioNodeList ? [...campo] : [campo];
}

/* Encontra (ou cria) o parágrafo de erro logo abaixo do campo */
function areaDeErro(form, nome) {
  const id = `erro-${nome}`;
  let area = form.querySelector(`#${id}`);
  if (area) return area;

  const [primeiro] = controlesDo(form, nome);
  const container = primeiro.type === 'radio'
    ? primeiro.closest('fieldset')
    : primeiro.closest('.campo--duplo > div, .campo, fieldset');

  area = document.createElement('p');
  area.className = 'mensagem-erro';
  area.id = id;
  container.append(area);

  // Liga a mensagem ao campo: o leitor de tela lê o erro junto com o rótulo
  controlesDo(form, nome).forEach((controle) => {
    const atuais = (controle.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (!atuais.includes(id)) controle.setAttribute('aria-describedby', [...atuais, id].join(' '));
  });
  return area;
}

/* Valida UM campo, atualiza o visual e devolve a mensagem ('' se válido) */
export function validarCampo(form, nome) {
  const mensagem = regras[nome](valorDo(form, nome));
  areaDeErro(form, nome).textContent = mensagem;
  controlesDo(form, nome).forEach((controle) => {
    controle.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  });
  return mensagem;
}

/* Valida TODOS os campos; devolve a lista de erros */
export function validarFormulario(form) {
  return CAMPOS_VALIDADOS
    .map((nome) => ({ nome, mensagem: validarCampo(form, nome) }))
    .filter((resultado) => resultado.mensagem);
}

/* Remove marcas de validação (usado após enviar ou limpar o formulário) */
export function limparValidacao(form) {
  form.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
  form.querySelectorAll('.mensagem-erro').forEach((p) => { p.textContent = ''; });
}
