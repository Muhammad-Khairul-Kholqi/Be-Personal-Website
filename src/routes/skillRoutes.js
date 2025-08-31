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
router.get('/user/:userId', SkillController.getUserSkills);
router.post('/user/:userId', authenticateToken, SkillController.addUserSkill);
router.delete('/user/:userId/skill/:skillId', authenticateToken, SkillController.removeUserSkill);
router.put('/user/:userId', authenticateToken, SkillController.updateUserSkills);

module.exports = router;