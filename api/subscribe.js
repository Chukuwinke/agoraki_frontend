// api/subscribe.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    // Vercel already parsed the JSON for us:
    const { email, name } = req.body;           // :contentReference[oaicite:2]{index=2}
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const apiRes = await fetch(
        'https://connect.mailerlite.com/api/subscribers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
          },
          body: JSON.stringify({ email, fields: { name } })
        }
      );
  
      const apiData = await apiRes.json();
      if (!apiRes.ok) {
        console.error('MailerLite API error:', apiData);
        return res.status(apiRes.status).json({ error: apiData });
      }
  
      return res
        .status(200)
        .json({ message: 'Confirmation email sent. Check your inbox.' });
    } catch (err) {
      console.error('Subscription error:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  