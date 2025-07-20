// pages/api/test-connect.js
import clientPromise from '../../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();  // "dermabot" by default

    // Insert a sample document into a new collection called "ping"
    const result = await db
      .collection('ping')
      .insertOne({ message: 'Hello, Atlas!', date: new Date() });

    res.status(200).json({
      insertedId: result.insertedId,
      note: 'Check your Atlas UI → ping collection',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
}
