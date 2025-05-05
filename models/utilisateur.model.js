const db = require('../config/db');

const Utilisateur = {
  getAll: (callback) => {
    db.query('SELECT * FROM utilisateurs', callback);
  },
  
  getById: (id, callback) => {
    db.query('SELECT * FROM utilisateurs WHERE UserID = ?', [id], callback);
  },
  
  create: (userData, callback) => {
    db.query(
      'INSERT INTO utilisateurs (Nom, Prenom, Email, Telephone, Password, Roles) VALUES (?, ?, ?, ?, ?, ?)',
      [userData.Nom, userData.Prenom, userData.Email, userData.Telephone, userData.Password, userData.Roles],
      callback
    );
  },
  
  update: (id, userData, callback) => {
    // Construire dynamiquement la requête SQL en fonction des champs fournis
    let fields = [];
    let values = [];
    
    // Ajouter chaque champ s'il est défini
    if (userData.Nom !== undefined) {
      fields.push('Nom = ?');
      values.push(userData.Nom);
    }
    
    if (userData.Prenom !== undefined) {
      fields.push('Prenom = ?');
      values.push(userData.Prenom);
    }
    
    if (userData.Email !== undefined) {
      fields.push('Email = ?');
      values.push(userData.Email);
    }
    
    if (userData.Telephone !== undefined) {
      fields.push('Telephone = ?');
      values.push(userData.Telephone);
    }
    
    // N'inclure le mot de passe que s'il est explicitement fourni
    if (userData.Password !== undefined && userData.Password !== null && userData.Password !== '') {
      fields.push('Password = ?');
      values.push(userData.Password);
    }
    
    if (userData.Roles !== undefined) {
      fields.push('Roles = ?');
      values.push(userData.Roles);
    }
    
    // Si aucun champ n'est fourni, retourner une erreur
    if (fields.length === 0) {
      return callback(new Error('Aucun champ à mettre à jour'), null);
    }
    
    // Construire la requête SQL
    const sql = `UPDATE utilisateurs SET ${fields.join(', ')} WHERE UserID = ?`;
    
    // Ajouter l'ID à la fin des valeurs
    values.push(id);
    
    // Exécuter la requête
    db.query(sql, values, callback);
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM utilisateurs WHERE UserID = ?', [id], callback);
  },
  
  // Méthode pour l'authentification
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM utilisateurs WHERE Email = ?', [email], callback);
  }
};

module.exports = Utilisateur;
