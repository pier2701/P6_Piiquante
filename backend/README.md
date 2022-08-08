Les routes

"signup" => pour créer un compte
POST : http://localhost:3000/api/auth/signup
Body (exemple):
{
"email": "toto@test.com",
"password": "123456"
}

"login" => pour se connecter à un compte
POST : http://localhost:3000/api/auth/login
Body (exemple):
{
"email": "toto@test.com",
"password": "123456"
}

"Get All sauces" => pour afficher toutes les sauces
GET : http://localhost:3000/api/sauces

"Single sauce" => pour afficher 1 sauce
GET : http://localhost:3000/api/sauces/ + id de la sauce

"Create sauce" => pour créer une sauce
POST : http://localhost:3000/api/auth/sauces?KEY=VALUE
Params :
KEY = userId
VALUE = 62f0be81fc4f75e48246442e (userId de toto@test.com)
Body => form-data :

{
"\_id": "62f0e758b6cf045816eded53",
"userId": "62f0be81fc4f75e48246442e",
"name": "sweet chili",
"manufacturer": "mtp",
"description": "pikante!!!",
"mainPepper": "chili",
"imageUrl": "http://localhost:3000/images/Capture_dâ\u0080\u0099eÌ\u0081cran_2022-08-01_aÌ\u0080_07.21.28.png1659955032229.png",
"heat": 7,
"likes": 0,
"dislikes": 0,
"usersLiked": [],
"usersDisliked": [],
"\_\_v": 0
}