require("dotenv").config();
const twilio = require("twilio");

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Sends an SOS alert via SMS with a Google Maps location link.
 * @param {string} toNumber - The recipient's phone number (in E.164 format, e.g., +1234567890).
 * @param {string} latitude - The latitude of the location.
 * @param {string} longitude - The longitude of the location.
 * @returns {Promise<string>} - The SID of the sent message if successful.
 */
const sendAlert = async (toNumber, latitude, longitude) => {
  try {
    if (!toNumber || !latitude || !longitude) {
      throw new Error("Missing required parameters: toNumber, latitude, or longitude.");
    }

    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = `🚨 Emergency! SOS Alert from Mitra.\n📍 Location: ${googleMapsLink}`;

    const sms = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: toNumber,
    });

    console.log(`✅ Alert Sent! SID: ${sms.sid}`);
    return sms.sid;
  } catch (error) {
    console.error("❌ Error sending alert:", error.message);
    throw error;
  }
};

// Export the function for use in other files
module.exports = { sendAlert };
