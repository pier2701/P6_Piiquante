// on récupère la package "bcrypt" pour hâcher le password
const bcrypt = require("bcrypt");

// on récupère la package "crypto-js" pour hâcher le "email"
const cryptoJs = require("crypto-js");

// on récupère la package "jsonwebtoken" à travers la constante
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const EMAILKEY = process.env.EMAILKEY;

// on récupère notre model de "user"
const User = require("../models/User");

// on déclare une méthode ( middleware ) de signup pour enregistrer un nouvel "user"
exports.signup = (req, res, next) => {
  // on chiffre l'email
  const emailCrypto = cryptoJs.HmacSHA256(req.body.email, EMAILKEY).toString();
  console.log("email-crypté = " + emailCrypto);

  // on appelle la function de hash de "bcrypt" pour passer le mot de passe du corps du front pendant 10 tours
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // on récupère le "hash" du MDP qu'on va enregistrer dans un nouveau "user"
      const user = new User({
        email: emailCrypto,
        password: hash,
      });
      user
        .save() // permet de l'enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !!!" })) // status 201 pour une crétion de ressource
        .catch((error) => res.status(400).json({ error })); // status 400 pour le différencier du 500
    })
    // renvoie une erreur 500 ( serveur ) dans un objet
    .catch((error) => res.status(500).json({ error }));
};

// on déclare une méthode ( middleware ) de login pour que le "user" puisse se connecter
// on met en place la logique pour trouver l'user puis on compare son mot de passe "hashé"
exports.login = (req, res, next) => {
  const emailCrypto = cryptoJs.HmacSHA256(req.body.email, EMAILKEY).toString();
  // recherche par le "champ" email et sa "valeur" dans le corps
  User.findOne({ email: emailCrypto })
    // gestion d'un recherche réussie
    .then((user) => {
      if (!user) {
        // ne jamais dire à l'user qu'il n'est pas dans la base de données DB (= fuite de données)
        return res.status(401).json({ message: "Utilisateur non trouvé!" });
      } else {
        // compare la requête "user" du body et la DB de password
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // si != donc ça sera une erreur d'authentification
            if (!valid) {
              // on renvoie le même message d'erreur
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              // mot de passe correct, donc on renvoie un "objet" en réponse avec l'id du "user" et le TOKEN
              res.status(200).json({
                userId: user._id,
                // on appelle la function sign() de jwt avec 3 arguments
                token: jwt.sign(
                  // l'intégration du userId dans le token permettra à l'user de créer et modifier ses propres articles et NON les autres
                  { userId: user._id },
                  process.env.RANDOM_TOKEN_SALT, // "payload" pour faire correspondre notre userId à la requête
                  { expiresIn: "24h" } // chaque token durera 24H
                ),
              });
            }
          })
          // status "500" = erreur serveur
          .catch((error) => res.status(500).json({ error }));
      }
    })
    // gestion d'un recherche non-aboutie ( error )
    .catch((error) => {
      // status "500" = erreur serveur
      res.status(500).json({ error });
    });
};
