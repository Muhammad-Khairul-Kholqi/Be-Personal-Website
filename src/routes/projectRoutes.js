const express = require('express');
const ProjectController = require('../controllers/projectController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);

router.post('/', authenticateToken, upload.single('image'), ProjectController.create);
router.put('/:id', authenticateToken, upload.single('image'), ProjectController.update);
router.delete('/:id', authenticateToken, ProjectController.delete);

module.exports = router;