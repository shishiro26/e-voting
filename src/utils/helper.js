import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import * as path from 'path';
import ejs from 'ejs';

export const formatError = (error) => {
  let errors = {};
  error.errors.map((err) => {
    errors[err.path?.[0]] = err.message;
  });
  return errors;
};

export const generateId = () => {
  return uuidv4();
};

export const renderEmailEjs = async (fileName, payload) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const html = await ejs.renderFile(path.join(__dirname, `../views/${fileName}.ejs`), payload);
  return html;
};

export const checkTimeDifference = (date) => {
  const now = new Date();
  const tokenDate = new Date(date);
  const differenceInMilliseconds = now - tokenDate;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
  return differenceInMinutes;
};
