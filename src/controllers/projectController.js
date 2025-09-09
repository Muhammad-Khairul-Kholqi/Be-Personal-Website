const ProjectModel = require('../models/projectModel');
const supabase = require('../config/supabase');
const path = require('path');
const fs = require('fs');

const BUCKET = 'project-images';
const MAX_MB = 10;
const MAX_IMAGES = 5;

class ProjectController {
    static async getAll(req, res) {
        try {
            const projects = await ProjectModel.getAll();
            return res.json(projects);
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
            const project = await ProjectModel.getById(id);

            if (!project) {
                return res.status(404).json({
                    error: 'Project not found'
                });
            }

            return res.json(project);
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async create(req, res) {
        let localPaths = [];
        try {
            const {
                title,
                description,
                list_job,
                url_github,
                url_demo,
                status,
                technology_ids
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
            if (!list_job || !list_job.trim()) {
                return res.status(400).json({
                    error: 'List Job is required'
                });
            }
            if (!status || !status.trim()) {
                return res.status(400).json({
                    error: 'Status is required'
                });
            }

            let imageUrls = [];
            const files = req.files || (req.file ? [req.file] : []);

            if (files.length > MAX_IMAGES) {
                files.forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (_) {}
                });
                return res.status(400).json({
                    error: `Maximum ${MAX_IMAGES} images allowed`
                });
            }

            for (const file of files) {
                const fileSizeInMB = file.size / (1024 * 1024);
                if (fileSizeInMB > MAX_MB) {
                    files.forEach(f => {
                        try {
                            fs.unlinkSync(f.path);
                        } catch (_) {}
                    });
                    return res.status(400).json({
                        error: `File too large. Max ${MAX_MB}MB allowed per image`
                    });
                }

                localPaths.push(file.path);
                const ext = path.extname(file.originalname) || '';
                const fileName = `uploads/project-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(file.path);

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: file.mimetype,
                    });

                if (uploadError) throw uploadError;

                const {
                    data,
                    error: publicUrlError
                } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                if (publicUrlError) throw publicUrlError;

                imageUrls.push(data.publicUrl);
            }

            let parsedTechnologyIds = [];
            if (technology_ids) {
                try {
                    parsedTechnologyIds = typeof technology_ids === 'string' ?
                        JSON.parse(technology_ids) : technology_ids;

                    if (!Array.isArray(parsedTechnologyIds)) {
                        throw new Error('Technology IDs must be an array');
                    }
                } catch (parseError) {
                    throw new Error('Invalid technology_ids format');
                }
            }

            const newProject = await ProjectModel.create({
                title: title.trim(),
                description: description ?.trim() || null,
                list_job: list_job ?.trim() || null,
                url_github: url_github || null,
                url_demo: url_demo || null,
                status: status || null,
                technology_ids: parsedTechnologyIds,
                images: imageUrls
            });

            localPaths.forEach(path => {
                try {
                    fs.unlinkSync(path);
                } catch (_) {}
            });

            return res.status(201).json(newProject);
        } catch (err) {
            localPaths.forEach(path => {
                try {
                    fs.unlinkSync(path);
                } catch (_) {}
            });
            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async update(req, res) {
        let localPaths = [];
        try {
            const {
                id
            } = req.params;
            const {
                title,
                description,
                list_job,
                url_github,
                url_demo,
                status,
                technology_ids
            } = req.body;

            const existing = await ProjectModel.getById(id);
            if (!existing) {
                const files = req.files || (req.file ? [req.file] : []);
                files.forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (_) {}
                });
                return res.status(404).json({
                    error: 'Project not found'
                });
            }

            let imageUrls;
            const files = req.files || (req.file ? [req.file] : []);

            if (files.length > 0) {
                if (files.length > MAX_IMAGES) {
                    files.forEach(file => {
                        try {
                            fs.unlinkSync(file.path);
                        } catch (_) {}
                    });
                    return res.status(400).json({
                        error: `Maximum ${MAX_IMAGES} images allowed`
                    });
                }

                imageUrls = [];
                for (const file of files) {
                    const fileSizeInMB = file.size / (1024 * 1024);
                    if (fileSizeInMB > MAX_MB) {
                        files.forEach(f => {
                            try {
                                fs.unlinkSync(f.path);
                            } catch (_) {}
                        });
                        return res.status(400).json({
                            error: `File too large. Max ${MAX_MB}MB allowed per image`
                        });
                    }

                    localPaths.push(file.path);
                    const ext = path.extname(file.originalname) || '';
                    const fileName = `uploads/project-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                    const buffer = fs.readFileSync(file.path);

                    const {
                        error: uploadError
                    } = await supabase.storage
                        .from(BUCKET)
                        .upload(fileName, buffer, {
                            contentType: file.mimetype,
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

                    imageUrls.push(data.publicUrl);
                }
            }

            let parsedTechnologyIds;
            if (technology_ids !== undefined) {
                try {
                    parsedTechnologyIds = typeof technology_ids === 'string' ?
                        JSON.parse(technology_ids) : technology_ids;

                    if (parsedTechnologyIds !== null && !Array.isArray(parsedTechnologyIds)) {
                        throw new Error('Technology IDs must be an array');
                    }
                } catch (parseError) {
                    throw new Error('Invalid technology_ids format');
                }
            }

            const payload = {
                title: (typeof title === 'string' && title.trim()) ? title.trim() : existing.title,
                description: (typeof description === 'string') ? description.trim() || null : existing.description,
                list_job: (typeof list_job === 'string') ? list_job.trim() || null : existing.list_job,
                url_github: url_github !== undefined ? url_github : existing.url_github,
                url_demo: url_demo !== undefined ? url_demo : existing.url_demo,
                status: status !== undefined ? status : existing.status,
                technology_ids: parsedTechnologyIds,
                images: imageUrls
            };

            const updatedProject = await ProjectModel.update(id, payload);

            localPaths.forEach(path => {
                try {
                    fs.unlinkSync(path);
                } catch (_) {}
            });

            return res.json(updatedProject);
        } catch (err) {
            localPaths.forEach(path => {
                try {
                    fs.unlinkSync(path);
                } catch (_) {}
            });
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
            const project = await ProjectModel.getById(id);

            if (!project) {
                return res.status(404).json({
                    error: 'Project not found'
                });
            }

            await ProjectModel.delete(id);
            return res.json({
                message: 'Project deleted successfully'
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = ProjectController;