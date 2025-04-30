// api/kyc.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, entity } = req.body;
  let subscriberId;

  try {
    // Verify JWT from the URL
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    subscriberId = payload.sub;
  } catch {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  // Pick the correct group
  const groupId = entity === 'brand'
    ? process.env.MAILERLITE_BRANDS_GROUP_ID
    : process.env.MAILERLITE_USERS_GROUP_ID;

  // Assign the subscriber to that group
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
    return res.status(assignRes.status).json({ error: err });
  }

  return res.status(200).json({ message: 'KYC data submitted successfully.' });
}
