import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  /**
   * POST /api/auth/request-otp
   * Request an OTP for a given phone number
   */
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber } = req.body;
      const result = AuthService.requestOtp(phoneNumber);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/auth/verify-otp
   * Verify an OTP and return a JWT token with user details
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, otp } = req.body;
      const result = await AuthService.verifyOtp(phoneNumber, otp);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Verification failed' });
    }
  }
}
