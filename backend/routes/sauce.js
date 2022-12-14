// on importe toujours express pour récupérer ses méthodes
const express = require("express");

// on utlise la méthode "routeur" de "express"
const router = express.Router();

// on importe la méthode d'authentification
const auth = require("../middleware/auth");

// on importe la méthode "multer"
const multer = require("../middleware/multer-config");

// importation du "sauceControllers" créé le dossier "controllers"
const sauceCtrl = require("../controllers/sauce");

// le " / " du fichier "sauces" sera la route vers laquelle nous intercepterons les requêtes de type POST
router.post("/", auth, multer, sauceCtrl.createSauce); // ajout de "auth" AVANT les actions de route
// ajout de "multer" avant "auth"

// route de type PUT request pour modifier un article
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// route de type DELETE request pour supprimer un article
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// route de type GET pour 1 seul objet/article avec requête "params" de l'id
router.get("/:id", auth, sauceCtrl.getOneSauce);

// la route vers laquelle nous intercepterons les requêtes de type GET de toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);

// la route vers laquelle nous intercepterons les requêtes de type POST des "like/dislike" des users
router.post("/:id/like", auth, sauceCtrl.likeDislike);

// on réexporte la méthode "router" déclarer au début
module.exports = router;
