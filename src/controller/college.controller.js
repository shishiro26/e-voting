import { addCollegeSchema } from '../validations/auth.validation.js';
import AppError from '../utils/AppError.js';
import { getCollegeByName, saveCollege } from '../services/college.services.js';
import { generateId, renderEmailEjs } from '../utils/helper.js';
import { formatError, generatePassword } from '../utils/user.js';
import env from '../config/env.js';
import { emailQueue, emailQueueName } from '../jobs/email.queue.js';
import { INTERNAL_SERVER, BAD_REQUEST } from '../constants/index.js';

export const addCollege = async (req, res, next) => {
  try {
    const { name, suffix_email, email } = addCollegeSchema.parse(req.body);
    console.log('name', name);

    const existingCollege = await getCollegeByName(name);
    if (existingCollege) {
      return next(new AppError('College already exists', BAD_REQUEST));
    }

    const id = generateId();
    const verify_token = await generatePassword(id);
    const url = `${env.base_url}/api/v1/verify/college_email/?email=${email}&token=${verify_token}`;

    saveCollege({
      name,
      email,
      suffix_email,
      email_verify_token: verify_token,
      token_send_at: new Date().toISOString(),
    }).then(async (college) => {
      const html = await renderEmailEjs('emails/college-mail', {
        name: name,
        url: url,
      });
      console.log(html);

      emailQueue.add(emailQueueName, {
        to: email,
        subject: 'College Verification',
        html,
      });

      return res.status(201).send({
        message: 'College Added Successfully!',
        data: college,
      });
    });
  } catch (error) {
    console.log('Error during addCollege:', error);

    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }

    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
