// api/subscribe.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { email, name } = JSON.parse(req.body);
  
    try {
      const mlRes = await fetch(
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
      if (!mlRes.ok) {
        const err = await mlRes.text();
        return res.status(mlRes.status).json({ error: err });
      }
      return res.status(200).json({
        message: 'Confirmation email sent. Check your inbox to confirm.'
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  