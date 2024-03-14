const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Définir le dossier des fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route pour gérer les requêtes GET vers la racine
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
