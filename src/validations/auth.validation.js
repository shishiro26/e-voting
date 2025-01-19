import * as z from 'zod';

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name must be less than or equal to 50 characters' })
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'First name is required' }),
    last_name: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'Last name is required' }),
    email: z
      .string()
      .email({ message: 'Enter a valid email' })
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'Email is required' }),
    college_name: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'College is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .refine((val) => val.length > 0, { message: 'Password is required' }),
    confirm_password: z
      .string()
      .refine((val) => val.length > 0, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password does not match',
    path: ['confirm_password'],
  });

export const adminSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name must be less than or equal to 50 characters' })
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'First name is required' }),
    last_name: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => val.length > 0, { message: 'Last name is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .refine((val) => val.length > 0, { message: 'Password is required' }),
    confirm_password: z
      .string()
      .refine((val) => val.length > 0, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Enter a valid email' })
    .trim()
    .toLowerCase()
    .refine((val) => val.length > 0, { message: 'Email is required' }),
  password: z.string().refine((val) => val.length > 0, { message: 'Password is required' }),
});

export const addCollegeSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => val.length > 0, { message: 'College name is required' }),
  suffix_email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => val.length > 0, { message: 'Suffix email is required' }),
  email: z
    .string()
    .email({ message: 'Enter a valid college email' })
    .trim()
    .toLowerCase()
    .refine((val) => val.length > 0, { message: 'College email is required' }),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email({ message: 'Enter a valid email' })
    .trim()
    .toLowerCase()
    .refine((val) => val.length > 0, { message: 'Email is required' }),
  token: z.string().refine((val) => val.length > 0, { message: 'Token is required' }),
});
