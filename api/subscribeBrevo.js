// api/subscribeBrevo.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email, name } = req.body;  // Vercel auto-parses JSON bodies :contentReference[oaicite:6]{index=6}
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      // Double Opt-In endpoint:
      const url = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
  
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY   // secure server-side only :contentReference[oaicite:7]{index=7}
        },
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: name },
          includeListIds: [ 3 ],
          redirectionUrl: 'https://yourdomain.com/thank-you'  // post-confirm redirect :contentReference[oaicite:8]{index=8}
        })
      });
  
      const data = await apiRes.json();
      if (!apiRes.ok) {
        console.error('Brevo API error:', data);
        return res.status(apiRes.status).json({ error: data });
      }
  
      return res.status(200).json({
        message: 'Confirmation email sent—please check your inbox.'
      });
    } catch (err) {
      console.error('Subscription error:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  