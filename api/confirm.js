// api/confirm.js
import cookie from 'cookie';

export default function handler(req, res) {
  const { token } = req.query;
  // (validate token if you store separately)
  res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60
  }));
  res.writeHead(302, { Location: '/kyc' });
  res.end();
}
