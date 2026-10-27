const serverless = require('serverless-http');
const { app } = require('../../server/src/server');
const { connectDB } = require('../../server/src/config/db');
const { seedDatabase } = require('../../server/src/seeds/seedData');

let isConnected = false;

// Initialize serverless wrapper with binary support
const serverlessHandler = serverless(app, {
  request: (req, event) => {
    // Ensure req.url retains /api prefix for Express router matching
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  },
});

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    try {
      await connectDB();
      await seedDatabase();
      isConnected = true;
    } catch (err) {
      console.error('Database connection error in Netlify function:', err.message);
    }
  }

  return await serverlessHandler(event, context);
};
