// importer le module mongoose qui va créer un model "schema" pour structurer notre doc/schema
const mongoose = require("mongoose");

// contruction du "schema" pour notre model réutilisable
const ModelsSauce = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

// on exporte le model pour l'utliser, 1er argument 'Thing' (nom du model), 2ème argument thingSchema (model/schema)
module.exports = mongoose.model("Thing", ModelsSauce);
