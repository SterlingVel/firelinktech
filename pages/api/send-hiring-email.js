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
      secure: true,
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

    // Confirmation email to applicant
    const applicantMailOptions = {
      from: process.env.SMTP_USER,
      to: email, 
      subject: 'Your job application has been received',
      text: `Hi ${name},\n\nThank you for applying! We have received your application and will review it soon.\n\nBest regards,\nFireLink Tech Inc.`,
    };

    try {
      // await transporter.sendMail(businessMailOptions);

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