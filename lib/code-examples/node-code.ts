export const nodeCode = `const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 1. Load the HTML template
const templatePath = path.join(__dirname, 'your-template.html');
let htmlContent = fs.readFileSync(templatePath, 'utf-8');

// 2. Replace variables
htmlContent = htmlContent.replace('{{recipient_name}}', 'Alex');
htmlContent = htmlContent.replace('{{otp_code}}', '123456');

// 3. Configure transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password',
  },
});

// 4. Send email
async function sendEmail() {
  try {
    await transporter.sendMail({
      from: '"Your App" <no-reply@example.com>',
      to: 'recipient@email.com',
      subject: 'Your One-Time Password',
      html: htmlContent,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendEmail();`;