require('dotenv').config();
const express  = require('express');
const nodemailer = require('nodemailer');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ── */
app.use(cors({
  origin: '*', // tighten this to your domain once deployed
  methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

/* ── Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // your Gmail address
    pass: process.env.GMAIL_PASS,   // Gmail App Password (not your login password)
  },
});

/* ── Health check ── */
app.get('/', (req, res) => res.json({ status: 'Felix backend running ✓' }));

/* ── Contact form endpoint ── */
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body || {};

  // Basic server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    // Email delivered to Felix's inbox
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to:      'felixidowu.01@gmail.com',
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:12px;overflow:hidden;">
          <div style="background:#f0a020;padding:24px 32px;">
            <h2 style="margin:0;color:#070707;font-size:1.4rem;">New Portfolio Message</h2>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 8px;color:#aaa;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;">From</p>
            <p style="margin:0 0 24px;font-size:1.1rem;font-weight:bold;">${escHtml(name)}</p>

            <p style="margin:0 0 8px;color:#aaa;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;">Email</p>
            <p style="margin:0 0 24px;"><a href="mailto:${escHtml(email)}" style="color:#f0a020;">${escHtml(email)}</a></p>

            <p style="margin:0 0 8px;color:#aaa;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
            <div style="background:#141414;border-left:3px solid #f0a020;border-radius:6px;padding:16px 20px;line-height:1.7;">
              ${escHtml(message).replace(/\n/g, '<br>')}
            </div>

            <p style="margin:32px 0 0;color:#555;font-size:0.78rem;">Sent via your portfolio contact form.</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to the sender
    await transporter.sendMail({
      from:    `"Felix Idowu" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: 'Got your message — Felix Idowu',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:12px;overflow:hidden;">
          <div style="background:#f0a020;padding:24px 32px;">
            <h2 style="margin:0;color:#070707;font-size:1.4rem;">Thanks for reaching out, ${escHtml(name)}!</h2>
          </div>
          <div style="padding:32px;line-height:1.8;">
            <p>I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
            <p style="color:#aaa;">Here's a copy of what you sent:</p>
            <div style="background:#141414;border-left:3px solid #f0a020;border-radius:6px;padding:16px 20px;color:#ccc;">
              ${escHtml(message).replace(/\n/g, '<br>')}
            </div>
            <p style="margin-top:28px;">Talk soon,<br><strong style="color:#f0a020;">Felix Idowu</strong><br><span style="color:#666;font-size:0.85rem;">AI Engineer</span></p>
          </div>
        </div>
      `,
    });

    res.json({ message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ message: 'Failed to send email. Please try again later.' });
  }
});

/* ── HTML-escape helper ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
