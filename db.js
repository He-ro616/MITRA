// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Get database credentials from environment variables
const dbURI = process.env.DB_URI; 

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize(dbURI, {
  dialect: 'mysql',
  logging: false, // Optional: disable SQL query logging
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Test the connection
testConnection();

module.exports = sequelize;
// Sync the models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists (use cautiously)
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Run the sync
syncDatabase();
