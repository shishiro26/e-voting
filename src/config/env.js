import dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config();

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    PORT: z.coerce.number().positive(),
    MONGO_URI: z.string().describe('Mongo DB URI'),
    JWT_ACCESS_SECRET: z.string().describe('JWT secret key'),
    JWT_REFRESH_SECRET: z.string().describe('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: z.coerce
      .number()
      .default(30)
      .describe('Access token expiration time in minutes'),
    JWT_REFRESH_EXPIRATION_DAYS: z.coerce
      .number()
      .default(30)
      .describe('Refresh token expiration time in days'),
    JWT_COOKIE_EXPIRY_TIME: z.coerce
      .number()
      .default(300)
      .describe('Reset password token expiration time in minutes'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce
      .number()
      .default(10)
      .describe('Password reset token expiration time in minutes'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce
      .number()
      .default(10)
      .describe('Email verification token expiration time in minutes'),
    REDIS_HOST: z.string().describe('Redis host'),
    REDIS_PORT: z.coerce.number().positive().describe('Redis port'),
    SMTP_HOST: z.string().optional().nullable().describe('SMTP host'),
    SMTP_PORT: z.coerce.number().positive().optional().nullable().describe('SMTP port'),
    SMTP_USER: z.string().optional().nullable().describe('SMTP user'),
    SMTP_PASSWORD: z.string().optional().nullable().describe('SMTP password'),
    SMTP_FROM_EMAIL: z.string().optional().nullable().describe('SMTP from email'),
  })
  .passthrough();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Config validation error:', parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  mongo: {
    uri: env.MONGO_URI,
  },
  jwt: {
    access_secret: env.JWT_ACCESS_SECRET,
    refresh_secret: env.JWT_REFRESH_SECRET,
    accessExpirationMinutes: env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: env.JWT_REFRESH_EXPIRATION_DAYS,
    cookieExpiryTime: env.JWT_COOKIE_EXPIRY_TIME,
    resetPasswordExpirationMinutes: env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  mail: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    fromEmail: env.SMTP_FROM_EMAIL,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  base_url: `http://localhost:${env.PORT}`,
};
