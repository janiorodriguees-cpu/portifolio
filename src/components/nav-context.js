'use client';

import { createContext, useContext } from 'react';

// Contexto da navegação com transição. `go(href, { color, on, text })` cobre a tela
// com a cortina, troca a rota e revela a nova página.
export const NavContext = createContext({ go: () => {} });
export const useNav = () => useContext(NavContext);
