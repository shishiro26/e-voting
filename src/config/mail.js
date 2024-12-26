import nodemailer from 'nodemailer';
import env from './env.js';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false,
  auth: {
    user: env.mail.user,
    pass: env.mail.password,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: env.mail.fromEmail,
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log('error', error);
    logger.error(`Error occurred while sending email to ${to}: ${error.message}`);
  }
};
