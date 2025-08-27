const express = require('express');
const CareerController = require('../controllers/careerController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', CareerController.getAll);
router.get('/:id', CareerController.getById);

router.post('/', authenticateToken, upload.single('image'), CareerController.create);
router.put('/:id', authenticateToken, upload.single('image'), CareerController.update);
router.delete('/:id', authenticateToken, CareerController.delete);

module.exports = router;