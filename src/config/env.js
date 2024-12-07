import dotenv from 'dotenv';
import Joi from 'joi';
import process from 'process';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().positive().required(),
  MONGO_URI: Joi.string().required().description('Mongo DB URI'),
  JWT_SECRET_ACCESS_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_SECRET_REFRESH_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
    .default(30)
    .description('Access token expiration time in minutes'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
    .default(30)
    .description('Refresh token expiration time in days'),
  JWT_COOKIE_EXPIRY_TIME: Joi.number()
    .default(300)
    .description('Reset password token expiration time in minutes'),
}).unknown();

const { value: env, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  mongo: {
    uri: env.MONGO_URI,
  },
  jwt: {
    access_secret: env.JWT_SECRET_ACCESS_SECRET,
    refresh_secret: env.JWT_SECRET_REFRESH_SECRET,
    accessExpirationMinutes: env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: env.JWT_REFRESH_EXPIRATION_DAYS,
    cookieExpiryTime: env.JWT_COOKIE_EXPIRY_TIME,
  },
};
