# Pour démarrer l'application

Il faudra `cloner` le "projet" sur son ordinateur dans un dossier reservé à l'application.

Ensuite, ouvrir le projet à partir de l'éditeur de code ( ex: vscode ).

À partir du terminal intégré, il faudra se rendre dans le dossier "backend" et taper la commande suivante pour pouvoir installer toutes les dépendances liées à l'application :

`npm install`

puis ensuite :

`npm install -g nodemon`

Après l'installation des modules, propres au fonctionnement de l'application, rester dans le dossier "backend" puis taper :

`nodemon server`

Cette action lancera le serveur.

Se rendre, à partir du terminal, dans le dossier "frontend", puis taper :

`npm install`

puis mettre à jour angular avec la commande suivante :

`npm install --save @angular/cli`

Depuis le terminal, toujours dans le dossier "frontend", taper la commande suivante :

`npm run start`
Cette action lancera l'application.

Une fois, ces commandes effectuées, se rendre à l'adresse http://localhost:4200/ pour naviguer dans l'application.

Pour le `signup`, un contrôle de l'email vérifiera son format. Le mot de passe devra faire entre 6 et 40 caractères maximum, contenir au moins 1 majuscule, 1 minuscule, 2 chiffres entiers, pas d'espace et être différent de `Passwrd12` et `Password123`.
