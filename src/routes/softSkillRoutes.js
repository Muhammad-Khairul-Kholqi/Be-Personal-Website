const express = require('express');
const SoftSkillController = require('../controllers/softSkillController');
const {
    authenticateToken
} = require('../middlewares/auth');
const router = express.Router();

router.get('/', SoftSkillController.getAll);
router.get('/:id', SoftSkillController.getById);
router.post('/', authenticateToken, SoftSkillController.create);
router.put('/:id', authenticateToken, SoftSkillController.update);
router.delete('/:id', authenticateToken, SoftSkillController.delete);

module.exports = router;