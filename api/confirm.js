// api/confirm.js
import cookie from 'cookie';

export default function handler(req, res) {
  // 1) Parse existing cookies
  const cookies = cookie.parse(req.headers.cookie || '');

  // 2) Only set authToken if it doesn't already exist
  if (!cookies.authToken) {
    const { token } = req.query;
    if (token) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60, // 1 hour
        })
      );
    }
  }

  // 3) Then redirect—no matter what—to /kyc
  res.writeHead(302, { Location: '/kyc' });
  res.end();
}
