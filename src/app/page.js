import Reel from '@/components/Reel';
import Series from '@/components/Series';
import Footer from '@/components/Footer';
import { cases } from '@/data/cases';

export default function Home() {
  return (
    <>
      <Reel cases={cases} />
      <Series cases={cases} />
      <Footer />
    </>
  );
}
