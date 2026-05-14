# Felix Portfolio — Contact Form Backend

Express + Nodemailer backend for the portfolio contact form.

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Then open .env and fill in GMAIL_PASS (see below)

# 3. Start the server
npm start
# → http://localhost:3000
```

---

## Getting Your Gmail App Password

> You need this because Google blocks "less secure" sign-ins.

1. Go to **https://myaccount.google.com/security**
2. Make sure **2-Step Verification** is ON
3. Search for **"App passwords"** in the search bar
4. Click **App passwords** → choose **Mail** → **Other** → name it "Portfolio"
5. Copy the **16-character code** (e.g. `abcd efgh ijkl mnop`)
6. Paste it (without spaces) as `GMAIL_PASS` in your `.env`

---

## Deploy to Render (free)

This is already what your frontend points to (`backend-m0xb.onrender.com`).

1. Push this folder to a **GitHub repo**
2. Go to **https://render.com** → New → **Web Service**
3. Connect your repo
4. Settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `GMAIL_USER` = `felixidowu.01@gmail.com`
   - `GMAIL_PASS` = your 16-char app password
6. Deploy — Render gives you a URL like `https://your-app.onrender.com`
7. Update the fetch URL in `index.html` if needed:
   ```js
   fetch('https://your-app.onrender.com/api/send-email', ...)
   ```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/send-email` | Send contact form email |

### POST `/api/send-email`

**Request body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello Felix!"
}
```

**Success response:**
```json
{ "message": "Email sent successfully." }
```

Sends:
- ✅ Notification email to `felixidowu.01@gmail.com`
- ✅ Auto-reply confirmation to the sender
