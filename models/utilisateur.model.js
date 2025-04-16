const db = require('../config/db');

const Utilisateur = {
  getAll: (callback) => {
    db.query('SELECT * FROM utilisateurs', callback);
  },
};

module.exports = Utilisateur;
