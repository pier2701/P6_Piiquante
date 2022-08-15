/** paramétrage du FRAMEWORK Express qui facilitera l'analyse des demandes **/

// la constante qui permet d'importer le module "express"
const { application } = require("express");
const express = require("express");

// on imorte le module "morgan" pour le suivi des requêtes
const morgan = require("morgan");

// installation du module "helmet" qui prévient des failles de sécurité courante liées au "headers"
const helmet = require("helmet");

// on importe un module contre attaque de type "brute-force" et "dictionary"
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// on importe le module CORS pour Cross-Origin Resource Sharing ou Partage des Ressources entre Origines Multiples
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

// déclaration de constante pour importer l'application mongoose
const mongoose = require("mongoose");

// on importe le module "path" pour interagir avec les routes de fichiers "image"
const path = require("path");

const bodyParser = require("body-parser");

// on importe le module "express-mongo-sanitize" pour prévenir des des attaques par injection de code dans les "form"
const mongoSanitize = require("express-mongo-sanitize");

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

app.use(helmet());
// on désactive le header "X-Powered-By" qui pourrait constituer une fuite d'informations
app.use(helmet.hidePoweredBy());

// configuration "Cross-Origin-Resource-Policy: same-site"
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

// configuration "express-mongo-sanitze" allowDots et replaceWith en globale
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);

// middleware qui intercepte les requêtes utilisateur POUR LES RENDRE EXPLOITABLE sous format "json"
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
// mise en place d'une route pour les fichiers "static" (images)
app.use("/images", express.static(path.join(__dirname, "images")));

// mise en place de l'app de "sauceRoutes" avec les chemins vers "api/sauces" le routeur mis en place
app.use("/api/sauces", sauceRoutes);

// mise en place de l'app de "userRoutes" avec le chemin attendu par le "frontend" "api/auth (signup et login) et le routeur pour les != chemins "user"
app.use("/api/auth", userRoutes, apiLimiter);

// exporter l'application pour pouvoir l'utiliser depuis les autres fichiers
module.exports = app;
