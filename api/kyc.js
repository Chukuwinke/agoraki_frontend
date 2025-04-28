// api/kyc.js

import cookie from 'cookie';

export default async function handler(req, res) {
  // 1) Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2) Parse authToken cookie for subscriber ID
  const { authToken: subscriberId } = cookie.parse(req.headers.cookie || '');
  if (!subscriberId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // 3) Read KYC data from body
  const { entity, businessName, registration, wallet } = req.body;

  // 4) Choose group based on entity
  const groupId = entity === 'brand'
    ? process.env.MAILERLITE_BRANDS_GROUP_ID
    : process.env.MAILERLITE_USERS_GROUP_ID;

  try {
    // 5) Call MailerLite Connect API
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

    // 6) Success
    return res.status(200).json({ message: 'KYC data submitted successfully.' });
  } catch (err) {
    console.error('KYC API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
