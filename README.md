# SENVOTES API

## Introduction

Senvotes est une application de vote électronique, ceci est le backend de cette solution développée avec Node.js, Express.js et Supabase. Cette application permet aux utilisateurs de s'inscrire, de se connecter, de voter sur des événements et de gérer les événements pour les administrateurs.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Endpoints](#endpoints)
  - [Authentification](#authentification)
  - [Événements](#événements)
  - [Votes](#votes)
- [Sécurité](#sécurité)
## Prérequis

- Node.js (v14 ou supérieur)
- NPM ou Yarn
- Un compte Supabase

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone [https://github.com/law-san-esp/senvotes-express.git]
cd senvotes-express
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement suivantes :

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
JWT_SECRET=your-secret-key
EMAIL_HOST=your-email-host
EMAIL_PORT=your-email-port
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-pass
```

## Démarrage

Pour démarrer le serveur en mode développement :

```bash
npm run dev
```

Pour démarrer le serveur en mode production :

```bash
npm start
```

Le serveur sera lancé sur `http://localhost:5000` si aucun port n'est spécifié.

## Endpoints

### Authentification

- **Inscription**
  - **URL**: `/api/auth/register`
  - **Méthode**: POST
  - **Description**: Inscrit un nouvel utilisateur.
  - **Corps de la requête**:
    ```json
    {
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "password": "your-password"
    }
    ```

- **Vérification de l'email**
  - **URL**: `/api/auth/verify`
  - **Méthode**: POST
  - **Description**: Vérifie l'email de l'utilisateur avec un code.
  - **Corps de la requête**:
    ```json
    {
      "token": "verification-token"
    }
    ```

### Événements

- **Créer un événement**
  - **URL**: `/api/events/create`
  - **Méthode**: POST
  - **Description**: Crée un nouvel événement. Requiert une authentification.
  - **Corps de la requête**:
    ```json
    {
      "name": "Election 2024",
      "options": ["Candidate A", "Candidate B"],
      "limit_date": "2024-12-31",
      "authorizedUsers": ["user1@example.com", "user2@example.com"]
    }
    ```

- **Liste des événements**
  - **URL**: `/api/events/list`
  - **Méthode**: GET
  - **Description**: Récupère la liste des événements. Requiert une authentification.

### Votes

- **Voter**
  - **URL**: `/api/votes/vote`
  - **Méthode**: POST
  - **Description**: Enregistre un vote pour un événement. Requiert une authentification.
  - **Corps de la requête**:
    ```json
    {
      "eventId": "event-id",
      "option": "Candidate A"
    }
    ```

- **Liste des votes**
  - **URL**: `/api/votes/list`
  - **Méthode**: GET
  - **Description**: Récupère la liste des votes. Requiert une authentification.

## Sécurité

- Utilisez HTTPS pour sécuriser les communications entre le client et le serveur.
- Les mots de passe sont hachés avec bcrypt.
- Les tokens JWT sont utilisés pour l'authentification et ont une durée de vie de 72 heures.
- Les cookies de session sont marqués HttpOnly et expirent après 72 heures.
