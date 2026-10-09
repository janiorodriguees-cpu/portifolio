import Section from '@/components/mdx/Section';
import Figure from '@/components/mdx/Figure';

// Componentes disponíveis dentro dos arquivos .mdx dos cases.
export function useMDXComponents(components) {
  return { Section, Figure, ...components };
}
