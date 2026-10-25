import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { config } from '../config/env';

// In-memory store for OTPs: key = phoneNumber, value = { otp, expiresAt }
interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpEntry>();

// Development universal OTP for automated testing and ease of development
const DEV_MASTER_OTP = '123456';

export class AuthService {
  /**
   * Generates a 6-digit OTP, prints it clearly to server console, and caches it.
   */
  static requestOtp(phoneNumber: string): { message: string; debugOtp?: string } {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(phoneNumber, { otp, expiresAt });

    // Print to server console as required
    console.log('\n======================================================');
    console.log(' 🔐 [SERVER LOG] - USER LOGIN OTP');
    console.log(` 📱 Mobile Number : ${phoneNumber}`);
    console.log(` 🔑 6-Digit OTP   : ${otp}`);
    console.log(' ⏱️  Valid For     : 10 minutes');
    console.log(' 👉 Type this OTP manually in the app to verify!');
    console.log('======================================================\n');

    return {
      message: 'OTP generated! Check the server log and manually type the 6-digit code.',
    };
  }

  /**
   * Verifies the OTP, provisions the User record in PostgreSQL, and generates a JWT token.
   */
  static async verifyOtp(phoneNumber: string, otp: string) {
    const record = otpStore.get(phoneNumber);

    const isMasterOtp = otp === DEV_MASTER_OTP;
    const isValidStoredOtp =
      record && record.otp === otp && Date.now() <= record.expiresAt;

    if (!isMasterOtp && !isValidStoredOtp) {
      throw new Error('Invalid or expired OTP code. Please request a new code.');
    }

    // Clear used OTP
    otpStore.delete(phoneNumber);

    // Find or create User in PostgreSQL database via Prisma
    const user = await prisma.user.upsert({
      where: { phoneNumber },
      update: {},
      create: { phoneNumber },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        phoneNumber: user.phoneNumber,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
      },
    };
  }
}
