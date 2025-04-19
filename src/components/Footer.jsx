// src/components/Footer.jsx
import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer>
      <div className="social-links">
        <a href="https://twitter.com/Agoraki" aria-label="Twitter" target="_blank" rel="noopener">
          <FaTwitter />
        </a>
        <a href="https://instagram.com/Agoraki" aria-label="Instagram" target="_blank" rel="noopener">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com/company/Agoraki" aria-label="LinkedIn" target="_blank" rel="noopener">
          <FaLinkedin />
        </a>
        <a href="https://github.com/Agoraki" aria-label="GitHub" target="_blank" rel="noopener">
          <FaGithub />
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
