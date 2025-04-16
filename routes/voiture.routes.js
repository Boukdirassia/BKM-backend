const express = require('express');
const router = express.Router();
const voitureController = require('../controllers/voiture.controller');

router.get('/', voitureController.getAllVoitures);

module.exports = router;
