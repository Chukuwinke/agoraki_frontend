// api/subscribe.js
import fetch from 'node-fetch';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { name, email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: 'Email and reCAPTCHA token are required' });
  }

  // 1) Verify reCAPTCHA v3 token server-side
  const captchaRes = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    })
  , { method: 'POST' });
  const captchaJson = await captchaRes.json();
  if (!captchaJson.success) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed' });
  }

  // 2) Create unconfirmed subscriber in MailerLite
  const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
    },
    body: JSON.stringify({
      email,
      fields: { name },
      groups: [/* YOUR_GROUP_ID */],
      status: 'unconfirmed'
    })
  });
  const mlData = await mlRes.json();
  if (!mlRes.ok) {
    console.error('MailerLite error:', mlData);
    return res.status(mlRes.status).json({ error: mlData });
  }

  // 3) Issue secure, HttpOnly cookie for gating
  const authToken = mlData.data.id;
  res.setHeader('Set-Cookie', cookie.serialize('authToken', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60
  }));
  res.status(200).json({ message: 'Confirmation email sent—please check your inbox.' });
}
