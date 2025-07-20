// pages/api/images.js
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Make sure you’ve set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, etc in .env.local
cloudinary.config({
  secure: true,
});

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Get the logged-in user
  const session = getSession(req, res);
  const auth0Id = session.user.sub;

  // 2. Pull the image data out of the request
  //    You can send either a base64-encoded string or a public URL
  const { imageBase64, imageUrl: publicUrl } = req.body;
  if (!imageBase64 && !publicUrl) {
    return res.status(400).json({ error: 'No imageBase64 or imageUrl provided' });
  }

  try {
    // 3. Upload to Cloudinary
    const uploadSource = imageBase64 || publicUrl;
    const uploadResult = await cloudinary.uploader.upload(uploadSource, {
      folder: 'ht6-dermabot',
    });
    const secureUrl = uploadResult.secure_url;

    // 4. Persist to MongoDB
    const client = await clientPromise;
    const db = client.db('dermabot'); 
    const result = await db.collection('images').insertOne({
      auth0Id,
      url: secureUrl,
      uploadedAt: new Date(),
    });

    // 5. Return ID + URL
    return res.status(200).json({
      imageId: result.insertedId,
      url: secureUrl,
    });
  } catch (err) {
    console.error('🛑 /api/images error:', err);
    return res.status(500).json({ error: 'Failed to upload & save image' });
  }
});
