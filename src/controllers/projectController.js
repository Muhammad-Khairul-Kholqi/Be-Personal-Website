const ProjectModel = require('../models/projectModel');
const supabase = require('../config/supabase');
const path = require('path');
const fs = require('fs');

const BUCKET = 'project-images';
const MAX_MB = 10;

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
        let localPath;
        try {
            const {
                title,
                description,
                list_job,
                url_github,
                url_demo,
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
            if (!url_github || !url_github.trim()) {
                return res.status(400).json({
                    error: 'URL Github is required'
                });
            }
            if (!url_demo || !url_demo.trim()) {
                return res.status(400).json({
                    error: 'URL Demo is required'
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
                const fileName = `uploads/project-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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

            const newProject = await ProjectModel.create({
                title: title.trim(),
                description: description ?.trim() || null,
                list_job: list_job ?.trim() || null,
                url_github: url_github || null,
                url_demo: url_demo || null,
                image: imageUrl,
                technology_ids: parsedTechnologyIds
            });

            return res.status(201).json(newProject);
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
                title,
                description,
                list_job,
                url_github,
                url_demo,
                technology_ids
            } = req.body;

            const existing = await ProjectModel.getById(id);
            if (!existing) {
                if (req.file) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (_) {}
                }
                return res.status(404).json({
                    error: 'Project not found'
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
                const fileName = `uploads/project-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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
                title: (typeof title === 'string' && title.trim()) ? title.trim() : existing.agency_name,
                description: (typeof description === 'string') ? description.trim() || null : existing.description,
                list_job: (typeof list_job === 'string') ? list_job.trim() || null : existing.list_job,
                url_github: url_github !== undefined ? url_github : existing.url_github,
                url_demo: url_demo !== undefined ? url_demo : existing.url_demo,
                image: imageUrl,
                technology_ids: parsedTechnologyIds
            };

            const updatedProject = await ProjectModel.update(id, payload);
            return res.json(updatedProject);
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
            const project = await ProjectModel.getById(id);

            if (!project) {
                return res.status(404).json({
                    error: 'Project not found'
                });
            }

            if (project.image && typeof project.image === 'string' && project.image.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                const parts = project.image.split(`/${BUCKET}/`);
                if (parts.length > 1) {
                    const imagePath = parts[1];
                    await supabase.storage.from(BUCKET).remove([imagePath]);
                }
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