# Pour démarrer l'application

Il faudra "cloner" le "projet" sur son ordinateur dans un dossier reservé à l'application.

Ensuite, ouvrir le projet à partir de l'éditeur de code ( ex: vscode ).

À partir du terminal intégré, il faudra se rendre dans le dossier "backend" et taper la commande suivante pour pouvoir installer toutes les dépendances liées à l'application :

npm install -g

Après l'installation des modules, propres au fonctionnement de l'application, rester dans le dossier "backend" puis taper :
nodemon server
Cette action lancera le serveur.

Se rendre, à partir du terminal, dans le dossier "frontend", puis taper :
npm install --save @angular/cli
Cette manipulation installera le framework "angular" qui a permis de coder la partie "frontend"

Depuis le terminal, toujours dans le dossier "frontend", taper la commande suivante :
npm run start
Cette action lancera l'application.

Une fois, ces commandes effectuées, se rendre à l'adresse http://localhost:4200/ pour naviguer dans l'application.

Pour le "signup", un contrôle de l'email vérifiera son format. Le mot de passe devra faire entre 6 et 40 caractères maximum, contenir au moins 1 majuscule, 1 minuscule, 2 chiffres entiers, pas d'espace et être différent de "Passwrd12" et "Password123".

# HotTakes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
