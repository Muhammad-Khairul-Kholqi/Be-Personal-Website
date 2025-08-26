const SoftSkillModel = require('../models/softSkillModel');

class SoftSkillController {
    static async getAll(req, res) {
        try {
            const sercs = await SoftSkillModel.getAll();
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
            const serc = await SoftSkillModel.getById(id);
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
                title,
                description,
            } = req.body;
            if (!title || !title.trim()) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }
            if (!description || !description.trim()) {
                return res.status(400).json({
                    error: 'Description is required'
                });
            }

            const newSerc = await SoftSkillModel.create({
                title: title.trim(),
                description: description.trim(),
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
            const existing = await SoftSkillModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Soft Skill not found'
                });
            }

            const {
                title,
                description,
            } = req.body;

            const updatedSerc = await SoftSkillModel.update(id, {
                title: title !== undefined ? title.trim() : existing.title,
                description: description !== undefined ? description.trim() : existing.description,
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
            const existing = await SoftSkillModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Soft Skill not found'
                });
            }

            await SoftSkillModel.delete(id);
            res.json({
                message: 'Soft Skill deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = SoftSkillController;