# API Cinéma

Application de génération d'enquêtes inspirées de films choisis par l'utilisateur

## Installation

1. Cloner le dépôt 
   ```bash
   git clone git@github.com:melishouar16/cinema_app.git  
   cd cinema_app
   ```

2. Lancer l'application avec Docker
   ```bash
   # Pour une première installation ou après des modifications du code
   docker-compose up -d --build
   
   # Pour les lancements suivants, si aucune modification n'a été faite
   docker-compose up -d
   ```

## Configuration de la base de données (❗IMPORTANT sinon erreur 500)

3. Appliquer les migrations pour initialiser la base de données 
   ```bash
   docker-compose exec web python manage.py migrate
   ```
## Chargement des données de test (fixtures)

4. Executer le fichier setup database pour appliques les jeux de données

   docker-compose exec web python setup_database.py

## Création du compte administrateur (facultatif si on a fait le chargement de données)

5. Créer un compte administrateur ( facultatif si on execute les fixtures)
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```
   Suivre les instructions pour créer un nom d'utilisateur et mot de passe.

## Configuration Gemini AI

1. Aller sur aistudio.google.com/app/apikey
2. Se connecter avec son compte gmail
3. Générer une clé API 
4. Créer un fichier `.env` dans `/backend/` avec : GEMINI_API_KEY=votre_clé

L'application est maintenant prête à être utilisée.

## Utilisation

### Interface d'administration

Accéder à l'interface d'administration Django à l'adresse http://localhost:8000/admin/ et se connecter avec les identifiants créés précédemment.

Cette interface permet de :
- Gérer les auteurs (création, modification, suppression)
- Gérer les films et leurs statuts (brouillon, publié, archivé)
- Explorer les données
  Auutre.... 

### API REST

L'application expose une API REST avec plusieurs fonctionnalités

#### Endpoints disponibles

**Authentification**
- `POST /api-token-auth/` - Obtenir un token d'authentification

**Auteurs**
- `GET /api/auteurs/` - Liste des auteurs
- `GET /api/auteurs/{id}/` - Détails d'un auteur
- `POST /api/auteurs/` - Créer un auteur
- `PATCH /api/auteurs/{id}/` - Modifier un auteur
- `DELETE /api/auteurs/{id}/` - Supprimer un auteur 

**Films**
- `GET /api/films/` - Liste des films
- `GET /api/films/?statut=publie` - Films filtrés par statut
- `GET /api/films/{id}/` - Détails d'un film
- `POST /api/films/` - Créer un film
- `PATCH /api/films/{id}/` - Modifier un film
- `PATCH /api/films/{id}/archiver/` - Archiver un film

**Enquêtes**
- `GET /api/enquetes/ - Lister toutes les enquêtes
- `POST /api/enquetes/ - Créer une enquête
- `GET /api/enquetes/{id}/ - Récupérer une enquête
- `DELETE /api/enquetes/{id}/ - Supprimer une enquête
- `DELETE /api/enquetes/delete_all/ - Supprimer toutes les enquêtes

**Évaluations**
- `POST /api/evaluations/ - Évaluer une enquête
- `GET /api/evaluations/ - Lister mes évaluations

**Users**
- `POST /api/users/ - Inscription utilisateur
- `GET /api/users/me/ - Mon profil
- `GET /api/users/ - Liste utilisateurs

**Test IA**
- `POST /api/test-ai/ - Test génération IA
- 
## Test de l'API

Deux méthodes sont disponibles pour tester l'API :

### Option 1 : Tests avec Bruno (comme j'ai fait dans le code)

1. **Installation**
   - Télécharger Bruno depuis leur site (https://www.usebruno.com/downloads)
   - Installer l'application sur le système

2. **Configuration**
   - Ouvrir Bruno et cliquer sur "Open Collection"
   - Sélectionner le dossier `api_tests` à la racine du projet
   - Dans "Environments", configurer "Local" avec les variables :
     ```
     vars {
       baseUrl: http://localhost:8000/api
       token:  (l'obtenir avec le test de l'authentification)
     }
     ```

3. **Exécution des tests**
   - Commencer par "Obtenir un token" dans le dossier "Authentification"
   - Utiliser les identifiants du superutilisateur créé
   - Tester ensuite les autres endpoints

### Option 2 : Tests avec cURL

Pour utiliser la ligne de commande :

1. **Obtenir un token d'authentification**
   ```bash
   curl -X POST http://localhost:8000/api-token-auth/ \
        -H "Content-Type: application/json" \
        -d '{"username": "nom_utilisateur", "password": "mot_de_passe"}'
   ```
   Noter le token retourné pour l'utiliser dans les requêtes suivantes.

2. **Lister les auteurs**
   ```bash
   curl -X GET http://localhost:8000/api/auteurs/ \
        -H "Authorization: Token votre_token_ici"
   ```

3. **Créer un auteur**
   ```bash
   curl -X POST http://localhost:8000/api/auteurs/ \
        -H "Content-Type: application/json" \
        -H "Authorization: Token votre_token_ici" \
        -d '{
          "nom": "Christopher Nolan",
          "email": "nolan@example.com",
          "date_naissance": "1970-07-30"
        }'
   ```

## Fonctionnalités

- Interface d'administration
- API REST sécurisée avec authentification par token
- Filtres avancés pour la recherche
- Relations entre auteurs et films
- Déploiement simplifié avec Docker
- Génération automatique d'enquêtes policières par IA Gemini
- Système de création d'enquêtes basées sur des films
- Système d'évaluation et notation des enquêtes
- Gestion des utilisateurs avec inscription/connexion
- Gestion des sessions de jeu et progression utilisateur
- Cache intelligent pour optimiser les performances
- Permissions selon type d'utilisateur
- Jeux de données de test prêts à l'emploi

## Technologies utilisées

- Django 
- Django REST Framework 
- PostgreSQL
- Docker et Docker Compose
- Google Gemini AI
- Bruno 
