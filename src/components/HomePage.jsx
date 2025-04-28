// src/HomePage.jsx
import Hero from './Hero';
import Benefits from './Benefits';
import Steps from './Steps';
import Whitepaper from './Whitepaper';
import SocialProof from './SocialProof';
import Footer from './Footer';

export default function HomePage({ onJoin }) {
  return (
    <>
      <Hero onJoin={onJoin} />
      <Benefits />
      <Steps />
      <Whitepaper />
      <Footer />
    </>
  );
}
