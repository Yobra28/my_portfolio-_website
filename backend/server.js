const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Contact API route
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // transporter (use Gmail or your SMTP)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // your Gmail
                pass: process.env.EMAIL_PASS  // app password
            }
        });

        // email options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // send to yourself
            subject: `Portfolio Contact: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `
        };

        // send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send message." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
