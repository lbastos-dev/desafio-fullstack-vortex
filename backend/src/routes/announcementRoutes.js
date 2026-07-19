const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas de Autenticação (Públicas)
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Rotas de Anúncios
router.get('/anuncios', AnnouncementController.list); // Pública (Landing Page)
router.post('/anuncios', authMiddleware, AnnouncementController.create); // Protegida (PWA)
router.delete('/anuncios/:id', authMiddleware, AnnouncementController.delete); // Protegida (PWA)

module.exports = router; 