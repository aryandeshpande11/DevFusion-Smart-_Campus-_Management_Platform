// single place that knows how to send emails, so services just call sendMail with a template name
//
// NOTE: switched from raw SMTP (nodemailer) to Resend's HTTPS API.
// Render's outbound networking is unreliable/blocked on SMTP ports (25/465/587),
// which is what caused "Connection timeout" errors when sending via SMTP.
// The HTTPS API runs over port 443, which is always open.
const env = require('../config/env');

const RESEND_API_URL = 'https://api.resend.com/emails';

// env.smtpPass already holds the Resend API key (re_xxx) from the SMTP integration,
// so we reuse it here — no new environment variables needed.
async function sendViaResend({ to, subject, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.smtpPass}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

async function sendVerificationEmail(toEmail, verifyLink) {
  await sendViaResend({
    to: toEmail,
    subject: 'Verify your Smart Campus account',
    html: `<p>Welcome! Click below to verify your email:</p><a href="${verifyLink}">Verify Email</a>`,
  });
}

async function sendOtpEmail(toEmail, otp) {
  await sendViaResend({
    to: toEmail,
    subject: 'Your password reset code',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
}

async function sendDeadlineReminderEmail(toEmail, assignmentTitle, deadline) {
  await sendViaResend({
    to: toEmail,
    subject: `Reminder: ${assignmentTitle} is due soon`,
    html: `<p>${assignmentTitle} is due on ${deadline}. Don't forget to submit!</p>`,
  });
}

module.exports = { sendVerificationEmail, sendOtpEmail, sendDeadlineReminderEmail };