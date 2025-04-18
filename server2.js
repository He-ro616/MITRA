require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');

// Create an Express app
const app = express();

// Set up middleware
app.use(express.json()); // To parse JSON data

// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Aryan@1234',
  database: process.env.DB_NAME || 'disaster_reports',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to MySQL');
});

// Endpoint to handle disaster report submission
app.post('/submit-report', (req, res) => {
  const { disasterType, location, description, contact } = req.body;

  // Basic validation
  if (!disasterType || !location || !description || !contact) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields.' });
  }

  // SQL query to insert the data
  const query = 'INSERT INTO reports (disaster_type, location, description, contact) VALUES (?, ?, ?, ?)';

  db.query(query, [disasterType, location, description, contact], (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
    res.status(201).json({ success: true, message: 'Report submitted successfully!', id: result.insertId });
  });
});

// Set up the server to listen on a configurable port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});