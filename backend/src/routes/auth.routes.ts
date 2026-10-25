import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { requestOtpSchema, verifyOtpSchema } from '../validators/auth.validator';

const router = Router();

router.post('/request-otp', validateBody(requestOtpSchema), AuthController.requestOtp);
router.post('/verify-otp', validateBody(verifyOtpSchema), AuthController.verifyOtp);

export default router;
