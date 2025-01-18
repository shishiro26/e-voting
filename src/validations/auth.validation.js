import * as z from 'zod';

export const registerSchema = z
  .object({
    first_name: z
      .string({
        message: 'Name is required',
      })
      .min(2)
      .max(50),
    last_name: z.string({
      message: 'Name is required',
    }),
    email: z
      .string({
        message: 'Email is required',
      })
      .email({
        message: 'Enter correct email',
      }),
    college_name: z.string({ message: 'College is required' }).trim(),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be 3 characters long' }),
    confirm_password: z.string({ message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password not matched',
    path: ['confirm_password'],
  });

export const loginSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email({
      message: 'Enter correct email',
    }),
  password: z.string({ message: 'Password is required' }),
});

export const addCollegeSchema = z.object({
  name: z.string({ message: 'Name is required' }).trim(),
  suffix_email: z.string({ message: 'Suffix Email is required' }),
});

export const verifyEmailSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email({
      message: 'Enter correct email',
    }),
  token: z.string({
    message: 'Token is required',
  }),
});
