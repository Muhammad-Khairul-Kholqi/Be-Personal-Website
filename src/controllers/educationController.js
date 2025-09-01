const EducationModel = require('../models/educationModel');
const supabase = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const BUCKET = 'education-images';
const MAX_MB = 10;

class EducationController {
    static async getAll(req, res) {
        try {
            const certs = await EducationModel.getAll();
            res.json(certs);
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
            const cert = await EducationModel.getById(id);
            res.json(cert);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async create(req, res) {
        let localPath;
        try {
            const {
                school_name,
                start_time,
                end_time,
                location
            } = req.body;
            if (!school_name || !school_name.trim(), 
                !end_time || !end_time.trim(), 
                !start_time || !start_time.trim(), 
                !location || !location.trim()
            ) {
                return res.status(400).json({
                    error: 'All data is required'
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
                const fileName = `uploads/education-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(localPath);

                const {
                    data: uploadData,
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: req.file.mimetype,
                        upsert: true,
                    });

                if (uploadError) throw uploadError;

                const {
                    data: publicData,
                    error: publicUrlError
                } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                if (publicUrlError) throw publicUrlError;
                imageUrl = publicData.publicUrl;

                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }

            const newCert = await EducationModel.create({
                school_name: school_name.trim(),
                image: imageUrl,
                start_time: start_time || null,
                end_time: end_time || null,
                location: location || null
            });

            res.status(201).json(newCert);
        } catch (err) {
            if (localPath) {
                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }
            res.status(500).json({
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
                school_name,
                start_time,
                end_time,
                location
            } = req.body;
            let imageUrl = req.body.image || null;

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
                const fileName = `uploads/education-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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
                    data: publicData,
                    error: publicUrlError
                } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                if (publicUrlError) throw publicUrlError;
                imageUrl = publicData.publicUrl;

                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
            }

            const updatedCert = await EducationModel.update(id, {
                school_name: school_name || null,
                image: imageUrl,
                start_time: start_time || null,
                end_time: end_time || null,
                location: location || null,
            });

            res.json(updatedCert);
        } catch (err) {
            if (localPath) {
                try {
                    fs.unlinkSync(localPath);
                } catch (_) {}
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
            await EducationModel.delete(id);
            res.json({
                message: 'Education deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = EducationController;
