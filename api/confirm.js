// api/confirm.js
import cookie from 'cookie';

export default function handler(req, res) {
    // We already set `authToken` in /api/subscribe.  
    res.writeHead(302, { Location: '/kyc' });
    res.end();
  }