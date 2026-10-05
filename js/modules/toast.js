/*
  TOAST: notificação temporária que não bloqueia a tela.
  tipo = "sucesso" | "info" | "aviso" | "erro"
*/
const icones = { sucesso: '✓', info: 'ℹ', aviso: '⚠', erro: '✕' };

function areaDeToasts() {
  let area = document.querySelector('.toast-area');
  if (!area) {
    area = document.createElement('div');
    area.className = 'toast-area';
    area.setAttribute('aria-live', 'polite'); // leitor de tela anuncia sem interromper
    document.body.append(area);
  }
  return area;
}

export function mostrarToast(mensagem, tipo = 'info', duracao = 5000) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');

  const icone = document.createElement('span');
  icone.setAttribute('aria-hidden', 'true');
  icone.textContent = icones[tipo] || icones.info;

  const texto = document.createElement('p');
  texto.style.margin = '0';
  texto.textContent = mensagem; // textContent: seguro contra XSS

  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'toast__fechar';
  fechar.setAttribute('aria-label', 'Fechar notificação');
  fechar.textContent = '×';

  toast.append(icone, texto, fechar);
  areaDeToasts().append(toast);

  const remover = () => {
    toast.classList.add('toast--saindo');
    setTimeout(() => toast.remove(), 300);
  };
  fechar.addEventListener('click', remover);
  setTimeout(remover, duracao);
}
