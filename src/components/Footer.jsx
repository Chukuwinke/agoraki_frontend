// src/components/Footer.jsx
import React from 'react';
import { FaXTwitter, FaInstagram, FaMedium, FaDiscord } from 'react-icons/fa6';
import { socialLinks } from '../config/socialLinks';

export default function Footer() {
  return (
    <footer>
      <div className="social-links">
        <a href={socialLinks.x} aria-label="Twitter" target="_blank" rel="noopener">
          <FaXTwitter />
        </a>
        <a href={socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener">
          <FaInstagram />
        </a>
        <a href={socialLinks.medium} aria-label="LinkedIn" target="_blank" rel="noopener">
          <FaMedium />
        </a>
      </div>
      <div className="footer-links">
        <a href="/privacy">Privacy</a>·
        <a href="/terms">Terms</a>·
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
}
