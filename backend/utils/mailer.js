// backend/utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ This allows self-signed certs
  },
});

/**
 * Send booking confirmation email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of email
 */
const sendBookingMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Event Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Booking email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendBookingMail;
