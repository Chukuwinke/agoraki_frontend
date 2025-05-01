// api/kyc.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, entity, businessName, registration, wallet } = req.body;

  // 1) Verify JWT
  let subscriberId;
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    subscriberId = sub;
  } catch {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  // 2) Confirm subscriber in MailerLite
  try {
    const confirmRes = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${subscriberId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
        },
        body: JSON.stringify({ status: 'active' })
      }
    );
    if (!confirmRes.ok) {
      const errText = await confirmRes.text();
      console.error('MailerLite confirm error:', errText);
      // you can choose to abort here if that fails:
      // return res.status(confirmRes.status).json({ error: errText });
    }
  } catch (err) {
    console.error('Network error confirming subscriber:', err);
    // likewise, you could abort here
  }

  // 3) Assign to the correct group
  const groupId = entity === 'brand'
    ? process.env.MAILERLITE_BRANDS_GROUP_ID
    : process.env.MAILERLITE_USERS_GROUP_ID;

  try {
    const assignRes = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${groupId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!assignRes.ok) {
      const err = await assignRes.json();
      console.error('MailerLite group assignment error:', err);
      return res.status(assignRes.status).json({ error: err });
    }
  } catch (err) {
    console.error('Network error assigning group:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // 4) Success
  return res.status(200).json({ message: 'KYC data submitted successfully.' });
}
