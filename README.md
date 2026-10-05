# ONG Raízes do Cerrado — SPA (Experiência Prática III)

Versão **Single Page Application** do site da ONG fictícia Raízes do Cerrado.
Disciplina **Desenvolvimento Front-End para Web**, Cruzeiro do Sul (ADS).

## Estrutura de diretórios

```
ong-raizes-do-cerrado-spa/
├── index.html            → casca da SPA: cabeçalho, <main id="app"> e rodapé
├── html/                 → views (fragmentos) que o roteador injeta no <main>
│   ├── inicio.html
│   ├── projetos.html
│   ├── cadastro.html
│   └── 404.html
├── css/
│   ├── tokens.css        → Design System (cores, tipografia, espaçamentos)
│   ├── reset.css         → normalização básica
│   └── style.css         → base, layout (grid de 12 colunas) e componentes
├── imagens/              → logo (SVG) e ilustrações (SVG, WebP, PNG)
└── js/
    ├── main.js           → ponto de entrada: inicia o menu e o roteador
    ├── router.js         → navegação por hash (#/rota) e carga das views
    ├── data/
    │   └── projetos.js   → dados dos projetos e da agenda
    ├── templates/
    │   └── componentes.js→ templates: cartão, badge, filtro, linha da agenda, item de cadastro
    ├── pages/            → controladores de cada view
    │   ├── projetos.js   → filtros, cartões e agenda
    │   └── cadastro.js   → formulário, rascunho e lista de cadastros
    └── modules/          → funcionalidades reutilizáveis
        ├── menu.js       → menu hambúrguer e link ativo
        ├── mascaras.js   → máscaras de CPF, telefone e CEP
        ├── validacao.js  → regras de validação (CPF com dígito verificador, idade mínima)
        ├── storage.js    → leitura e gravação no localStorage com tratamento de erros
        └── toast.js      → notificações
```

## Rotas

| Endereço | View |
|---|---|
| `#/inicio` | Página inicial |
| `#/projetos` | Projetos (com filtro por categoria) |
| `#/projetos/hortas` | Projetos, já rolando até o cartão "hortas" |
| `#/cadastro` | Formulário de cadastro |
| qualquer outra | Página não encontrada |

## Como executar

O projeto usa **módulos ES** (`import`/`export`) e `fetch` para carregar as views.
Por segurança, o navegador bloqueia esses recursos em arquivos abertos direto do disco (`file://`).
Use um servidor local:

- **VS Code:** clique com o botão direito em `index.html` → **Open with Live Server**; ou
- **Terminal:** `python -m http.server` e abra `http://localhost:8000`.

No GitHub Pages funciona sem configuração.

## Privacidade (LGPD)

Os cadastros são salvos apenas no `localStorage` do navegador, para demonstração.
Pelo princípio da minimização, **CPF, telefone e endereço não são armazenados**.
O rascunho automático também não guarda o CPF.
