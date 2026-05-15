import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
