# Portfólio do Janio Rodrigues (projeto para o Claude Code)

Portfólio de UX/Product Designer (10+ anos, consultoria; saiu da CI&T em set/2026, busca vagas remotas). Idioma do site: **português do Brasil**.

## Stack
Next.js 15 (App Router) com `output: 'export'`, React 19, MDX para cases (`@next/mdx`), GSAP + ScrollTrigger, CSS puro em `src/app/globals.css` (sem Tailwind de propósito; pode entrar depois).

## Comandos
`npm install` · `npm run dev` · `npm run build` (gera `out/`)

## Estrutura
- `src/app/`: páginas (`page.js` home, `sobre/`, `casos/[slug]/`), `layout.js`, CSS global.
- `src/components/`: `Shell` (cortina + cursor + navegação), `Reel`, `Series`, `Header`, `TLink`, `Footer`, `CaseEnter`, `mdx/`.
- `src/motion/`: módulos GSAP em JS puro que recebem `gsap` por parâmetro (`createReel`, `createCurtain`, `initSeries`...). Não importe React neles.
- `src/data/`: `site.js` (contatos) e `cases.js` (lista de cases). `src/content/cases/*.mdx`: texto dos cases.

## Regras de design e movimento
- Referências do Janio: robin-noguier.com e o case da Esperanto (transições por rolagem, cortinas), Aaron Rudyk, vídeos de portfólio da Envato (reel automático).
- O reel toca sozinho e **pausa com qualquer interação do mouse** (movimento > 60 px, clique, roda, toque, tecla). Não quebre isso.
- Transição de página: cortina da cor do case sobe → troca de rota → sai pelo topo. Respeitar `prefers-reduced-motion`.
- Não use `transform` em CSS para pré-esconder elementos animados pelo GSAP (o GSAP lê como px). Use `opacity`/`clip-path`.
- Cores: papel `#ebebe9`, tinta `#0e0e11`; cada case tem sua cor (`color`/`on` em `cases.js`).
- Tipografia: use só os tokens de `:root` em `globals.css` (`--fs-xl` 88→148, `--fs-l` 68→108, `--fs-m` 44→68, `--fs-lead` 22→25, `--fs-text` 16→19; celular 390 → 1440). XL só para "Olá." e "10+"; L para nomes e títulos; M para frases de destaque. Não crie tamanhos avulsos.
- Grid de 12 colunas: margem `--gutter` (56 px no 1440), espaço entre colunas `--col-gap` (24 px), espaçamentos `--s1`…`--s8` (8, 16, 24, 32, 48, 64, 96, 128).
- Não rode `npm run build` com o `npm run dev` aberto: os dois usam `.next` e o dev quebra.

## Confidencialidade (importante)
Os cases vêm de clientes de consultoria (Cielo, Bradesco, Carrefour, Fleury, Alelo, CTC...). **Não publique nomes, números ou telas de cliente sem o Janio confirmar** o que pode ser exibido. Quando em dúvida, anonimize ou use um placeholder.

## Estrutura de cada case
Contexto e problema · Meu papel e o time · Processo e facilitação · Decisões e o que foi descartado · Solução · Resultado e aprendizados.

## Pendências
- Trocar e-mail, LinkedIn e URL em `src/data/site.js`; adicionar `public/curriculo.pdf`.
- Escrever os cases reais (Cielo ARV, Fleury, Bradesco, Alelo, Carrefour, CTC) e a página Sobre.
- Definir domínio (janiorodrigues.com) e hospedagem.
- Primeira execução: rodar `npm install` e `npm run dev` e corrigir qualquer erro de build.
