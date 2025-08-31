const express = require('express');
const SkillController = require('../controllers/skillController');
const {
    authenticateToken
} = require('../middlewares/auth');
const router = express.Router();

router.get('/', SkillController.getAll);
router.get('/:id', SkillController.getById);
router.post('/', authenticateToken, SkillController.create);
router.put('/:id', authenticateToken, SkillController.update);
router.delete('/:id', authenticateToken, SkillController.delete);

module.exports = router;