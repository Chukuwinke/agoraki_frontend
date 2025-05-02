// api/kyc.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1) Destructure exactly what we expect
  const {
    token,
    entity,           // 'individual' or 'brand'
    firstName,        // maps to `name`
    lastName,         // maps to `last_name`
    dateOfBirth,      // new field `date_of_birth`
    country,          // existing `country`
    wallet,           // new field `wallet_address`
    businessName,     // maps to `company`
    contactName,      // new field `contact_person_name`
    businessEmail,    // new field `business_email`
    website,          // new field `website_url`
    registrationNumber// new field `registration_number`
  } = req.body;

  // 2) Verify JWT
  let subscriberId;
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    subscriberId = sub;
  } catch {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  // 3) Build fields object matching your MailerLite keys
  const fields = {};

  if (entity === 'individual') {
    fields.name           = firstName;
    fields.last_name      = lastName;
    fields.date_of_birth  = dateOfBirth;
    fields.country        = country;
    if (wallet) fields.wallet_address = wallet;
  } else {
    fields.company                  = businessName;
    fields.contact_person_name      = contactName;
    fields.business_email           = businessEmail;
    if (website) fields.website_url = website;
    if (registrationNumber)
      fields.registration_number    = registrationNumber;
  }

  // Always send confirm_token as well if you want to keep it
  // (optional here, since it already exists)
  // fields.confirm_token = token;

  // 4) Update subscriber: status + custom fields
  try {
    const updateRes = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${subscriberId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
        },
        body: JSON.stringify({
          status: 'active',
          fields
        })
      }
    );
    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error('Update error:', errText);
      return res.status(updateRes.status).json({ error: 'Failed to save KYC data' });
    }
  } catch (err) {
    console.error('Network error updating subscriber:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // 5) Assign to the correct group
  const groupId =
    entity === 'brand'
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
      console.error('Group assignment error:', err);
      return res.status(assignRes.status).json({ error: 'Failed to assign group' });
    }
  } catch (err) {
    console.error('Network error assigning group:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // 6) Done
  return res.status(200).json({ message: 'KYC data submitted successfully.' });
}
