const express = require('express');
const app = express();
const utilisateurRoutes = require('./routes/utilisateur.routes');
const voitureRoutes = require('./routes/voiture.routes');
app.use(express.json());
app.use('/utilisateurs', utilisateurRoutes);
app.use('/voitures', voitureRoutes);
app.listen(4000, () => {
  console.log('Serveur Express en écoute sur le port 4000 🚀');
});
