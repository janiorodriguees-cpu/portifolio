# Portfólio · Janio Rodrigues

Site em **Next.js** (exportado como site estático), com animações em **GSAP**. A home abre com um reel automático (nome, anos de experiência, habilidades, trabalhos) que **para assim que há interação do mouse**, e depois segue para os cases com transição de cortina.

Hoje há três cases de exemplo (`Case 1`, `Case 2`, `Case 3`) só para você ver o layout e as transições.

## Rodar no seu computador

Precisa do [Node.js](https://nodejs.org) (versão LTS, 20 ou mais).

```bash
npm install
npm run dev      # abre em http://localhost:3000
```

## Gerar o site para publicar

```bash
npm run build    # cria a pasta out/ com o site pronto
```

A pasta `out/` é um site estático comum: pode ir para Cloudflare Pages, Vercel, Netlify, GitHub Pages ou qualquer hospedagem.

## O que trocar antes de publicar

- `src/data/site.js`: e-mail, LinkedIn e endereço do domínio.
- `public/curriculo.pdf`: seu currículo (mantenha o nome do arquivo).
- `src/data/cases.js` e `src/content/cases/*.mdx`: os cases reais.
- Página **Sobre**: `src/app/sobre/page.js` (trajetória, como você trabalha, IA).

## Como adicionar um case

1. Em `src/data/cases.js`, copie um item e ajuste `slug`, `title`, `label`, `sector`, `year`, `color`, `on`, `summary` e a ficha (`role`, `team`, `duration`, `tools`).
2. Crie `src/content/cases/<slug>.mdx` (copie um dos existentes). Cada bloco `<Section title="...">` é uma seção; `<Figure src="/cases/<slug>/01.jpg" alt="..." caption="..." />` coloca uma imagem.
3. Coloque as imagens em `public/cases/<slug>/`.

A ordem do array em `cases.js` é a ordem na home (use o mais recente primeiro).

## Onde ficam as animações

`src/motion/`: `reel.js` (abertura), `curtain.js` (transição entre páginas), `series.js` (painéis dos cases), `cursor.js`, `header-theme.js` (cor do cabeçalho conforme o fundo). Cores e tipografia estão no topo de `src/app/globals.css`.

## Acessibilidade

Quem prefere menos movimento (`prefers-reduced-motion`) vê direto a cena final, sem animação e sem cortina. O reel pode ser pausado/retomado pelos botões, e funciona com teclado.

## Fontes

Instrument Serif e Instrument Sans (licença OFL, em `public/fonts/`).
