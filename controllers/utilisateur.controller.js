const Utilisateur = require('../models/utilisateur.model');

exports.getAllUtilisateurs = (req, res) => {
  Utilisateur.getAll((err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(data);
    }
  });
};
