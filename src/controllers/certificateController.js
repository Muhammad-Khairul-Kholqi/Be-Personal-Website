const CertificateModel = require('../models/certificateModel');
const supabase = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const BUCKET = 'certificates-images';
const MAX_MB = 10;

class CertificateController {
    static async getAll(req, res) {
        try {
            const certs = await CertificateModel.getAll();
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
            const cert = await CertificateModel.getById(id);
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
                title,
                time,
                company
            } = req.body;
            if (!title || !title.trim()) {
                return res.status(400).json({
                    error: 'Title is required'
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
                const fileName = `uploads/certificates-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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

            const newCert = await CertificateModel.create({
                title: title.trim(),
                image: imageUrl,
                time: time || null,
                company: company.trim(),
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
                title,
                time,
                company
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
                const fileName = `uploads/certificates-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
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

            const updatedCert = await CertificateModel.update(id, {
                title: title || null,
                image: imageUrl,
                time: time || null,
                company: company || null,   
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
            await CertificateModel.delete(id);
            res.json({
                message: 'Certificate deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = CertificateController;
