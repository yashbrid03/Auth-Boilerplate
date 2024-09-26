const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// router.route('/register').post(authController.register)
// router.route('/login').post(authController.login)
// router.route('/refresh-token').post(authController.refreshToken)
// router.route('/verify-email/:token').post(authController.verifyEmail)
// router.route()

// Protected route example
router.get('/protected', authenticateToken, authorizeRole(['user', 'admin']), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Admin-only route example
router.get('/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});

module.exports = router;