import React from 'react';

export default function Hero({ onJoin }) {
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
        <form onSubmit={onJoin}>
          <input type="email" name="email" placeholder="Enter your email" required />
          <button type="submit">Join the Waitlist</button>
        </form>
        <p style={{ fontSize: '.8rem', color: '#aaa' }}>
          Be the first to experience Agoraki. Limited spots — invitation only.
        </p>
      </div>
    </header>
  );
}
