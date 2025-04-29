// api/subscribe.js
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 0) Parse and sanity-check the incoming payload
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

  //  ————————————————————————————————————————————————
  //  If this comes back `success: false`, 
  //  check `details` in the browser response:
  //    • invalid-input-secret → your SECRET_KEY is wrong
  //    • invalid-input-response → the token is bad/expired
  //    • timeout-or-duplicate   → you reused a token
  //  Also be sure you’ve added "agoraki.vercel.app" 
  //  under **Allowed domains** in your reCAPTCHA site settings!
  //  ————————————————————————————————————————————————
  if (!captchaJson.success) {
    console.error('reCAPTCHA failed:', captchaJson['error-codes']);
    return res.status(400).json({
      error: 'reCAPTCHA validation failed',
      details: captchaJson['error-codes']  // send codes back to client for debugging
    });
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
    maxAge: 60 * 60  // 1 hour
  }));

  // 4) Success
  return res.status(200).json({ message: 'Confirmation email sent—please check your inbox.' });
}
