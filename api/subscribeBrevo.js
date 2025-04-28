// /api/subscribeBrevo.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email, name } = req.body;  // Vercel auto-parses JSON bodies :contentReference[oaicite:3]{index=3}
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      // Choose your endpoint:
      // Single opt-in:
      // const url = 'https://api.brevo.com/v3/contacts';
      // Double opt-in:
      const url = 'https://api.brevo.com/v3/contacts/createContactViaDoi';
  
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY   // secure, server‐side only :contentReference[oaicite:4]{index=4}
        },
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: name },
          includeListIds: [/* your list ID(s) */],
          redirectionUrl: 'https://yourdomain.com/thank-you' // for DOI flow :contentReference[oaicite:5]{index=5}
        })
      });
  
      const data = await apiRes.json();
      if (!apiRes.ok) {
        console.error('Brevo API error:', data);
        return res.status(apiRes.status).json({ error: data });
      }
  
      return res.status(200).json({
        message: apiRes.url.endsWith('/createContactViaDoi')
          ? 'Confirmation email sent—please check your inbox.'
          : 'Successfully subscribed!'
      });
    } catch (err) {
      console.error('Subscription error:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  