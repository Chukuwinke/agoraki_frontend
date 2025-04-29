// api/subscribe.js
import cookie from 'cookie';

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body
  const { name, email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: 'Email and reCAPTCHA token are required' });
  }

  console.log('Subscribe payload:', { name, email, token });

  // 1) Verify reCAPTCHA v3 token server-side
  let captchaJson;
  try {
    const captchaRes = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }),
      }
    );
    captchaJson = await captchaRes.json();
    console.log('reCAPTCHA response:', captchaJson);
  } catch (err) {
    console.error('reCAPTCHA fetch error:', err);
    return res.status(500).json({ error: 'reCAPTCHA verification failed' });
  }

  if (!captchaJson.success) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed' });
  }

  // 2) Create unconfirmed subscriber in MailerLite
  const groupId = process.env.MAILERLITE_USERS_GROUP_ID;
  if (!groupId) {
    console.error('Missing MAILERLITE_USERS_GROUP_ID env var');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  let mlRes, mlData;
  try {
    mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        fields: { name },
        groups: [ groupId ],
        status: 'unconfirmed'
      })
    });
    mlData = await mlRes.json();
    console.log('MailerLite response:', mlData);
  } catch (err) {
    console.error('MailerLite fetch error:', err);
    return res.status(500).json({ error: 'Subscription service error' });
  }

  if (!mlRes.ok) {
    console.error('MailerLite error payload:', mlData);
    return res.status(mlRes.status).json({ error: mlData });
  }

  // 3) Issue secure, HttpOnly cookie for gating
  const authToken = mlData.data.id;
  res.setHeader('Set-Cookie', cookie.serialize('authToken', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 // 1 hour
  }));

  // Final success response
  res.status(200).json({ message: 'Confirmation email sent—please check your inbox.' });
}
