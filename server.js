const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendAlert } = require("./sendalert");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint to send an alert
app.post("/send-alert", async (req, res) => {
  const { toNumber, latitude, longitude } = req.body;

  if (!toNumber || !latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Missing required parameters." });
  }

  try {
    const sid = await sendAlert(toNumber, latitude, longitude);
    res.status(200).json({ success: true, sid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});