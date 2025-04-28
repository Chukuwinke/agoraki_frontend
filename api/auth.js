// api/auth.js
import cookie from 'cookie';

export default function handler(req, res) {
  const { authToken } = cookie.parse(req.headers.cookie || '');
  const valid = Boolean(authToken);
  res.status(200).json({ authenticated: valid });
}
