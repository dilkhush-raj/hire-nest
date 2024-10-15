import {Router} from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  registerUser,
  loginUser,
  deleteUser,
  changePassword,
  logOutUser,
} from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/delete').post(deleteUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/logout').post(verifyJWT, logOutUser);

export default router;
