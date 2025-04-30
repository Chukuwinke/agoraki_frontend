import React from 'react';
import SubscribeForm from './SubscribeForm';

export default function Hero() {
  return (
    <header className="hero">
      <video autoPlay muted loop playsInline>
        <source src="/agoraki.mp4" type="video/mp4" />
        <source src="/agoraki.webm" type="video/webm" />
      </video>
      <div className="content">
        <h1>Agoraki: Where Fashion Meets Blockchain</h1>
        <p className="lead">
          Bridge the physical and digital realms — verify your style, join an exclusive community.
        </p>
        <SubscribeForm />
        
      </div>
    </header>
  );
}