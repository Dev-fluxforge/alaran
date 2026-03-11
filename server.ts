import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 3000) : 3001;

app.use(express.json());

// Serve static files from the Angular build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

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
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
