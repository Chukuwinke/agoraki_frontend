import React from 'react';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Steps from './components/Steps';
import Whitepaper from './components/Whitepaper';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';
import './app.css';

function App() {
  const handleJoin = e => {
    e.preventDefault();
    const email = e.target.email.value;
    alert(`Thanks! We'll notify ${email} soon.`);
    e.target.reset();
  };

  return (
    <>
      <Hero onJoin={handleJoin} />
      <Benefits />
      <Steps />
      <Whitepaper />
      <SocialProof />
      <Footer />
    </>
  );
}

export default App;
