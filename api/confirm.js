// api/confirm.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  console.log('JWT_SECRET loaded?', !!process.env.JWT_SECRET);
  const { token } = req.query;
  try {
    // Verify signature & expiry only
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    // Redirect to KYC with token in URL
    res.writeHead(302, {
      Location: `/kyc?token=${encodeURIComponent(token)}`
    });
    res.end();
  } catch {
    return res.status(400).send('Invalid or expired confirmation token');
  }
}
