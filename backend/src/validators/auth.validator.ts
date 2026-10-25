import { z } from 'zod';

export const requestOtpSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number must not exceed 30 characters')
    .regex(
      /^[+]?[0-9\s\-().]+$/,
      'Phone number must contain only numbers and phone symbols (+, -, (, ), .)'
    ),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number must not exceed 30 characters')
    .regex(
      /^[+]?[0-9\s\-().]+$/,
      'Phone number must contain only numbers and phone symbols (+, -, (, ), .)'
    ),
  otp: z
    .string({ required_error: 'OTP code is required' })
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must consist of 6 numeric digits'),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
