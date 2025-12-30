import { IncomingForm } from 'formidable';
import nodemailer from 'nodemailer';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Form parse error' });
    }

    const { name, email, phone, message } = fields;
    const resumeFile = files.resume;

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
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, 
      subject: `Job Application from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      attachments: resumeFile
        ? [
            {
              filename: resumeFile.originalFilename,
              path: resumeFile.filepath,
              contentType: resumeFile.mimetype,
            },
          ]
        : [],
    };

    // Confirmation email to applicant (HTML)
    const applicantMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your FireLink Tech job application has been received',
      html: `<!-- FireLink Tech - Hiring Confirmation Email -->
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FireLink Tech - Hiring Confirmation Email</title>
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
          color: #fff;
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
          <img src="https://firelinktech.com/icons/firelink-logo.png" alt="FireLink Tech Logo" />
          <div class="email-title">Thank You for Your Application!</div>
        </div>
        <div class="email-body">
          <p>Hi <strong>${name}</strong>,</p>
          <p>We have received your application for a position at FireLink Tech. Our team will review your submission and contact you if your qualifications match our requirements.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <a class="cta-btn" href="https://firelinktech.com">Visit Our Website</a>
        </div>
        <div class="email-footer">
          &copy; 2025 FireLink Tech. All rights reserved.<br>
          15200 SW 163rd Ave, Southwest Ranches, FL 33331
        </div>
      </div>
      </body>
      </html>`
    };

    try {
      await transporter.sendMail(businessMailOptions);
      await transporter.sendMail(applicantMailOptions);

      // Delete uploaded file after sending
      if (resumeFile) {
        fs.unlink(resumeFile.filepath, () => {});
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
}