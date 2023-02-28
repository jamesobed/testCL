import express from 'express';
import {
  registerUser,
  updateUser,
  forgetPassword,
  resetPassword,
  userLogin,
  verifyUser,
  singleUser,
  allUsers,
  resendVerificationLink,
  deleteUser,
  userLogout,
} from '../controller/userController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { sendOTP } from '../controller/smsController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/send-otp', auth, sendOTP);
router.get('/verify/:token', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.patch('/update', auth, updateUser);
router.put('/update-admin/', adminAuth, updateUser);
router.patch('/reset-password/:token', resetPassword);
router.patch('/resend-verification', resendVerificationLink);
router.get('/single-user/:id', auth, singleUser);
router.get('/all-users', allUsers);
router.delete('/delete-user/:id', adminAuth, deleteUser);
router.get('/logout', userLogout);

export default router;
