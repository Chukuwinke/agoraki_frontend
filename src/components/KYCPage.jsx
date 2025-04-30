// src/KYCPage.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function KYCPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');             // JWT from URL

  const [entity, setEntity]         = useState('user');
  const [businessName, setBusiness] = useState('');
  const [registration, setReg]      = useState('');
  const [wallet, setWallet]         = useState('');
  const [status, setStatus]         = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      entity,
      businessName: entity === 'brand' ? businessName : undefined,
      registration: entity === 'brand' ? registration : undefined,
      wallet: entity === 'user' ? wallet : undefined,
      token   // pass the JWT instead of relying on a cookie
    };

    const res  = await fetch('/api/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok) {
      navigate('/dashboard');
    } else {
      setStatus(`Error: ${data.error}`);
    }
  }

  return (
    <form className="kyc-form" onSubmit={handleSubmit}>
      <h2>KYC Questionnaire</h2>

      <fieldset>
        <legend>I am a:</legend>
        <label>
          <input
            type="radio"
            name="entity"
            value="user"
            checked={entity === 'user'}
            onChange={() => setEntity('user')}
          />
          Regular User
        </label>
        <label>
          <input
            type="radio"
            name="entity"
            value="brand"
            checked={entity === 'brand'}
            onChange={() => setEntity('brand')}
          />
          Brand
        </label>
      </fieldset>

      {entity === 'brand' && (
        <>
          <label>
            <span>Business Name</span>
            <input
              type="text"
              value={businessName}
              onChange={e => setBusiness(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Registration Number</span>
            <input
              type="text"
              value={registration}
              onChange={e => setReg(e.target.value)}
              required
            />
          </label>
        </>
      )}

      {entity === 'user' && (
        <label>
          <span>Wallet Address</span>
          <input
            type="text"
            value={wallet}
            onChange={e => setWallet(e.target.value)}
            required
          />
        </label>
      )}

      <button type="submit">Submit KYC</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
}
