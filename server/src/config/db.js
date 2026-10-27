const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/it_support_desk';

  try {
    // Attempt standard connection first with 2.5s timeout
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Standard MongoDB connection failed (${err.message}). Initializing embedded in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${memoryUri}`);
      return conn;
    } catch (fallbackErr) {
      console.error('❌ Failed to start in-memory MongoDB:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
