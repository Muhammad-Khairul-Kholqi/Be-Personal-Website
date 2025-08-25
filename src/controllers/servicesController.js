const ServicesModel = require('../models/servicesModel');

class ServicesController {
    static async getAll(req, res) {
        try {
            const sercs = await ServicesModel.getAll();
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
            const serc = await ServicesModel.getById(id);
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
                hashtag
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
            if (!hashtag || !hashtag.trim()) {
                return res.status(400).json({
                    error: 'Hashtag is required'
                });
            }

            const newSerc = await ServicesModel.create({
                title: title.trim(),
                description: description.trim(),
                hashtag: hashtag.trim()
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
            const existing = await ServicesModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Service not found'
                });
            }

            const {
                title,
                description,
                hashtag
            } = req.body;

            const updatedSerc = await ServicesModel.update(id, {
                title: title !== undefined ? title.trim() : existing.title,
                description: description !== undefined ? description.trim() : existing.description,
                hashtag: hashtag !== undefined ? hashtag.trim() : existing.hashtag
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
            const existing = await ServicesModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Service not found'
                });
            }

            await ServicesModel.delete(id);
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

module.exports = ServicesController;