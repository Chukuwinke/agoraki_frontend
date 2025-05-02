import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const steps = ['Preparation', 'Your Details'];

export default function KYCPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  // Category
  const [category, setCategory] = useState('Basic');

  // Basic fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [wallet, setWallet] = useState('');

  // Brand fields
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Progress bar effect
  useEffect(() => {
    const pct = ((currentStep + 1) / steps.length) * 100;
    const bar = document.querySelector('.progress-inner');
    if (bar) bar.style.width = `${pct}%`;
  }, [currentStep]);

  const next = () => setCurrentStep(cs => Math.min(cs + 1, steps.length - 1));
  const prev = () => setCurrentStep(cs => Math.max(cs - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      return next();
    }
    setSubmitting(true);
    setStatus('');

    // Build payload
    const payload = { token, category };
    if (category === 'Basic') {
      payload.firstName = firstName;
      payload.lastName = lastName;
      payload.dateOfBirth = dateOfBirth;
      payload.country = country;
      payload.wallet = wallet;
    } else {
      payload.businessName = businessName;
      payload.contactName = contactName;
      payload.businessEmail = businessEmail;
      payload.website = website;
      payload.registrationNumber = registrationNumber;
    }

    try {
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('Network error; please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="kyc-card text-center p-6">
        <h2 className="text-xl font-semibold mb-4">Application Received</h2>
        <p className="mb-6">
          Thank you for completing your KYC. Your application is under review by our team.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <form className="kyc-card" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">KYC Verification</h2>
      <div className="progress mb-6"><div className="progress-inner"></div></div>

      {currentStep === 0 && (
        <div className="form-section">
          <h3 className="mb-2 font-medium">Before You Start</h3>
          <ul className="checklist mb-6">
            <li>Valid government-issued ID (passport, driver’s license)</li>
            <li>Proof of address (utility bill, bank statement)</li>
            <li>Wallet address ready</li>
          </ul>
          <p className="mb-6 font-medium text-sm">Click <span className="font-semibold">Next</span> to continue.</p>
        </div>
      )}

      {currentStep === 1 && (
        <>
          <div className="form-section">
            <h3 className="mb-2 font-medium">Category</h3>
            <div className="form-row">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="Basic"
                  checked={category === 'Basic'}
                  onChange={() => setCategory('Basic')}
                />{' '}
                Basic User
              </label>
            </div>
            <div className="form-row">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="brand"
                  checked={category === 'brand'}
                  onChange={() => setCategory('brand')}
                />{' '}
                Brand
              </label>
            </div>
            <div className="mb-4 text-sm">
              Fields marked <span className="text-red-500">*</span> are mandatory.
            </div>
          </div>

          {category === 'Basic' && (
            <div className="form-section">
              <div className="form-row">
                <label>First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Country of Residence <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Wallet Address</label>
                <input
                  type="text"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  placeholder="0x..."
                />
              </div>
            </div>
          )}

          {category === 'brand' && (
            <div className="form-section">
              <div className="form-row">
                <label>Business / Brand Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Contact Person Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Business Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={e => setBusinessEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="form-row">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={e => setRegistrationNumber(e.target.value)}
                />
              </div>
            </div>
          )}
        </>
      )}

      {status && <p className="mt-2 text-red-400">{status}</p>}

      <div className="form-actions">
        
        <button type="submit" disabled={submitting} className="btn-primary">
          {currentStep < steps.length - 1 ? 'Next' : submitting ? 'Submitting…' : 'Submit KYC'}
        </button>
        {currentStep > 0 && (
          <button type="button" onClick={prev} className="btn-secondary kyc-btn-back">
            Back
          </button>
        )}
      </div>
    </form>
  );
}
