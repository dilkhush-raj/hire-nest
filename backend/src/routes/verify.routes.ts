import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  sendVerificationEmail,
  resendVerificationEmail,
  verifyEmailOtp,
} from '../controllers/verify.controller';

const router = Router();

router.route('/send-email-otp').post(verifyJWT, sendVerificationEmail);
router.route('/resend-email-otp').post(verifyJWT, resendVerificationEmail);
router.route('/verify-email-otp').post(verifyJWT, verifyEmailOtp);

export default router;
