# Boîte à Idées Collaborative avec IA et Supabase

## Description

Cette application web permet aux utilisateurs de soumettre des idées à travers un formulaire interactif.

Chaque idée contient :

* Un titre
* Une description
* Une catégorie générée automatiquement par une Intelligence Artificielle
* Une date de création

Les données sont stockées dans une base de données Supabase et affichées dynamiquement dans l'interface.

---

## Fonctionnalités

### Gestion des idées

* Ajouter une idée
* Modifier une idée
* Supprimer une idée
* Afficher la liste des idées

### Validation des formulaires

* Vérification du titre
* Vérification de la catégorie
* Vérification de la description
* Messages d'erreur dynamiques
* Validation visuelle avec styles CSS

### Intelligence Artificielle

L'application utilise OpenRouter afin d'analyser automatiquement le contenu saisi et attribuer une catégorie pertinente parmi :

* pedagogie
* evenement
* campus
* technique

### Base de données

Les données sont enregistrées dans Supabase.

Opérations réalisées :

* SELECT : récupération des idées
* INSERT : ajout d'une idée
* UPDATE : modification d'une idée
* DELETE : suppression d'une idée

---

## Technologies utilisées

### Front-end

* HTML5
* CSS3
* JavaScript ES6+

### Base de données

* Supabase

### Intelligence Artificielle

* OpenRouter API
* Modèle : openai/gpt-oss-120b:free

### Icônes

* Ionicons


## Concepts JavaScript utilisés

### Fonctions classiques

Utilisées pour :

* La validation
* L'affichage
* Les opérations utilitaires

Exemples :

* validateTitre()
* validateCategorie()
* validateDescription()
* resetFields()

### Fonctions asynchrones

Utilisées pour les appels API et les requêtes Supabase.

Exemples :

* classerCategorie()
* chargerTaches()
* addtache()

### Fonctions fléchées

Utilisées notamment dans :

* Les événements
* Les callbacks
* Les boucles forEach()

### Promesses

Gestion des opérations asynchrones avec :

* async
* await

### Manipulation du DOM

Utilisation de :

* document.getElementById()
* document.createElement()
* addEventListener()
* appendChild()
* innerHTML

### Template Literals

Utilisation des backticks (` `) pour générer dynamiquement le HTML.

### Destructuring

Utilisé avec les réponses Supabase :

```javascript
const { data, error } = await supabaseClient
  .from("taches")
  .select("*");
```

### Conditions

Utilisation de :

* if / else
* switch

### Tableaux

Utilisation de :

* forEach()
* variables globales contenant les tâches

---

## Structure générale du projet

```text
Projet/
│
├── index.html
├── image.jpg
├── style.css
├── app.js
└── README.md
```


## Initialisation de l'application

Au chargement de la page :

1. Création du client Supabase
2. Ajout des écouteurs d'événements
3. Chargement des tâches depuis la base de données
4. Affichage dynamique des données

## Installation et exécution

## Cloner le projet

bash

git clone https://github.com/Aissata-Sow788/Brief_Bo-te_Id-es_Collaborative_Javascript.git



### Ouvrir le dossier

bash

cd /home/aissata-sow/Documents/Brief_Boite_Idees_Collaborative_Javascript _cloudIA_SUPERBASE


### Lancer l'application

Ouvrir le fichier `index.html` dans un navigateur ou dans le lien du deploiement `https://unique-buttercream-898416.netlify.app/`.



## Auteur

Projet réalisé par Aissata Sow dans le cadre d'un Brief de développement JavaScript, Intelligence Artificielle et Supabase.





