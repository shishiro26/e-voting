import * as z from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string({
        message: 'Name is required',
      })
      .min(2)
      .max(50),
    lastName: z.string({
      message: 'Name is required',
    }),
    email: z
      .string({
        message: 'Email is required',
      })
      .email({
        message: 'Enter correct email',
      }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be 3 characters long' }),
    confirm_password: z.string({ message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password not matched',
    path: ['confirm_password'],
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
