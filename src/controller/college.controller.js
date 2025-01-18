import { addCollegeSchema } from '../validations/auth.validation.js';
import AppError from '../utils/AppError.js';
import { getCollegeByName, saveCollege } from '../services/college.services.js';

export const addCollege = async (req, res, next) => {
  try {
    const { name, suffix_email } = addCollegeSchema.parse(req.body);
    console.log('name', name);
    const existingCollege = await getCollegeByName(name);

    if (existingCollege) {
      return next(new AppError('College already exists', BAD_REQUEST));
    }

    saveCollege({ name, suffix_email })
      .then((college) => {
        return res.status(201).send({
          message: 'College Added Successfully!',
          data: college,
        });
      })
      .catch((error) => {
        return next(new AppError('Something went wrong', INTERNAL_SERVER));
      });
  } catch (error) {
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
