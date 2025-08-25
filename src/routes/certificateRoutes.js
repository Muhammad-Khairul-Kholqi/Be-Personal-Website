const express = require('express');
const CertificateController = require('../controllers/certificateController');
const {
    authenticateToken
} = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', CertificateController.getAll);
router.get('/:id', CertificateController.getById);
router.post('/', authenticateToken, upload.single('image'), CertificateController.create);
router.put('/:id', authenticateToken, upload.single('image'), CertificateController.update);
router.delete('/:id', authenticateToken, CertificateController.delete);

module.exports = router;
