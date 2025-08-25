const express = require('express');
const ServicesController = require('../controllers/servicesController');
const {
    authenticateToken
} = require('../middlewares/auth');
const router = express.Router();

router.get('/', ServicesController.getAll);
router.get('/:id', ServicesController.getById);
router.post('/', authenticateToken, ServicesController.create);
router.put('/:id', authenticateToken, ServicesController.update);
router.delete('/:id', authenticateToken, ServicesController.delete);

module.exports = router;