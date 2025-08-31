const SkillsModel = require('../models/skillsModel');

class SkillController {
    static async getAll(req, res) {
        try {
            const skills = await SkillsModel.getAll();
            return res.json(skills);
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const {
                id
            } = req.params;
            const skill = await SkillsModel.getById(id);
            res.json(skill);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async create(req, res) {
        try {
            const {
                name
            } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({
                    error: 'Skill name is required'
                });
            }

            const newSkill = await SkillsModel.create({
                name: name.trim()
            });
            return res.status(201).json(newSkill);
        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return res.status(400).json({
                    error: 'Skill name already exists'
                });
            }
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            const {
                id
            } = req.params;
            const existing = await SkillsModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Skill not found'
                });
            }

            const {
                name
            } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({
                    error: 'Skill name is required'
                });
            }

            const updatedSkill = await SkillsModel.update(id, {
                name: name.trim()
            });
            res.json(updatedSkill);
        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return res.status(400).json({
                    error: 'Skill name already exists'
                });
            }
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const {
                id
            } = req.params;
            const existing = await SkillsModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Skill not found'
                });
            }

            await SkillsModel.delete(id);
            res.json({
                message: 'Skill deleted successfully'
            });
        } catch (err) {
            if (err.message.includes('violates foreign key constraint')) {
                return res.status(400).json({
                    error: 'Cannot delete skill that is being used by users'
                });
            }
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async getUserSkills(req, res) {
        try {
            const {
                userId
            } = req.params;
            const skills = await SkillsModel.getUserSkills(userId);
            res.json(skills);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async addUserSkill(req, res) {
        try {
            const {
                userId
            } = req.params;
            const {
                skillId
            } = req.body;

            if (!skillId) {
                return res.status(400).json({
                    error: 'Skill ID is required'
                });
            }

            const skill = await SkillsModel.getById(skillId);
            if (!skill) {
                return res.status(404).json({
                    error: 'Skill not found'
                });
            }

            await SkillsModel.addUserSkill(userId, skillId);
            res.json({
                message: 'Skill added to user successfully'
            });
        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint')) {
                return res.status(400).json({
                    error: 'User already has this skill'
                });
            }
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async removeUserSkill(req, res) {
        try {
            const {
                userId,
                skillId
            } = req.params;

            await SkillsModel.removeUserSkill(userId, skillId);
            res.json({
                message: 'Skill removed from user successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async updateUserSkills(req, res) {
        try {
            const {
                userId
            } = req.params;
            const {
                skillIds
            } = req.body;

            if (!Array.isArray(skillIds)) {
                return res.status(400).json({
                    error: 'skillIds must be an array'
                });
            }

            for (const skillId of skillIds) {
                const skill = await SkillsModel.getById(skillId);
                if (!skill) {
                    return res.status(404).json({
                        error: `Skill with ID ${skillId} not found`
                    });
                }
            }

            await SkillsModel.updateUserSkills(userId, skillIds);
            const updatedSkills = await SkillsModel.getUserSkills(userId);

            res.json({
                message: 'User skills updated successfully',
                skills: updatedSkills
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = SkillController;