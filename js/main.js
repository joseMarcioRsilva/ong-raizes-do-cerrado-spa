/*
  PONTO DE ENTRADA DA APLICAÇÃO
  Carregado pelo index.html com <script type="module">.
  Só inicializa o que é global (menu e roteador); cada view cuida do resto.
*/
import { iniciarMenu } from './modules/menu.js';
import { iniciarRoteador } from './router.js';

iniciarMenu();
iniciarRoteador();
