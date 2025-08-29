const ContactModel = require('../models/contactModel');

class ContactController {
    static async getAll(req, res) {
        try {
            const sercs = await ContactModel.getAll();
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
            const serc = await ContactModel.getById(id);
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
                link,
                icon,
                username
            } = req.body;
            if (!title || !title.trim()) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }
            if (!link || !link.trim()) {
                return res.status(400).json({
                    error: 'Link is required'
                });
            }
            if (!icon || !icon.trim()) {
                return res.status(400).json({
                    error: 'Icon is required'
                });
            }
            if (!username || !username.trim()) {
                return res.status(400).json({
                    error: 'Username is required'
                });
            }

            const newSerc = await ContactModel.create({
                title: title.trim(),
                link: link.trim(),
                icon: icon.trim(),
                username: username.trim()
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
            const existing = await ContactModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Contact not found'
                });
            }

            const {
                title,
                link,
                icon,
                username
            } = req.body;

            const updatedSerc = await ContactModel.update(id, {
                title: title !== undefined ? title.trim() : existing.title,
                link: link !== undefined ? link.trim() : existing.description,
                icon: icon !== undefined ? icon.trim() : existing.icon,
                username: username !== undefined ? username.trim() : existing.username
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
            const existing = await ContactModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    error: 'Contact not found'
                });
            }

            await ContactModel.delete(id);
            res.json({
                message: 'Contact deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = ContactController;