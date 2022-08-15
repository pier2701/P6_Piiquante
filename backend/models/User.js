// on importe mongoose
const mongoose = require("mongoose");

// on importe le module qui interprètera les erreurs en http, ainsi que les codes appropriés
const MongooseErrors = require("mongoose-errors");

// on rajoute un "plug-in" qui est "unique-validator"
const uniqueValidator = require("mongoose-unique-validator");

// on créé le "Schema" depuis mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(MongooseErrors);

userModel = mongoose.model("userModel", userSchema);
userModel.create().catch((error) => {
  console.log(error.statusCode);
  done();
});

// on applique le plug-in au "schema"
userSchema.plugin(uniqueValidator);

// on est prêt à exporter le model "User" sous forme de schéma
module.exports = mongoose.model("User", userSchema);
