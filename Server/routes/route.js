const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole, refreshAuthenticateToken } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token',refreshAuthenticateToken, authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/logout', authenticateToken, authController.logout);
router.get('/checkauth', authenticateToken, authController.getUser)

// Protected route example
router.get('/protected', authenticateToken, authorizeRole(['user', 'admin']), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Admin-only route example
router.get('/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});

module.exports = router;