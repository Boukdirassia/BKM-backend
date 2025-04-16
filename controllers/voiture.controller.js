const Voiture = require('../models/voiture.model');

exports.getAllVoitures = (req, res) => {
  Voiture.getAll((err, data) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(data);
  });
};


