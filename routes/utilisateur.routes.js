const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur.controller');

// Récupérer tous les utilisateurs
router.get('/', utilisateurController.getAllUtilisateurs);

// Récupérer un utilisateur par son ID
router.get('/:id', utilisateurController.getUtilisateurById);

// Créer un nouvel utilisateur
router.post('/', utilisateurController.createUtilisateur);

// Mettre à jour un utilisateur
router.put('/:id', utilisateurController.updateUtilisateur);

// Supprimer un utilisateur
router.delete('/:id', utilisateurController.deleteUtilisateur);

// Authentification
router.post('/login', utilisateurController.login);

module.exports = router;
