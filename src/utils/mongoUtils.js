const { MongoClient } = require('mongodb');
const { logInfo, logError } = require('../config/loggerConfig');

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
    logInfo('Connected to MongoDB successfully!');
    return db;
  } catch (error) {
    logError('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getMongoDB = () => {
  if (!db) {
    throw new Error('MongoDB is not connected. Call connectToMongoDB() first.');
  }
  return db;
};

const createDocument = async (collectionName, document) => {
  try {
    const collection = getMongoDB().collection(collectionName);
    const result = await collection.insertOne(document);
    logInfo(`Created document in collection ${collectionName}:`, result.insertedId);
    return result;
  } catch (error) {
    logError(`Error creating document in collection ${collectionName}:`, error);
    throw error;
  }
};

const readDocument = async (collectionName, query) => {
  try {
    const collection = getMongoDB().collection(collectionName);
    const document = await collection.findOne(query);
    logInfo(`Read document from collection ${collectionName}:`, document);
    return document;
  } catch (error) {
    logError(`Error reading document from collection ${collectionName}:`, error);
    throw error;
  }
};

const updateDocument = async (collectionName, query, update) => {
  try {
    const collection = getMongoDB().collection(collectionName);
    const result = await collection.updateOne(query, { $set: update });
    logInfo(`Updated document in collection ${collectionName}:`, result.matchedCount);
    return result;
  } catch (error) {
    logError(`Error updating document in collection ${collectionName}:`, error);
    throw error;
  }
};

const deleteDocument = async (collectionName, query) => {
  try {
    const collection = getMongoDB().collection(collectionName);
    const result = await collection.deleteOne(query);
    logInfo(`Deleted document from collection ${collectionName}:`, result.deletedCount);
    return result;
  } catch (error) {
    logError(`Error deleting document from collection ${collectionName}:`, error);
    throw error;
  }
};

const findDocuments = async (collectionName, query, options = {}) => {
  try {
    const collection = getMongoDB().collection(collectionName);
    const documents = await collection.find(query, options).toArray();
    logInfo(`Found ${documents.length} documents in collection ${collectionName}:`, documents);
    return documents;
  } catch (error) {
    logError(`Error finding documents in collection ${collectionName}:`, error);
    throw error;
  }
};

module.exports = {
  connectToMongoDB,
  getMongoDB,
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  findDocuments,
};