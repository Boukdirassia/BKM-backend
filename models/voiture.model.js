const db = require('../config/db');

const Voiture = {
  getAll: (callback) => {
    db.query('SELECT * FROM voiture', callback);
  },
};

module.exports = Voiture;
