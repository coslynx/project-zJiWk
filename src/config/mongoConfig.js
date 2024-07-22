const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

let client;
let db;

const connectToMongoDB = async () => {
  try {
    client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB successfully!');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getMongoDB = () => {
  if (!db) {
    throw new Error('MongoDB is not connected. Call connectToMongoDB() first.');
  }
  return db;
};

module.exports = {
  connectToMongoDB,
  getMongoDB,
};