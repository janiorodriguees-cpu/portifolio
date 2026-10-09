'use client';

// "Voltar ao topo" do rodapé (rolagem suave; instantânea para quem prefere menos movimento).
export default function BackToTop() {
  const onClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };
  return (
    <button type="button" className="foot__top" onClick={onClick}>
      Voltar ao topo <span className="arrow">↑</span>
    </button>
  );
}
