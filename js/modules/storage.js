/*
  ARMAZENAMENTO LOCAL (localStorage)
  - localStorage só guarda TEXTO: por isso usamos JSON.stringify ao salvar
    e JSON.parse ao ler.
  - Tudo fica dentro de try/catch: em modo anônimo ou com o armazenamento
    cheio, o navegador pode lançar erro, e o site não pode quebrar por isso.
  - O prefixo "raizes:" evita conflito com outros sites/projetos no mesmo
    endereço (ex.: vários projetos no mesmo github.io).
*/
const PREFIXO = 'raizes:';

export function ler(chave, valorPadrao = null) {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);
    return texto === null ? valorPadrao : JSON.parse(texto);
  } catch {
    return valorPadrao;
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* sem armazenamento disponível: nada a fazer */
  }
}
