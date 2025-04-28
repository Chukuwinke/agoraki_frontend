import React, { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    const data = await res.json();
    setStatus(res.ok ? data.message : `Error: ${data.error}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Join Waitlist</button>
      {status && <p>{status}</p>}
    </form>
  );
}
