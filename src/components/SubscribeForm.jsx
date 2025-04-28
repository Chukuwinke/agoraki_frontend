import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Submitting…');
    const res = await fetch('/api/subscribeBrevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });

    const data = await res.json().catch(() => null);  // safe JSON parse 
    if (res.ok) {
      setStatus(data.message);
    } else {
      setStatus(`Error: ${data?.error || res.statusText}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
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
