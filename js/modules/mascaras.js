/*
  MÁSCARAS DE DIGITAÇÃO (CPF, telefone, CEP)
  Formatam o texto enquanto a pessoa digita. A VALIDAÇÃO fica em validacao.js.
*/
export const formatar = {
  cpf: (n) => n.slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),

  telefone: (n) => {
    n = n.slice(0, 11);
    if (n.length <= 2) return n.replace(/(\d{1,2})/, '($1');
    if (n.length <= 10) {
      return n.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, ddd, a, b) => `(${ddd}) ${a}${b ? '-' + b : ''}`);
    }
    return n.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },

  cep: (n) => n.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
};

/*
  Delegação de eventos: um único "ouvinte" no container trata todos os
  campos com data-mascara, inclusive os que forem criados depois.
*/
export function aplicarMascaras(container) {
  container.addEventListener('input', (evento) => {
    const campo = evento.target;
    const tipo = campo.dataset?.mascara;
    if (!tipo || !formatar[tipo]) return;
    campo.value = formatar[tipo](campo.value.replace(/\D/g, ''));
  });
}
