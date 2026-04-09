import express from 'express';
import { registerUser, loginUser, logoutUser, githubLogin, githubCallback, googleLogin, googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

router.post('/logout', logoutUser); 
export default router;