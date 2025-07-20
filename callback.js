// pages/api/auth/callback.js (after you verify Auth0 JWT)
import clientPromise from '../../../mongodb';

export default async function handler(req, res) {
  const { auth0Id, email } = req.user;  // whatever Auth0 gives you

  const client = await clientPromise;
  const db = client.db('dermabot');

  // Upsert the user document
  await db.collection('users').updateOne(
    { auth0Id },
    { $set: { auth0Id, email, updatedAt: new Date() } },
    { upsert: true }
  );

  res.end(); // continue your Auth0 flow
}
