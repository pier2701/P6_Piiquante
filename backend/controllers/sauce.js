// importation du "schema" créé dans mongoose importé du dossier "models"
// car il est réutilisé ici
const Sauce = require("../models/sauce");

const { json } = require("express");
// on déclare la méthode "fs"
const fs = require("fs");

// on exporte les méthodes créées au sein de chaque "router" dans une nouvelle fonction pour chaque méthode "router"

// on récupère la logique pour "créer" un article
exports.createSauce = (req, res, next) => {
  // on va "parsé" l'objet json de "req"
  const sauceObject = JSON.parse(req.body.sauce);

  // on va supprimer 2 éléments dans cet objet :
  // _id ( car l'id sera généré automatiquement par mongoDB ) et userId ( il ne faut pas faire confiance à l'user )
  // on utlisera l'id du Token de l'user pour renforcer la sécurité du site
  delete sauceObject._id;
  delete sauceObject._userId;

  // on va créer un nouvel objet "Sauce"
  const sauce = new Sauce({
    ...sauceObject, // model d'objet sans les 2 éléments
    userId: req.auth.userId, // on extrait notre id du token de la méthode "auth"
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`, // on reconstitue l'URL en faisant appelle aux "propriétés" de l'objet "req"
  });
  // on enregistre l'objet dans la base avec la méthode "save()"
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré comme sauce !!!" });
    })
    .catch((error) => res.status(400).json({ error }));
};

// on récupère la logique pour "modifier" un article
exports.modifySauce = (req, res, next) => {
  // on met en place la logique pour "récupèrer" l'image et la supprimer de la base de données
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      // on récupère le nom de l'image
      const imgFile = sauce.imageUrl.split("/images/")[1];
      console.log("l'imageUrl = ", imgFile);

      // on supprime l'image du dossier "images"
      fs.unlink(`images/${imgFile}`, (error) => {
        if (error) throw error;
      });
    });
  }

  // on passe par la condition ternaire pour voir s'il y a un champ "file" ( image ) dans notre "req"
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce), // si oui, on parse pour récupèrer l'objet
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`, // on reconstitue l'URL en faisant appelle aux "propriétés" de l'objet "req"
    }
    : { ...req.body }; // sinon on récupère l'objet directemnt dans le corps de la requête
  // on supprime le userId pour eviter qu'un user créé un objet pour la réattribuer à quelqu'un d'autre
  delete sauceObject._userId;

  // on compare l'objet user avec notre BD pour confirmer que l'objet lui appartient bien
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(" => userId de la sauce = " + sauce.userId);
      console.log("   => userId de la req = " + req.auth.userId);
      if (sauce.userId != req.auth.userId) {
        // si Id est != de l'id du token => erreur 403 "unauthorized request"
        console.log("differents userId !!!");
        res.status(403).json({ message: "unauthorized request" });
      } else {
        // méthode updateOne pour modifier avec 2 arguments =>
        // le 1er = _id de comparaison à modifier, le 2ème = la nouvelle version de l'objet avec le même _id
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !!!" }))
          // error 401 pour dire que l'objet n'est pas trouvé
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error })); // si l'ojet ne lui appartient pas
};

// on récupère la logique pour effacer un article
exports.deleteSauce = (req, res, next) => {
  // on compare le "create-user" et le "delete-user" qui fait la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(" => userId de la sauce = " + sauce.userId);
      console.log("   => userId de la req = " + req.auth.userId);
      if (sauce.userId != req.auth.userId) {
        // on compare le 'userId' avec celui du token
        // si la comparaison n'es pas bonne => error 403
        console.log("differents userId !!!");
        res.status(403).json({ message: "unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1]; // on récupère le nom du fichier
        fs.unlink(`images/${filename}`, () => {
          // "unlink" permet de supprimer le fichier dans le système de fichier
          // méthode deleteOne pour supprimer avec l'id qui est pointée
          Sauce.deleteOne({ _id: req.params.id }) // puis on delete l'objet dans la base de données
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !!!" });
            })
            // error 401 pour dire que l'objet n'est pas trouvé
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// on récupère la logique pour afficher 1 seul article
exports.getOneSauce = (req, res, next) => {
  // route pour accèder à la page de 1 seul produit
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    // error 401 pour dire que l'objet n'est pas trouvé
    .catch((error) => res.status(401).json({ error }));
};

// on récupère la méthode pour afficher touts les articles
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    // function "sauces" récupère toutes les requêtes PUT déposées
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// on met en place et exporte la méthode des like/dislike
exports.likeDislike = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  console.log("like/dislike : " + req.body.like);
  console.log("userId : " + req.body.userId);
  console.log("sauceId : " + req.params.id);

  switch (like) {
    // cas du "like" qui est égal à 1
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        // on push le userId dans le [ usersLiked ] et on incrémente "likes" de 1
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: "like modifié" }))
        .catch((error) => res.status(400).json({ error }));

      break;

    // cas du "like/dislike" qui est égal à 0
    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          // si le userId a déjà liké et qu'il est dans [ usersLiked ]
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              // on le retire du [  usersLiked ] et on annule son "like"
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: "like modifié" }))
              .catch((error) => res.status(400).json({ error }));
          }
          // si le userId a déjà disliké et qu'il est dans [ usersDisliked ]
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              // on le retire du [  usersDisliked ] et on annule son "dislike"
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: "dislike modifié" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    // cas du "dislike" qui est égal à -1
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        // on push le userId dans le [ usersDisliked ] et on incrémente "dislikes" de 1
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => res.status(200).json({ message: "dislike modifié" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log(error);
  }
};
