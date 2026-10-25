import { apiClient } from './client';
import { AuthResponse, RequestOtpResponse } from '../types';

export const authApi = {
  /**
   * Request a 6-digit OTP code for a phone number
   */
  requestOtp: async (phoneNumber: string): Promise<RequestOtpResponse> => {
    const response = await apiClient.post<RequestOtpResponse>('/auth/request-otp', {
      phoneNumber,
    });
    return response.data;
  },

  /**
   * Verify the 6-digit OTP code and retrieve JWT + user
   */
  verifyOtp: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
      phoneNumber,
      otp,
    });
    return response.data;
  },
};
