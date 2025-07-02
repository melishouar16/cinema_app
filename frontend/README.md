# Interface Cinéma

Application React pour créer et jouer des enquêtes policières inspirées de films.

## Installation

1. Aller dans le dossier frontend
   ```bash
   cd frontend
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Lancer l'application
   ```bash
   npm start
   ```

L'application sera accessible sur http://localhost:3000

## Utilisation

### Pages disponibles

**Accueil**
- Liste des enquêtes disponibles
- Voir les détails des enquêtes
- Évaluations et notes des utilisateurs

**Créer une enquête**
- Saisir le nom d'un film
- Génération automatique par IA
- Publication pour la communauté

**Jouer**
- Interface de jeu étape par étape
- Progression sauvegardée
- Système de scoring

**Connexion/Profil**
- Inscription et connexion
- Profil utilisateur
- Historique des parties

## Fonctionnalités

- Interface responsive compatible mobile/tablette
- **Night Mode** implémenté
- Navigation simple avec menu à icônes
- Authentification avec système login/register
- Jeu interactif avec interface d'enquête simple à appréhender
- **Système d'évaluations** avec notation 1-5 étoiles
- Sauvegarde de progression en local
- **Gestion des sessions de jeu**
- Interface moderne avec thèmes jour/nuit

## Technologies utilisées

- React
- Styled Components
- React Icons
- Context API
- Services API
- LocalStorage
