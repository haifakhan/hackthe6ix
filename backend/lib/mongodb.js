// backend/lib/mongodb.js
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local")
}
const uri = process.env.MONGODB_URI
let cachedClient = null

export async function getDb() {
  if (!cachedClient) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await client.connect()
    cachedClient = client
  }
  return cachedClient.db()          // returns the default database
}
