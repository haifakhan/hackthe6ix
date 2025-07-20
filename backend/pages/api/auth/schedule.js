// pages/api/schedule.js
import clientPromise from '../../mongodb';

export default async function handler(req, res) {
  const { diagnosisId, weeks } = req.body;  // e.g. weeks = 2
  const nextDate = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);

  const client = await clientPromise;
  const db = client.db('dermabot');

  await db.collection('diagnoses').updateOne(
    { _id: new ObjectId(diagnosisId) },
    { $set: { nextFollowUp: nextDate } }
  );

  res.json({ nextFollowUp: nextDate });
}
