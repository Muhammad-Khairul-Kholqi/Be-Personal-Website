const express = require('express');
const AuthController = require('../controllers/authController');
const {
    authenticateToken,
    verifyToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

// Authentication routes
router.post('/login', AuthController.login);
router.get('/verify', authenticateToken, verifyToken);
router.get('/public-profile/:userId', AuthController.getPublicProfile);
router.get('/public-profile', AuthController.getMainProfile); 
router.get('/profile', authenticateToken, AuthController.getProfile); 
router.put('/profile', authenticateToken, upload.fields([{
        name: 'image',
        maxCount: 1
    },
    {
        name: 'resume',
        maxCount: 1
    }
]), AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;