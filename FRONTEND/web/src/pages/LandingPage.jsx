import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Pipeline from '../components/Pipeline';
import FeatureSections from '../components/FeatureSections';
import Creators from '../components/Creators';
import Contribute from '../components/Contribute';
import Footer from '../components/Footer';

export default function LandingPage() {
  useEffect(() => {
    // Expand the Landing page environment gracefully up to 14px (approx 110% of 12px)
    document.documentElement.style.fontSize = '14px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

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
