// api/confirm.js
export default function handler(req, res) {
    // MailerLite has already marked the subscriber confirmed.
    // We do NOT overwrite authToken here—leave the real subscriber ID cookie intact.
    
    // Redirect to your KYC page in the SPA:
    res.writeHead(302, { Location: '/kyc' });
    res.end();
  }
  