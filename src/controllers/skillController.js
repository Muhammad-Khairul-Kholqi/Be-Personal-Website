// const SkillsModel = require('../models/skillsModel');

// class SkillController {
//     static async getAll(req, res) {
//         try {
//             const skills = await SkillsModel.getAll();
//             res.json(skills);
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async getById(req, res) {
//         try {
//             const {
//                 id
//             } = req.params;
//             const skill = await SkillsModel.getById(id);
//             res.json(skill);
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async create(req, res) {
//         try {
//             const {
//                 name
//             } = req.body;

//             if (!name || !name.trim()) {
//                 return res.status(400).json({
//                     error: 'Skill name is required'
//                 });
//             }

//             const newSkill = await SkillsModel.create({
//                 name: name.trim()
//             });

//             return res.status(201).json(newSkill);
//         } catch (err) {
//             return res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async update(req, res) {
//         try {
//             const {
//                 id
//             } = req.params;
//             const {
//                 name
//             } = req.body;

//             const existing = await SkillsModel.getById(id);
//             if (!existing) {
//                 return res.status(404).json({
//                     error: 'Skill not found'
//                 });
//             }

//             if (!name || !name.trim()) {
//                 return res.status(400).json({
//                     error: 'Skill name is required'
//                 });
//             }

//             const updatedSkill = await SkillsModel.update(id, name.trim());
//             res.json(updatedSkill);
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async delete(req, res) {
//         try {
//             const {
//                 id
//             } = req.params;

//             const existing = await SkillsModel.getById(id);
//             if (!existing) {
//                 return res.status(404).json({
//                     error: 'Skill not found'
//                 });
//             }

//             await SkillsModel.delete(id);
//             res.json({
//                 message: 'Skill deleted successfully'
//             });
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async getUserSkills(req, res) {
//         try {
//             const {
//                 userId
//             } = req.params;
//             const userSkills = await SkillsModel.getUserSkills(userId);
//             res.json(userSkills);
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async addUserSkill(req, res) {
//         try {
//             const {
//                 userId
//             } = req.params;
//             const {
//                 skillId
//             } = req.body;

//             if (!skillId) {
//                 return res.status(400).json({
//                     error: 'Skill ID is required'
//                 });
//             }

//             const result = await SkillsModel.addUserSkill(userId, skillId);
//             res.json(result);
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async removeUserSkill(req, res) {
//         try {
//             const {
//                 userId,
//                 skillId
//             } = req.params;
//             await SkillsModel.removeUserSkill(userId, skillId);
//             res.json({
//                 message: 'User skill removed successfully'
//             });
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }

//     static async updateUserSkills(req, res) {
//         try {
//             const {
//                 userId
//             } = req.params;
//             const {
//                 skillIds
//             } = req.body;

//             // Parse skillIds jika masih string
//             let parsedSkillIds = skillIds;
//             if (typeof skillIds === 'string') {
//                 try {
//                     parsedSkillIds = JSON.parse(skillIds);
//                 } catch (parseError) {
//                     return res.status(400).json({
//                         error: 'Invalid skillIds format'
//                     });
//                 }
//             }

//             const result = await SkillsModel.updateUserSkills(userId, parsedSkillIds);
//             res.json({
//                 message: 'User skills updated successfully',
//                 result
//             });
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             });
//         }
//     }
// }

// module.exports = SkillController;























const SkillsModel = require('../models/skillsModel');

class SkillController {
    static async getAll(req, res) {
        try {
            const sercs = await SkillsModel.getAll();
            res.json(sercs);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const {
                id
            } = req.params;
            const serc = await SkillsModel.getById(id);
            res.json(serc);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async create(req, res) {
        try {
            const {
                name,
            } = req.body;
            if (!name || !name.trim()) {
                return res.status(400).json({
                    error: 'Name is required'
                });
            }

            const newSerc = await SkillsModel.create({
                name: name.trim()
            });
            return res.status(201).json(newSerc);
        } catch (err) {
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
                    error: 'Service not found'
                });
            }

            const {
                name,
            } = req.body;

            const updatedSerc = await SkillsModel.update(id, {
                name: name !== undefined ? name.trim() : existing.name,
            });
            res.json(updatedSerc);
        } catch (err) {
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
                    error: 'Service not found'
                });
            }

            await SkillsModel.delete(id);
            res.json({
                message: 'Service deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = SkillController;