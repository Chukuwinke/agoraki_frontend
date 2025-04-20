import React from 'react';
import TagIcon from './icons/TagIcon';
import ScanIcon      from './icons/ScanIcon';
import ShareIcon      from './icons/ShareIcon';

export default function Steps() {
  return (
    <>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
      <section className="steps grid">
        <div>
          <TagIcon />
          <h4>Tag & Mint</h4>
          <p>Attach an NFC/QR tag at production.</p>
        </div>
        <div>
          <ScanIcon />
          <h4>Scan & Verify</h4>
          <p>Confirm authenticity in one tap.</p>
        </div>
        <div>
          <ShareIcon />
          <h4>Share & Reward</h4>
          <p>Post verified outfits, earn points & tokens.</p>
        </div>
      </section>
    </>
    
  );
}
