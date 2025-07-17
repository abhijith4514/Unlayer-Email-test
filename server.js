const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
let savedEmails = [];

app.use(bodyParser.json());
app.use(express.static('public'));

// Save email
app.post('/api/save-email', (req, res) => {
  const { design, html } = req.body;
  const id = savedEmails.length + 1;
  savedEmails.push({ id, design, html });
  res.json({ message: 'Saved successfully', id });
});

// Send email
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Email Builder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Send failed:', err);
    res.status(500).json({ error: 'Email sending failed' });
  }
});

// Get email by ID
app.get('/api/email/:id', (req, res) => {
  const email = savedEmails.find(e => e.id == req.params.id);
  if (!email) return res.status(404).send('Not found');
  res.json(email);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
