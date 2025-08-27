const CareerModel = require('../models/careerModel');
const supabase = require('../config/supabase');
const path = require('path');
const fs = require('fs');

const BUCKET = 'career-images';
const MAX_MB = 10;

class CareerController {
    static async getAll(req, res) {
        try {
            const careers = await CareerModel.getAll();
            return res.json(careers);
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
            const career = await CareerModel.getById(id);

            if (!career) {
                return res.status(404).json({
                    error: 'Career not found'
                });
            }

            return res.json(career);
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
                agency_name,
                type,
                address,
                start_time,
                end_time,
                position,
                job_list,
                technology_ids
            } = req.body;

            if (!agency_name || !agency_name.trim()) {
                return res.status(400).json({
                    error: 'Agency name is required'
                });
            }
            if (!position || !position.trim()) {
                return res.status(400).json({
                    error: 'Position is required'
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
                const fileName = `uploads/career-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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

            let parsedTechnologyIds = [];
            if (technology_ids) {
                try {
                    parsedTechnologyIds = typeof technology_ids === 'string' ?
                        JSON.parse(technology_ids) :
                        technology_ids;

                    if (!Array.isArray(parsedTechnologyIds)) {
                        return res.status(400).json({
                            error: 'Technology IDs must be an array'
                        });
                    }
                } catch (parseError) {
                    return res.status(400).json({
                        error: 'Invalid technology_ids format'
                    });
                }
            }

            const newCareer = await CareerModel.create({
                agency_name: agency_name.trim(),
                type: type ?.trim() || null,
                address: address ?.trim() || null,
                start_time: start_time || null,
                end_time: end_time || null,
                position: position.trim(),
                job_list: job_list ?.trim() || null,
                image: imageUrl,
                technology_ids: parsedTechnologyIds
            });

            return res.status(201).json(newCareer);
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
                agency_name,
                type,
                address,
                start_time,
                end_time,
                position,
                job_list,
                technology_ids
            } = req.body;

            const existing = await CareerModel.getById(id);
            if (!existing) {
                if (req.file) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (_) {}
                }
                return res.status(404).json({
                    error: 'Career not found'
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
                const fileName = `uploads/career-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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

            let parsedTechnologyIds;
            if (technology_ids !== undefined) {
                try {
                    parsedTechnologyIds = typeof technology_ids === 'string' ?
                        JSON.parse(technology_ids) :
                        technology_ids;

                    if (parsedTechnologyIds !== null && !Array.isArray(parsedTechnologyIds)) {
                        return res.status(400).json({
                            error: 'Technology IDs must be an array'
                        });
                    }
                } catch (parseError) {
                    return res.status(400).json({
                        error: 'Invalid technology_ids format'
                    });
                }
            }

            const payload = {
                agency_name: (typeof agency_name === 'string' && agency_name.trim()) ? agency_name.trim() : existing.agency_name,
                type: (typeof type === 'string') ? type.trim() || null : existing.type,
                address: (typeof address === 'string') ? address.trim() || null : existing.address,
                start_time: start_time !== undefined ? start_time : existing.start_time,
                end_time: end_time !== undefined ? end_time : existing.end_time,
                position: (typeof position === 'string' && position.trim()) ? position.trim() : existing.position,
                job_list: (typeof job_list === 'string') ? job_list.trim() || null : existing.job_list,
                image: imageUrl,
                technology_ids: parsedTechnologyIds
            };

            const updatedCareer = await CareerModel.update(id, payload);
            return res.json(updatedCareer);
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
            const career = await CareerModel.getById(id);

            if (!career) {
                return res.status(404).json({
                    error: 'Career not found'
                });
            }

            if (career.image && typeof career.image === 'string' && career.image.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                const parts = career.image.split(`/${BUCKET}/`);
                if (parts.length > 1) {
                    const imagePath = parts[1];
                    await supabase.storage.from(BUCKET).remove([imagePath]);
                }
            }

            await CareerModel.delete(id);
            return res.json({
                message: 'Career deleted successfully'
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = CareerController;