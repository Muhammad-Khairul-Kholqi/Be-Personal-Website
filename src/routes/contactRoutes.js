const express = require('express');
const ContactController = require('../controllers/contactController');
const {
    authenticateToken
} = require('../middlewares/auth');
const router = express.Router();

router.get('/', ContactController.getAll);
router.get('/:id', ContactController.getById);
router.post('/', authenticateToken, ContactController.create);
router.put('/:id', authenticateToken, ContactController.update);
router.delete('/:id', authenticateToken, ContactController.delete);

module.exports = router;