// src/SubscribeForm.jsx
import React, { useState } from 'react';
import { useGoogleReCaptcha } from '@google-recaptcha/react';

export default function SubscribeForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) {
      return setStatus('You must agree to receive updates and accept our Privacy Policy.');
    }
    // ← Log it here:
    console.log('executeRecaptcha is', executeRecaptcha);  // Should log a function :contentReference[oaicite:0]{index=0}

    if (typeof executeRecaptcha !== 'function') {
      setStatus('reCAPTCHA not ready—please try again.');
      return;
    }
    const token = await executeRecaptcha('subscribe');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, token })
    });
    const data = await res.json();
    setStatus(res.ok ? data.message : `Error: ${data.error}`);
  }

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      {/* Visually-hidden label for accessibility */}
      <label htmlFor="name" className="visually-hidden">Your name</label>
      <input
        id="name"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <label htmlFor="email" className="visually-hidden">Your email</label>
      <input
        id="email"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          required
        />
        <span>
          I agree to receive updates and accept the{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </a>.
        </span>
      </label>

      <button type="submit">Join Waitlist</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
}
