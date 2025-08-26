const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({
            error: 'Server configuration error'
        });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({
                error: 'Invalid or expired token'
            });
        }

        req.userId = user.userId;
        req.userEmail = user.email;
        next();
    });
};

const verifyToken = (req, res) => {
    res.json({
        message: 'Token valid',
        userId: req.userId,
        email: req.userEmail
    });
};

module.exports = {
    authenticateToken,
    verifyToken
};