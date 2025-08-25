const express = require('express');
const TechnologyController = require('../controllers/technologyController');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', TechnologyController.getAll);
router.get('/:id', TechnologyController.getById);
router.post('/', upload.single('image'), TechnologyController.create);
router.put('/:id', upload.single('image'), TechnologyController.update);
router.delete('/:id', TechnologyController.delete);

module.exports = router;
