import createMDX from '@next/mdx';

const withMDX = createMDX({});

/** Site estático: `npm run build` gera a pasta `out/`, pronta para qualquer hospedagem. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
