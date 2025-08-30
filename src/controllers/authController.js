const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const supabase = require('../config/supabase');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BUCKET = 'user-images';
const MAX_MB = 10;

class AuthController {
    static async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body;

            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not defined in environment variables');
                return res.status(500).json({
                    error: 'Server configuration error'
                });
            }

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            const user = await UserModel.getByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            const token = jwt.sign({
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET, {
                    expiresIn: '7d'
                }
            );

            const {
                password: _,
                ...userWithoutPassword
            } = user;

            res.json({
                message: 'Login successful',
                user: userWithoutPassword,
                token
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await UserModel.getById(req.userId);
            const {
                password: _,
                ...userWithoutPassword
            } = user;
            res.json(userWithoutPassword);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async updateProfile(req, res) {
        let localImagePath;
        let localResumePath;

        try {
            const {
                fullname,
                username,
                description,
                address,
                email
            } = req.body;
            const userId = req.userId;

            const existing = await UserModel.getById(userId);
            if (!existing) {
                if (req.files ?.image ?. [0]) {
                    try {
                        fs.unlinkSync(req.files.image[0].path);
                    } catch (_) {}
                }
                if (req.files ?.resume ?. [0]) {
                    try {
                        fs.unlinkSync(req.files.resume[0].path);
                    } catch (_) {}
                }
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            let imageUrl = req.body.image || existing.image || null;
            let resumeUrl = req.body.resume || existing.resume || null;

            if (req.files ?.image ?. [0]) {
                const imageFile = req.files.image[0];
                const fileSizeInMB = imageFile.size / (1024 * 1024);

                if (fileSizeInMB > MAX_MB) {
                    try {
                        fs.unlinkSync(imageFile.path);
                    } catch (_) {}
                    return res.status(400).json({
                        error: `Image file too large. Max ${MAX_MB}MB allowed`
                    });
                }

                localImagePath = imageFile.path;
                const ext = path.extname(imageFile.originalname) || '';
                const fileName = `uploads/user-images/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(localImagePath);

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: imageFile.mimetype,
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
                    fs.unlinkSync(localImagePath);
                } catch (_) {}

                if (existing.image && existing.image.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                    const parts = existing.image.split(`/${BUCKET}/`);
                    if (parts.length > 1) {
                        const oldPath = parts[1];
                        await supabase.storage.from(BUCKET).remove([oldPath]);
                    }
                }
            }

            if (req.files ?.resume ?. [0]) {
                const resumeFile = req.files.resume[0];
                const fileSizeInMB = resumeFile.size / (1024 * 1024);

                if (fileSizeInMB > MAX_MB) {
                    try {
                        fs.unlinkSync(resumeFile.path);
                    } catch (_) {}
                    return res.status(400).json({
                        error: `Resume file too large. Max ${MAX_MB}MB allowed`
                    });
                }

                localResumePath = resumeFile.path;
                const ext = path.extname(resumeFile.originalname) || '';
                const fileName = `uploads/resumes/${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                const buffer = fs.readFileSync(localResumePath);

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, buffer, {
                        contentType: resumeFile.mimetype,
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

                resumeUrl = data.publicUrl;

                try {
                    fs.unlinkSync(localResumePath);
                } catch (_) {}

                if (existing.resume && existing.resume.includes(`/storage/v1/object/public/${BUCKET}/`)) {
                    const parts = existing.resume.split(`/${BUCKET}/`);
                    if (parts.length > 1) {
                        const oldPath = parts[1];
                        await supabase.storage.from(BUCKET).remove([oldPath]);
                    }
                }
            }

            const payload = {
                fullname: (typeof fullname === 'string' && fullname.trim()) ? fullname.trim() : existing.fullname,
                username: (typeof username === 'string' && username.trim()) ? username.trim() : existing.username,
                description: typeof description === 'string' ? description.trim() : existing.description,
                address: typeof address === 'string' ? address.trim() : existing.address,
                email: typeof email === 'string' ? email.trim() : existing.email,
                image: imageUrl,
                resume: resumeUrl,
            };

            const updatedUser = await UserModel.update(userId, payload);
            const {
                password: _,
                ...userWithoutPassword
            } = updatedUser;

            res.json(userWithoutPassword);
        } catch (err) {
            if (localImagePath) {
                try {
                    fs.unlinkSync(localImagePath);
                } catch (_) {}
            }
            if (localResumePath) {
                try {
                    fs.unlinkSync(localResumePath);
                } catch (_) {}
            }
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async changePassword(req, res) {
        try {
            const {
                currentPassword,
                newPassword
            } = req.body;
            const userId = req.userId;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Current password and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'New password must be at least 6 characters long'
                });
            }

            const user = await UserModel.getById(userId);

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Current password is incorrect'
                });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await UserModel.update(userId, {
                password: hashedNewPassword
            });

            res.json({
                message: 'Password changed successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = AuthController;