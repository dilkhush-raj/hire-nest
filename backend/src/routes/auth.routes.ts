import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  registerUser,
  loginUser,
  deleteUser,
  changePassword,
  logOutUser,
  isLoggedIn,
  sendEmailToCandidates,
} from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/delete').post(deleteUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/logout').post(verifyJWT, logOutUser);
router.route('/check-auth').post(verifyJWT, isLoggedIn);
router
  .route('/send-emails-to-candidates')
  .post(verifyJWT, sendEmailToCandidates);

export default router;
