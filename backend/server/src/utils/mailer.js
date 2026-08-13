// single place that knows how to send emails, so services just call sendMail with a template name
const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  auth: { user: env.smtpUser, pass: env.smtpPass },
});

async function sendVerificationEmail(toEmail, verifyLink) {
  await transporter.sendMail({
    from: env.emailFrom,
    to: toEmail,
    subject: 'Verify your Smart Campus account',
    html: `<p>Welcome! Click below to verify your email:</p><a href="${verifyLink}">Verify Email</a>`,
  });
}

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: env.emailFrom,
    to: toEmail,
    subject: 'Your password reset code',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
}

async function sendDeadlineReminderEmail(toEmail, assignmentTitle, deadline) {
  await transporter.sendMail({
    from: env.emailFrom,
    to: toEmail,
    subject: `Reminder: ${assignmentTitle} is due soon`,
    html: `<p>${assignmentTitle} is due on ${deadline}. Don't forget to submit!</p>`,
  });
}

module.exports = { sendVerificationEmail, sendOtpEmail, sendDeadlineReminderEmail };
