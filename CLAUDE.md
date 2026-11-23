# Portfólio do Janio Rodrigues (projeto para o Claude Code)

Portfólio de UX/Product Designer (10+ anos, consultoria; saiu da CI&T em set/2026, busca vagas remotas). Idioma do site: **português do Brasil**.

## Stack
Next.js 15 (App Router) com `output: 'export'`, React 19, MDX para cases (`@next/mdx`), GSAP + ScrollTrigger, CSS puro em `src/app/globals.css` (sem Tailwind de propósito; pode entrar depois).

## Comandos
`npm install` · `npm run dev` · `npm run build` (gera `out/`)

## Publicação
O site está no ar em **janiorodrigues.com** (Vercel). Publicar = commit + `git push` no `main` de `github.com/janiorodriguees-cpu/portifolio`; a Vercel atualiza em 1–2 min. Só publique quando o Janio disser "publicar".
Domínio e DNS: o Janio contratou um plano na **HostGator** (os servidores de DNS são `dns3/dns4.hostgator.com.br`). O DNS aponta o site para a Vercel (registro A `216.198.79.1` e `www` → CNAME da Vercel), então os arquivos do site são servidos pela Vercel, não pelo servidor da HostGator. O MX aponta para o próprio `janiorodrigues.com` (hoje, IP da Vercel), então um e-mail @janiorodrigues.com não recebe mensagens enquanto isso não for ajustado.

## Como o Janio prefere trabalhar
- Faça a mudança e diga o que mudou (arquivos e comportamento). **Não abra o localhost nem teste no navegador, nem acompanhe o deploy, a menos que ele peça**: ele confere em `localhost:3000` e no domínio e avisa.
- Antes de mudar texto ou layout que ele não definiu, mostre a proposta e espere o ok. Opiniões de UX: dê a recomendação e o porquê, pensando em quem visita (recrutador, cliente).
- Testes de tela fora do portfólio: laboratório em `lab/` (fora do git), servidor `node lab/server.js` na porta 3100 (config `lab` em `.claude/launch.json`); o portfólio fica na 3000.

## Estrutura
- `src/app/`: páginas (`page.js` home, `sobre/`, `casos/[slug]/`), `layout.js`, CSS global.
- `src/components/`: `Shell` (cortina + cursor + navegação), `Reel`, `Series`, `Header`, `TLink`, `Footer`, `CaseEnter`, `mdx/`.
- `src/motion/`: módulos GSAP em JS puro que recebem `gsap` por parâmetro (`createReel`, `createCurtain`, `initSeries`...). Não importe React neles.
- `src/data/`: `site.js` (contatos) e `cases.js` (lista de cases). `src/content/cases/*.mdx`: texto dos cases.

## Regras de design e movimento
- Referências do Janio: robin-noguier.com e o case da Esperanto (transições por rolagem, cortinas), Aaron Rudyk, vídeos de portfólio da Envato (reel automático).
- O reel toca sozinho até o fim e **só pausa quando a pessoa pede** (botão "Pausar" ou clique num segmento). Fora da tela ou com a aba oculta ele pausa sozinho e retoma ao voltar. Não volte a pausar com movimento do mouse: o Janio testou e decidiu que atrapalha quem visita (out/2026).
- A barra do reel mostra só a cena atual ("02 / 05 · Experiência"); nada de frases longas que cortam.
- Transição de página: cortina da cor do case sobe → troca de rota → sai pelo topo. Respeitar `prefers-reduced-motion`.
- Não use `transform` em CSS para pré-esconder elementos animados pelo GSAP (o GSAP lê como px). Use `opacity`/`clip-path`.
- Cores: papel `#ebebe9`, tinta `#0e0e11`; cada case tem sua cor (`color`/`on` em `cases.js`). Vermelho de destaque `#dd0a0d` (`--accent`, classe `.hl`): só em títulos grandes (pontuação, "+", palavras-chave) e no hover de todos os botões e links de contato; nunca em texto pequeno nem sobre a cor de um case. O número/última palavra do nome de cada case usa a cor `hl` do próprio case (`CaseName`). As cores atuais foram escolha do Janio mesmo com contraste baixo (1,5–2,5); ao propor novas, mostre o contraste.
- Fontes: títulos em Times New Roman (com Tinos, de mesmas medidas, onde ela não existe); textos em Inter. Ambas via pacotes `@fontsource` importados no `layout.js`.
- Tipografia: use só os tokens de `:root` em `globals.css` (`--fs-xl` 96→190, `--fs-l` 72→148, `--fs-m` 40→68, `--fs-lead` 22→26, `--fs-text` 16→19; celular 390 → 1440) e o espaçamento entre letras `--tr-*`. XL só para "Olá." e "10+"; L para nomes e títulos; M para frases de destaque. Não crie tamanhos avulsos.
- Transições de página: para cases a cortina sobe (cor do case); para o Sobre ela atravessa na horizontal (`direction` em `curtain.js`, escolhida no `Shell`).
- Grid de 12 colunas: margem `--gutter` (56 px no 1440), espaço entre colunas `--col-gap` (24 px), espaçamentos `--s1`…`--s8` (8, 16, 24, 32, 48, 64, 96, 128).
- Não rode `npm run build` com o `npm run dev` aberto: os dois usam `.next` e o dev quebra.
- Botões de contato (`ContactButtons`: Contato, rodapé e menu do celular): compactos parados ("E-mail", "LinkedIn", "CV") e crescem no hover ("Copiar e-mail", "Abrir perfil ↗", "Visualizar ↗"). E-mail copia o endereço; CV abre o PDF (`public/curriculo.pdf`) em nova aba, sem baixar. O hover nunca pode fazer um botão trocar de linha: a fileira reserva o espaço; sem espaço e com mouse, duas linhas fixas (E-mail + LinkedIn / CV). **Nunca empilhar os três** (o Janio recusou).
- Página Contato: layout atual (título + texto + botões à esquerda, colunas 1–6; formulário à direita, 7–12), que cabe sem rolagem. O Janio preferiu este a alternativas (nov/2026). Sem frases explicando como usar os botões.

## Redação
Escreva para quem escaneia (recrutador, cliente): o que importa primeiro, frases curtas, nada que repita o título ou explique o óbvio. Contato revisado em 23/11/2026; as outras páginas ainda não.

## Confidencialidade (importante)
Os cases vêm de clientes de consultoria (Cielo, Bradesco, Carrefour, Fleury, Alelo, CTC...). **Não publique nomes, números ou telas de cliente sem o Janio confirmar** o que pode ser exibido. Quando em dúvida, anonimize ou use um placeholder.

## Estrutura de cada case
Contexto e problema · Meu papel e o time · Processo e facilitação · Decisões e o que foi descartado · Solução · Resultado e aprendizados.

## Pendências
- Revisar a redação das outras páginas com o mesmo olhar do Contato: Home (reel e rodapé), Sobre e páginas de case.
- Escrever os cases reais. Recomendação ainda não confirmada pelo Janio: Bradesco Internet Banking, CTC, Cielo (ARV) e um quarto entre Fleury e Carrefour. A Cielo já aparece no reel.
- Formulário de contato: ligado ao Formspree em 23/11/2026 (`form` em `site.js`, plano grátis, 50 mensagens/mês); falta o Janio confirmar que as mensagens chegam. Não use `mailto:` no site (abre o seletor de apps do Windows); e-mail é copiado pelo botão.
- Depoimentos reais e autorizados em `src/data/testimonials.js`.

## Últimas mudanças (nov/2026)
- 19/11: currículo novo (CV 2026) em `public/curriculo.pdf`; botões de contato compactos com hover; CV abre em nova aba.
- 23/11: correções dos botões (largura após copiar, troca de linha no hover); Contato com nova redação.
