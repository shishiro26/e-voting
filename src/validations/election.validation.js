import * as z from 'zod';

export const createElectionSchema = z
  .object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .min(3)
      .max(255)
      .trim()
      .toLowerCase(),
    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(3)
      .max(255)
      .trim(),
    start_date: z
      .string({
        required_error: 'Start date is required',
        invalid_type_error: 'Start date must be a valid date',
      })
      .datetime(),
    end_date: z
      .string({
        required_error: 'End date is required',
        invalid_type_error: 'End date must be a valid date',
      })
      .datetime(),
  })
  .refine((data) => {
    const startDate = new Date(data.start_date).toISOString();
    const endDate = new Date(data.end_date).toISOString();
    const currentDate = new Date().toISOString();

    if (startDate > endDate) {
      throw new Error('End date must be greater than start date');
    }

    if (startDate < currentDate) {
      throw new Error('Start date must be greater than current date');
    }

    return true;
  });

export const addCandidateSchema = z.object({
  election_id: z.number().int(),
  tagline: z.string().min(3).max(255).trim(),
});

export const approveCandidateSchema = z.object({
  candidate_id: z.number().int(),
});

export const rejectCandidateSchema = z.object({
  candidate_id: z.number().int(),
});
