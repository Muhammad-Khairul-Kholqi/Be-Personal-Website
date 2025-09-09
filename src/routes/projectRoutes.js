const express = require('express');
const ProjectController = require('../controllers/projectController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');
const router = express.Router();

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);

router.post('/', authenticateToken, upload.array('images', 5), ProjectController.create);
router.put('/:id', authenticateToken, upload.array('images', 5), ProjectController.update);
router.delete('/:id', authenticateToken, ProjectController.delete);

module.exports = router;