// src/SubscribeForm.jsx
import React, { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function SubscribeForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus]   = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Clear previous status
    setStatus('');

    if (typeof executeRecaptcha !== 'function') {
      setStatus('reCAPTCHA not ready—please try again.');
      return;
    }

    try {
      // 1) get the token
      const token = await executeRecaptcha('subscribe');

      // 2) send to our API
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, token })
      });
      const data = await res.json();

      // 3) handle the response
      if (!res.ok) throw new Error(data.error || 'Subscription failed');

      // Reset form fields
      setName('');
      setEmail('');
      setConsent(false);

      // Show confirmation with email
      setStatus(data.message);
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus(`Error: ${err.message}`);
    }
  }, [executeRecaptcha, name, email]);

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
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
