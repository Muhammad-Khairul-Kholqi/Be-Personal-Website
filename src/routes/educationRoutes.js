const express = require('express');
const EducationController = require('../controllers/educationController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', EducationController.getAll);
router.get('/:id', EducationController.getById);

router.post('/', authenticateToken, upload.single('image'), EducationController.create);
router.put('/:id', authenticateToken, upload.single('image'), EducationController.update);
router.delete('/:id', authenticateToken, EducationController.delete);

module.exports = router;