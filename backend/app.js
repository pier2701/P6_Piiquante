/** paramétrage du FRAMEWORK Express qui facilitera l'analyse des demandes **/

// la constante qui permet d'importer le module "express"
const { application } = require("express");
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// déclaration de constante pour importer l'application mongoose
const mongoose = require("mongoose");

// on importe le module "path" pour interagir avec les routes de fichiers "image"
const path = require("path");

const bodyParser = require("body-parser");

// on importe la méthode "router" créée dans le fichier "sauce.js" avec TOUTES les routes/requêtes
const sauceRoutes = require("./routes/sauce");

// on importe la méthode "router" créée pour les "users"
const userRoutes = require("./routes/user");

// la constante déclarée permet de créer une application "express"
const app = express();

// on déclare la variable d'environnement de connection
const MONGODB_URI = process.env.MONGODB_URI;

// connection à mongoDB à travers mongoose avec userId et mdp ( + adresse fourni lors de la création de l'userId) dans le lien
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB Atlas réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());

// middleware de "headers", général appliqué à toutes les routes/requêtes, qui
/**app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});*/
/** utilisation de Middlewares et de la fonction next() pour passer au middleware suivant **/

// middleware qui intercepte les requêtes utilisateur POUR LES RENDRE EXPLOITABLE sous format "json"
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// mise en place d'une route pour les fichiers "static" (images)
app.use("/images", express.static(path.join(__dirname, "images")));

// mise en place de l'app de "sauceRoutes" avec les chemins vers "api/sauces" le routeur mis en place
app.use("/api/sauces", sauceRoutes);

// mise en place de l'app de "userRoutes" avec le chemin attendu par le "frontend" "api/auth (signup et login) et le routeur pour les != chemins "user"
app.use("/api/auth", userRoutes);

// exporter l'application pour pouvoir l'utiliser depuis les autres fichiers
module.exports = app;
