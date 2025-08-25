const express = require('express');
const CertificateController = require('../controllers/certificateController');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', CertificateController.getAll);
router.get('/:id', CertificateController.getById);
router.post('/', upload.single('image'), CertificateController.create);
router.put('/:id', upload.single('image'), CertificateController.update);
router.delete('/:id', CertificateController.delete);

module.exports = router;
