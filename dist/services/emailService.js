"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        try {
            if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.warn('⚠️  Email credentials not configured. Email sending will be disabled.');
                return;
            }
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            console.log('✅ Email service initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            this.transporter = null;
        }
    }
    async sendEmail(options) {
        if (!this.transporter) {
            console.warn('⚠️  Email transporter not initialized. Skipping email send.');
            return false;
        }
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${options.to} - Message ID: ${info.messageId}`);
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to send email to ${options.to}:`, error);
            return false;
        }
    }
    async sendWaitlistConfirmation(email, name) {
        const subject = '🎉 Welcome to SyncStudy Waitlist!';
        const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You're on the List!</h1>
    </div>
    <div class="content">
      <h2>Hey ${name || 'there'}! 👋</h2>
      <p>Welcome to the <strong>SyncStudy</strong> waitlist! We're thrilled to have you join our community of students who are ready to revolutionize the way they study.</p>

      <h3>What's Next?</h3>
      <ul>
        <li>✨ You'll be among the first to access SyncStudy when we launch</li>
        <li>📚 Get exclusive updates on our development progress</li>
        <li>🎁 Special early-adopter perks and features</li>
        <li>💬 Direct line to our team for feedback and suggestions</li>
      </ul>

      <h3>While You Wait...</h3>
      <p>Help us build the perfect study platform by sharing your ideas and feedback. Your input shapes what we create!</p>

      <div style="text-align: center;">
        <a href="https://www.syncstudy.ink/#suggestions" class="button">Share Your Ideas</a>
      </div>

      <p><strong>Questions?</strong> Just reply to this email - we'd love to hear from you!</p>

      <p style="margin-top: 30px;">
        Cheers,<br>
        <strong>The SyncStudy Team</strong> 🚀
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this email because you joined the SyncStudy waitlist.</p>
      <p>© 2025 SyncStudy. Learn smarter. Grow faster. Together.</p>
    </div>
  </div>
</body>
</html>
    `;
        return await this.sendEmail({ to: email, subject, html });
    }
    async sendSuggestionConfirmation(email) {
        const subject = '💡 Thanks for Your Suggestion!';
        const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💡 Suggestion Received!</h1>
    </div>
    <div class="content">
      <h2>Thanks for Your Input! 🙌</h2>
      <p>We've received your suggestion and our team is reviewing it. Your feedback is incredibly valuable in helping us build a better platform for students like you.</p>

      <h3>What Happens Next?</h3>
      <ul>
        <li>🔍 Our team will carefully review your suggestion</li>
        <li>📊 We'll evaluate how it fits into our roadmap</li>
        <li>✅ If we implement it, we'll let you know!</li>
      </ul>

      <p>We read every suggestion submitted, and many of our best features come directly from student feedback.</p>

      <div style="text-align: center;">
        <a href="https://www.syncstudy.ink/#waitlist" class="button">Join Our Waitlist</a>
      </div>

      <p><strong>Have more ideas?</strong> We'd love to hear them! Feel free to submit as many suggestions as you'd like.</p>

      <p style="margin-top: 30px;">
        Cheers,<br>
        <strong>The SyncStudy Team</strong> 🚀
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this email because you submitted a suggestion to SyncStudy.</p>
      <p>© 2025 SyncStudy. Learn smarter. Grow faster. Together.</p>
    </div>
  </div>
</body>
</html>
    `;
        return await this.sendEmail({ to: email, subject, html });
    }
    // Helper to strip HTML tags for plain text fallback
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }
    // Test email connection
    async verifyConnection() {
        if (!this.transporter) {
            return false;
        }
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        }
        catch (error) {
            console.error('❌ Email server connection failed:', error);
            return false;
        }
    }
}
// Create singleton instance
exports.emailService = new EmailService();
exports.default = exports.emailService;
//# sourceMappingURL=emailService.js.map