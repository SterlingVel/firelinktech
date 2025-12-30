import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email to business
  const businessMailOptions = {
    from: `FireLink Support <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // business email
    subject: `Contact Form Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Confirmation email to sender (HTML)
  const confirmationMailOptions = {
    from: `FireLink Support <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'We received your message',
    html: `<!-- FireLink Tech - Contact Confirmation Email -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FireLink Tech - Contact Confirmation Email</title>
      <style>
        body {
          background: #f4f4f7;
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .email-container {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }
        .email-header {
          background: linear-gradient(180deg, #1d3557 0%, #457b9d 65%);
          color: #fff;
          padding: 40px 24px 24px 24px;
          text-align: center;
        }
        .email-header img {
          max-width: 160px;
          margin-bottom: 12px;
        }
        .email-title {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        .email-body {
          padding: 48px 24px 54px 24px;
          color: #333;
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .email-footer {
          background: #457b9d;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 400;
          padding: 18px 24px;
          text-align: center;
          border-top: 1px solid #eee;
        }
        .cta-btn {
          display: inline-block;
          margin: 24px 0 0 0;
          padding: 8px 24px;
          background: #d32f2f;
          color: #fff !important;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          transition: background 0.2s;
        }
        .cta-btn:hover {
          background: #b71c1c;
        }
        @media (max-width: 600px) {
          .email-container { margin: 0; border-radius: 0; }
          .email-header, .email-body, .email-footer { padding-left: 12px; padding-right: 12px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="https://firelinktech.com/customLogo.png" alt="FireLink Tech Logo" />
          <div class="email-title">Thank You for Contacting Us!</div>
        </div>
        <div class="email-body">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for reaching out to FireLink Tech! We have received your message and will get back to you as soon as possible.</p>
          <p>If you have any urgent questions, feel free to reply to this email or call us directly at <a href="tel:7864494354" style="color:#1d3557;text-decoration:underline;">(786) 449-4354</a>.</p>
          <a class="cta-btn" href="https://firelinktech.com" style="color:#fff !important;">Visit Our Website</a>
        </div>
        <div class="email-footer">
          <div>&copy; 2025 FireLink Tech. All rights reserved.</div>
          <div>15200 SW 163rd Ave, Southwest Ranches, FL 33331</div>
        </div>
      </div>
    </body>
    </html>`
  };

  try {
    // await transporter.sendMail(businessMailOptions);
    await transporter.sendMail(confirmationMailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
}