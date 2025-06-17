// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'], // Path to setup file
  // testTimeout: 30000, // Optional: Increase timeout for DB operations
};
