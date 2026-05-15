import { MongoClient } from 'mongodb';

const baseUri = "mongodb+srv://nandiprasadkm18_db_user:PASSWORD@cluster0.8l3ckd4.mongodb.net/?appName=Cluster0";
const passwords = [
  "j849yHgHBGydhtSr",
  "j849yHgHBGYdhtSr"
];

async function testAll() {
  for (const pw of passwords) {
    const uri = baseUri.replace("PASSWORD", pw);
    const client = new MongoClient(uri);
    try {
      console.log(`Testing password: ${pw}`);
      await client.connect();
      console.log(`Success with: ${pw}`);
      process.exit(0);
    } catch (e) {
      console.log(`Failed with: ${pw} - ${e.message}`);
    } finally {
      await client.close();
    }
  }
  process.exit(1);
}

testAll();
