// Dados do site. Troque os valores marcados com "TROCAR" antes de publicar.
// Site em obra só no build de produção (janiorodrigues.com); no `npm run dev` fica desligado.
// As páginas não geram nada (nem no código-fonte) e o layout mostra "em construção".
export const underConstruction = () => site.construction && process.env.NODE_ENV === 'production';

export const site = {
  // true: o janiorodrigues.com mostra só a página "em construção" (UnderConstruction.js);
  // o localhost (npm run dev) continua com o site completo. Troque para false para reabrir.
  construction: true,
  name: 'Janio Rodrigues',
  role: 'UX e Product Designer',
  // aparece no rodapé, com um ponto pulsando; troque quando a situação mudar
  status: 'Disponível para vagas remotas',
  email: 'janiorodriguees@gmail.com',
  linkedin: 'https://www.linkedin.com/in/janio-rodrigues/',
  // para atualizar, substitua o arquivo public/curriculo.pdf
  cv: '/curriculo.pdf',
  // endereço do formulário de contato no Formspree (conta do Janio; as mensagens chegam
  // no e-mail dele). Vazio: o formulário mostra erro e pede para copiar o e-mail.
  form: 'https://formspree.io/f/xdegpzgw',
  // retrato da página Sobre
  photo: '/foto.jpg',
  // rosto recortado para o botão de e-mail (quadrado, aparece bem pequeno)
  avatar: '/avatar.jpg',
  url: 'https://janiorodrigues.com',
};
