// importer le module mongoose qui va créer un model "schema" pour structurer notre doc/schema
const mongoose = require("mongoose");

// contruction du "schema" pour notre model réutilisable
const ModelsSauce = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

// on exporte le model pour l'utliser, 1er argument 'Sauce' (nom du model), 2ème argument ModelsSauce (model/schema)
module.exports = mongoose.model("Sauce", ModelsSauce);
