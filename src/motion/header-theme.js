// Mantém o cabeçalho (e o índice lateral) legíveis sobre qualquer cor.
// A cada instante olha qual é a cor de fundo logo abaixo do cabeçalho e escolhe
// texto claro ou escuro. Escreve o resultado em --hdr-fg no <html>.

const LIGHT_TEXT = '#f6f4ee';
const DARK_TEXT = '#0e0e11';

function parseColor(value) {
  // aceita rgb()/rgba() e color(srgb r g b / a)
  const m = value.match(/^(rgba?|color)\((.+)\)$/);
  if (!m) return null;
  const nums = m[2]
    .replace('srgb', '')
    .split(/[\s,\/]+/)
    .filter(Boolean)
    .map(parseFloat);
  if (nums.length < 3 || nums.some(Number.isNaN)) return null;
  const scale = m[1] === 'color' ? 1 : 255;
  return { r: nums[0] / scale, g: nums[1] / scale, b: nums[2] / scale, a: nums.length > 3 ? nums[3] : 1 };
}

function luminance({ r, g, b }) {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function watchHeaderTheme(probeY = 34) {
  let raf = 0;
  let last = '';

  function read() {
    raf = 0;
    const x = Math.round(window.innerWidth / 2);
    const stack = document.elementsFromPoint(x, probeY);
    let fg = DARK_TEXT;
    for (const node of stack) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.9) {
        fg = luminance(c) < 0.35 ? LIGHT_TEXT : DARK_TEXT;
        break;
      }
    }
    if (fg !== last) {
      last = fg;
      document.documentElement.style.setProperty('--hdr-fg', fg);
    }
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  const timer = setInterval(schedule, 150); // cobre animações sem scroll (reel, cortina)
  schedule();

  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    clearInterval(timer);
    cancelAnimationFrame(raf);
  };
}
