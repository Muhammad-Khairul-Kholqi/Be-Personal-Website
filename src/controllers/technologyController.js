const TechnologyModel = require('../models/technologyModel');
const supabase = require('../config/supabase');
const path = require('path');
const fs = require('fs');

const BUCKET = 'tech-images';
const MAX_MB = 10;

class TechnologyController {
    static async getAll(req, res) {
        try {
            const techs = await TechnologyModel.getAll();
            return res.json(techs);
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
            const tech = await TechnologyModel.getById(id);

            if (!tech) {
                return res.status(404).json({
                    error: 'Technology not found'
                });
            }

            return res.json(tech);
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async create(req, res) {
        let localPath;
        try {
            const {
                name
            } = req.body;
            if (!name || !name.trim()) {
                return res.status(400).json({
                    error: 'Name is required'
                });
            }

            let imageUrl = null;

            if (req.file) {
                const fileSizeInMB = req.file.size / (1024 * 1024);
                if (fileSizeInMB > MAX_MB) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (_) {}
                    return res.status(400).json({
                        error: `File too large. Max ${MAX_MB}MB allowed`
                    });
                }

                localPath = req.file.path;
                const ext = path.extname(req.file.originalname) || '';
                const fileName = `uploads/tech-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(localPath);

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: req.file.mimetype,
                    });

                if (uploadError) throw uploadError;

                const {
                    data,
                    error: publicUrlError
                } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                if (publicUrlError) throw publicUrlError;

                imageUrl = data.publicUrl; 

                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }

            const newTech = await TechnologyModel.create({
                name: name.trim(),
                image: imageUrl,
            });

            return res.status(201).json(newTech);
        } catch (err) {
            if (localPath) {
                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async update(req, res) {
        let localPath;
        try {
            const {
                id
            } = req.params;
            const {
                name
            } = req.body;

            const existing = await TechnologyModel.getById(id);
            if (!existing) {
                if (req.file) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (_) {}
                }
                return res.status(404).json({
                    error: 'Technology not found'
                });
            }

            let imageUrl = req.body.image || existing.image || null;

            if (req.file) {
                const fileSizeInMB = req.file.size / (1024 * 1024);
                if (fileSizeInMB > MAX_MB) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (_) {}
                    return res.status(400).json({
                        error: `File too large. Max ${MAX_MB}MB allowed`
                    });
                }

                localPath = req.file.path;
                const ext = path.extname(req.file.originalname) || '';
                const fileName = `uploads/tech-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(localPath);

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: req.file.mimetype,
                        upsert: true,
                    });

                if (uploadError) throw uploadError;

                const {
                    data,
                    error: publicUrlError
                } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                if (publicUrlError) throw publicUrlError;

                imageUrl = data.publicUrl; 

                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}

                if (existing.image && existing.image.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                    const parts = existing.image.split(`/${BUCKET}/`);
                    if (parts.length > 1) {
                        const oldPath = parts[1];
                        await supabase.storage.from(BUCKET).remove([oldPath]);
                    }
                }
            }

            const payload = {
                name: (typeof name === 'string' && name.trim()) ? name.trim() : existing.name,
                image: imageUrl,
            };

            const updatedTech = await TechnologyModel.update(id, payload);
            return res.json(updatedTech);
        } catch (err) {
            if (localPath) {
                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const {
                id
            } = req.params;
            const tech = await TechnologyModel.getById(id);

            if (!tech) {
                return res.status(404).json({
                    error: 'Technology not found'
                });
            }

            if (tech.image && typeof tech.image === 'string' && tech.image.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                const parts = tech.image.split(`/${BUCKET}/`);
                if (parts.length > 1) {
                    const imagePath = parts[1]; 
                    await supabase.storage.from(BUCKET).remove([imagePath]);
                }
            }

            await TechnologyModel.delete(id);
            return res.json({
                message: 'Technology deleted successfully'
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = TechnologyController;
