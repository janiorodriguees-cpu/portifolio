import Reel from '@/components/Reel';
import Series from '@/components/Series';
import Footer from '@/components/Footer';
import { cases } from '@/data/cases';
import { underConstruction } from '@/data/site';

export default function Home() {
  if (underConstruction()) return null; // site em obra: não gera conteúdo (ver site.js)
  return (
    <>
      <Reel cases={cases} />
      <Series cases={cases} />
      <Footer />
    </>
  );
}
