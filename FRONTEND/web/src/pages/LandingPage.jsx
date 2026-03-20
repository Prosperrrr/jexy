import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Pipeline from '../components/Pipeline';
import FeatureSections from '../components/FeatureSections';
import Creators from '../components/Creators';
import Contribute from '../components/Contribute';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Pipeline />
      <FeatureSections />
      <Creators />
      <Contribute />
      <Footer />
    </div>
  );
}
