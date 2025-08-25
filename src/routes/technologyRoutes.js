const express = require('express');
const TechnologyController = require('../controllers/technologyController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', TechnologyController.getAll);
router.get('/:id', TechnologyController.getById);

router.post('/', authenticateToken, upload.single('image'), TechnologyController.create);
router.put('/:id', authenticateToken, upload.single('image'), TechnologyController.update);
router.delete('/:id', authenticateToken, TechnologyController.delete);

module.exports = router;
