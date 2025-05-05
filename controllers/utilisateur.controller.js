const Utilisateur = require('../models/utilisateur.model');
// Temporairement commenté jusqu'à ce que bcrypt soit correctement installé
// const bcrypt = require('bcrypt');
// const saltRounds = 10; // Nombre de tours pour le hachage

// Récupérer tous les utilisateurs
exports.getAllUtilisateurs = (req, res) => {
  Utilisateur.getAll((err, data) => {
    if (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err.message });
    } else {
      res.json(data);
    }
  });
};

// Récupérer un utilisateur par son ID
exports.getUtilisateurById = (req, res) => {
  Utilisateur.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
      } else {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err.message });
      }
    } else {
      res.json(data);
    }
  });
};

// Créer un nouvel utilisateur
exports.createUtilisateur = (req, res) => {
  // Valider la requête
  if (!req.body) {
    res.status(400).json({ message: "Le contenu ne peut pas être vide!" });
    return;
  }

  // Vérifier si l'email existe déjà
  Utilisateur.findByEmail(req.body.Email, (err, data) => {
    if (err) {
      if (err.kind !== "not_found") {
        res.status(500).json({
          message: "Erreur lors de la vérification de l'email",
          error: err.message
        });
        return;
      }
    }

    if (data && data.length > 0) {
      res.status(400).json({
        message: "Cet email est déjà utilisé"
      });
      return;
    }

    // Version sans hachage (temporaire)
    const utilisateur = {
      Nom: req.body.Nom,
      Prenom: req.body.Prenom,
      Email: req.body.Email,
      Telephone: req.body.Telephone,
      Password: req.body.Password,
      Roles: req.body.Roles || 'client'
    };

    // Enregistrer l'utilisateur dans la base de données
    Utilisateur.create(utilisateur, (err, data) => {
      if (err) {
        res.status(500).json({
          message: "Une erreur s'est produite lors de la création de l'utilisateur",
          error: err.message
        });
      } else {
        res.status(201).json(data);
      }
    });

    /* Version avec bcrypt - à réactiver après installation correcte
    // Hacher le mot de passe
    bcrypt.hash(req.body.Password, saltRounds, (err, hashedPassword) => {
      if (err) {
        res.status(500).json({
          message: "Erreur lors du hachage du mot de passe",
          error: err.message
        });
        return;
      }

      // Créer un utilisateur avec le mot de passe haché
      const utilisateur = {
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Email: req.body.Email,
        Telephone: req.body.Telephone,
        Password: hashedPassword, // Mot de passe haché
        Roles: req.body.Roles || 'client'
      };

      // Enregistrer l'utilisateur dans la base de données
      Utilisateur.create(utilisateur, (err, data) => {
        if (err) {
          res.status(500).json({
            message: "Une erreur s'est produite lors de la création de l'utilisateur",
            error: err.message
          });
        } else {
          res.status(201).json(data);
        }
      });
    });
    */
  });
};

// Mettre à jour un utilisateur
exports.updateUtilisateur = (req, res) => {
  // Valider la requête
  if (!req.body) {
    res.status(400).json({ message: "Le contenu ne peut pas être vide!" });
    return;
  }

  // Si l'email est modifié, vérifier s'il existe déjà
  if (req.body.Email) {
    Utilisateur.findByEmail(req.body.Email, (err, data) => {
      if (err) {
        if (err.kind !== "not_found") {
          res.status(500).json({
            message: "Erreur lors de la vérification de l'email",
            error: err.message
          });
          return;
        }
      }

      // Si l'email existe et qu'il appartient à un autre utilisateur
      if (data && data.length > 0 && data[0].UserID != req.params.id) {
        res.status(400).json({
          message: "Cet email est déjà utilisé par un autre utilisateur"
        });
        return;
      }

      // Version sans hachage (temporaire)
      const userData = {
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Email: req.body.Email,
        Telephone: req.body.Telephone,
        Roles: req.body.Roles
      };
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (req.body.Password && req.body.Password.trim() !== '') {
        userData.Password = req.body.Password;
      }
      
      updateUtilisateurInDB(userData);

      /* Version avec bcrypt - à réactiver après installation correcte
      // Si le mot de passe est fourni, le hacher
      if (req.body.Password && req.body.Password.trim() !== '') {
        bcrypt.hash(req.body.Password, saltRounds, (err, hashedPassword) => {
          if (err) {
            res.status(500).json({
              message: "Erreur lors du hachage du mot de passe",
              error: err.message
            });
            return;
          }
          
          // Mettre à jour avec le mot de passe haché
          const userData = {
            Nom: req.body.Nom,
            Prenom: req.body.Prenom,
            Email: req.body.Email,
            Telephone: req.body.Telephone,
            Password: hashedPassword,
            Roles: req.body.Roles
          };
          
          updateUtilisateurInDB(userData);
        });
      } else {
        // Mise à jour sans changer le mot de passe
        const userData = {
          Nom: req.body.Nom,
          Prenom: req.body.Prenom,
          Email: req.body.Email,
          Telephone: req.body.Telephone,
          Roles: req.body.Roles
        };
        
        updateUtilisateurInDB(userData);
      }
      */
    });
  } else {
    // Version sans hachage (temporaire)
    const userData = {
      Nom: req.body.Nom,
      Prenom: req.body.Prenom,
      Email: req.body.Email,
      Telephone: req.body.Telephone,
      Roles: req.body.Roles
    };
    
    // Ajouter le mot de passe seulement s'il est fourni
    if (req.body.Password && req.body.Password.trim() !== '') {
      userData.Password = req.body.Password;
    }
    
    updateUtilisateurInDB(userData);

    /* Version avec bcrypt - à réactiver après installation correcte
    // Même logique que ci-dessus mais sans vérification d'email
    if (req.body.Password && req.body.Password.trim() !== '') {
      bcrypt.hash(req.body.Password, saltRounds, (err, hashedPassword) => {
        if (err) {
          res.status(500).json({
            message: "Erreur lors du hachage du mot de passe",
            error: err.message
          });
          return;
        }
        
        const userData = {
          Nom: req.body.Nom,
          Prenom: req.body.Prenom,
          Email: req.body.Email,
          Telephone: req.body.Telephone,
          Password: hashedPassword,
          Roles: req.body.Roles
        };
        
        updateUtilisateurInDB(userData);
      });
    } else {
      const userData = {
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Email: req.body.Email,
        Telephone: req.body.Telephone,
        Roles: req.body.Roles
      };
      
      updateUtilisateurInDB(userData);
    }
    */
  }

  function updateUtilisateurInDB(userData) {
    Utilisateur.update(
      req.params.id,
      userData,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
          } else {
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: err.message });
          }
        } else {
          res.json(data);
        }
      }
    );
  }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = (req, res) => {
  Utilisateur.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({ message: `Utilisateur avec l'ID ${req.params.id} non trouvé` });
      } else {
        res.status(500).json({ message: "Impossible de supprimer l'utilisateur", error: err.message });
      }
    } else {
      res.json({ message: "Utilisateur supprimé avec succès!" });
    }
  });
};

// Authentification d'un utilisateur
exports.login = (req, res) => {
  // Valider la requête
  if (!req.body || !req.body.Email || !req.body.Password) {
    res.status(400).json({ message: "Email et mot de passe requis!" });
    return;
  }

  Utilisateur.findByEmail(req.body.Email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({ message: "Email ou mot de passe incorrect" });
      } else {
        res.status(500).json({ message: "Erreur lors de l'authentification", error: err.message });
      }
      return;
    }

    // Version sans bcrypt (temporaire)
    if (data[0].Password !== req.body.Password) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Ne pas renvoyer le mot de passe dans la réponse
    const { Password, ...userWithoutPassword } = data[0];
    res.json({
      message: "Authentification réussie",
      user: userWithoutPassword
    });

    /* Version avec bcrypt - à réactiver après installation correcte
    // Vérifier le mot de passe avec bcrypt
    bcrypt.compare(req.body.Password, data[0].Password, (err, isMatch) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la vérification du mot de passe", error: err.message });
        return;
      }
      
      if (!isMatch) {
        res.status(401).json({ message: "Email ou mot de passe incorrect" });
        return;
      }
      
      // Ne pas renvoyer le mot de passe dans la réponse
      const { Password, ...userWithoutPassword } = data[0];
      res.json({
        message: "Authentification réussie",
        user: userWithoutPassword
      });
    });
    */
  });
};
