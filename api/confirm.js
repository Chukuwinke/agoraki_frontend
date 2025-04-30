// api/confirm.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  console.log('JWT_SECRET loaded?', !!process.env.JWT_SECRET);
  const { token } = req.query;
  try {
    // Validate signature and expiry
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // Redirect to KYC with the same token
    res.writeHead(302, {
      Location: `/kyc?token=${encodeURIComponent(token)}`
    });
    return res.end();
  } catch {
    return res.status(400).send('Invalid or expired confirmation token');
  }
}
