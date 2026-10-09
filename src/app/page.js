import Reel from '@/components/Reel';
import Series from '@/components/Series';
import Intro from '@/components/Intro';
import Footer from '@/components/Footer';
import { cases } from '@/data/cases';

export default function Home() {
  return (
    <>
      <Reel cases={cases} />
      <Series cases={cases} />
      <Intro />
      <Footer />
    </>
  );
}
