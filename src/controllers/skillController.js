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