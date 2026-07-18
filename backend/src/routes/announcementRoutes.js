const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');

router.post('/anuncios', AnnouncementController.create);
router.get('/anuncios', AnnouncementController.list);
router.delete('/anuncios/:id', AnnouncementController.delete);

module.exports = router;