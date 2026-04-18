const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendEmail = async (options) => {
  // For development, use mock email system
  if (process.env.NODE_ENV === 'development') {
    const emailsDir = path.join(__dirname, '../logs');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const emailLog = {
      timestamp,
      to: options.email,
      subject: options.subject,
      message: options.message,
      html: options.html || null
    };

    // Save to file
    const logFile = path.join(emailsDir, 'emails.json');
    let emails = [];
    
    if (fs.existsSync(logFile)) {
      try {
        emails = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch (e) {
        emails = [];
      }
    }
    
    emails.push(emailLog);
    fs.writeFileSync(logFile, JSON.stringify(emails, null, 2));

    // Log to console for easy access
    console.log('\n📧 ===== MOCK EMAIL SENT =====');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('==============================\n');

    return { messageId: `mock-${Date.now()}` };
  }

  // For production, use real email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
  
  return info;
};

module.exports = sendEmail;
