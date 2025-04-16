const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur.controller');

router.get('/', utilisateurController.getAllUtilisateurs);

module.exports = router;
