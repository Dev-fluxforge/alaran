import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.NODE_ENV === 'production' ? (process.env.PORT || 3000) : 3003);

console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}...`);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(express.json());

// Serve static files from the Angular build directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn(`Warning: dist directory not found at ${distPath}. Static files will not be served.`);
}

// API route for contact form
app.post('/api/contact', async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Configure your SMTP transporter here
    // For Gmail, you'd use an App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'alarangeoserviceslimited@gmail.com',
        pass: process.env.EMAIL_PASS, // User must provide this in settings
      },
    });

    const mailOptions = {
      from: email,
      to: 'alarangeoserviceslimited@gmail.com',
      subject: `Contact Form: ${subject}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    };

    // If EMAIL_PASS is not provided, we'll just log it for now
    if (!process.env.EMAIL_PASS) {
      console.log('EMAIL_PASS not set. Logging message instead of sending:');
      console.log(mailOptions);
      return res.status(200).json({ 
        message: 'Message received (Development Mode: logged to console). Please set EMAIL_PASS to send real emails.',
        devMode: true 
      });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// For any other request, serve the Angular index.html
app.get('(.*)', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not Found (and index.html missing)');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});
