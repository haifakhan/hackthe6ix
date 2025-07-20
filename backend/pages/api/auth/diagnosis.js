// pages/api/diagnosis.js
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';
import { callGeminiVision, callGeminiChat } from '../../lib/gemini';
import { ObjectId } from 'mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  // 1. Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = getSession(req, res);
  const auth0Id = session.user.sub;

  const { imageId, userNotes } = req.body;
  if (!imageId) {
    return res.status(400).json({ error: 'Missing imageId' });
  }

  // 2. Connect to Mongo
  const client = await clientPromise;
  const db     = client.db('dermabot');

  // 3. Fetch the image URL (and ensure it belongs to this user)
  const img = await db
    .collection('images')
    .findOne({ 
      _id: new ObjectId(imageId), 
      auth0Id     // you’ll need to store auth0Id on upload too
    });
  if (!img) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // 4. Vision → get label & confidence
  const { label, confidence } = await callGeminiVision(img.url);

  // 5. Build prompt & Chat call
  const prompt = `
    I analyzed an image and got "${label}" (${(confidence * 100).toFixed(0)}%).
    User notes: ${userNotes || 'none'}.
    Please explain the condition, suggest next steps, and ask if they'd like a follow-up reminder.
  `;
  const advice = await callGeminiChat(prompt);

  // 6. Persist the diagnosis
  const diagDoc = {
    auth0Id,
    imageId: new ObjectId(imageId),
    label,
    confidence,
    advice,
    createdAt: new Date(),
    nextFollowUp: null
  };
  const { insertedId } = await db.collection('diagnoses').insertOne(diagDoc);

  // 7. Return to the frontend
  res.status(200).json({
    diagnosisId: insertedId,
    label,
    confidence,
    advice,
  });
});
