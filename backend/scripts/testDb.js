// scripts/testDb.js
import clientPromise from '../lib/mongodb.js';

async function test() {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses your "dermabot" database by default
    const cols = await db.listCollections().toArray();
    console.log('Collections in dermabot:', cols.map(c => c.name));
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    process.exit();
  }
}

test();
