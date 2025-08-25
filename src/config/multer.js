const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isProd = process.env.NODE_ENV === 'production';
        const uploadPath = isProd ? os.tmpdir() : path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {
                recursive: true
            });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage
});
module.exports = upload;
