import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// API to handle form submission
app.post("/api/volunteers", (req, res) => {
    const { id, name, email, phone, address, location } = req.body;
    const sql = `INSERT INTO volunteers (id, name, email, phone, address, location) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [id, name, email, phone, address, location], (err, result) => {
        if (err) {
            console.error("Error inserting data: ", err);
            return res.status(500).json({ error: "Failed to submit form" });
        }
        res.status(201).json({ message: "Volunteer Registered Successfully!" });
    });
});

// Test route
app.get("/", (req, res) => {
    res.send("Mitra Volunteer Backend Running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
