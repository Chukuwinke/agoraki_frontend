// api/subscribe.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, token: recaptchaToken } = req.body;
  if (!email || !recaptchaToken) {
    return res.status(400).json({ error: 'Email and reCAPTCHA token are required' });
  }

  // 1) Verify reCAPTCHA v3 token
  const captchaRes = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }),
    }
  );
  const captchaJson = await captchaRes.json();
  if (!captchaJson.success) {
    return res.status(400).json({
      error: 'reCAPTCHA validation failed',
      details: captchaJson['error-codes'] || []
    });
  }

  // 2) Create unconfirmed subscriber in MailerLite
  const createRes = await fetch(
    'https://connect.mailerlite.com/api/subscribers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        fields: { name },
        groups: [ process.env.MAILERLITE_USERS_GROUP_ID ],
        status: 'unconfirmed',
        resubscribe: true
      })
    }
  );
  const createData = await createRes.json();
  if (!createRes.ok) {
    console.error('MailerLite create error:', createData);
    return res.status(createRes.status).json({ error: createData });
  }

  // 3) Generate one-time JWT
  const subscriberId = createData.data.id;
  const now = Math.floor(Date.now() / 1000);
  const jwtToken = jwt.sign(
    { sub: subscriberId, iat: now, exp: now + 3600 },
    process.env.JWT_SECRET,
    { algorithm: 'HS256' }
  );

  // 4) Store JWT into the subscriber's custom field
  await fetch(
    `https://connect.mailerlite.com/api/subscribers/${subscriberId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        fields: { confirm_token: jwtToken }
      })
    }
  );

  // 5) Let MailerLite send its double-opt-in email now
  return res.status(200).json({ message: 'Confirmation email sent—please check your inbox.' });
}
