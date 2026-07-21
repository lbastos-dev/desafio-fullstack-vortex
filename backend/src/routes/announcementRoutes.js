const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Rotas de Autenticação (Públicas)
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Rotas de Anúncios
router.get('/anuncios', AnnouncementController.list);
router.post('/anuncios', authMiddleware, upload.single('image'), AnnouncementController.create);
router.delete('/anuncios/:id', authMiddleware, AnnouncementController.delete);

module.exports = router; 