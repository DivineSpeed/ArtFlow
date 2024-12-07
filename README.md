# ArtFlow

**ArtFlow** est une application web full-stack conçue pour fournir une plateforme de e-commerce où les artistes indépendants peuvent exposer et vendre leurs œuvres. Le projet se compose de deux parties principales : le backend, développé avec Spring Boot, et le frontend, développé avec Angular. La plateforme permet des interactions fluides entre les artistes et les acheteurs, facilitant les transactions et la gestion des œuvres.

## Structure du projet

- **Frontend** : La partie client de l'application est développée avec Angular. Elle gère l'interface utilisateur, le routage, et la communication avec le backend.
- **Backend** : Le backend est développé avec Spring Boot. Il fournit les API nécessaires pour interagir avec la base de données et gérer les données des utilisateurs, des commandes et des œuvres d'art.

## Fonctionnalités

### Backend

- Authentification et autorisation des utilisateurs
- Gestion des portefeuilles des artistes (ajouter, modifier, supprimer des œuvres)
- Traitement et gestion des commandes
- Intégration de la base de données MySQL
- API REST pour la communication avec le frontend

### Frontend

- Interface utilisateur conviviale pour parcourir, filtrer et afficher les œuvres d'art
- Profils des artistes et pages de portfolio
- Inscription et connexion sécurisées
- Gestion du panier et des commandes
- Intégration avec le backend via API REST

## Modèle Relationnel

Voici un aperçu des relations entre les entités principales du projet :

1. **Visiteur** : Un utilisateur non inscrit qui peut naviguer sur la plateforme, ajouter des produits au panier et passer des commandes.
2. **Compte** : Représente un utilisateur inscrit. Les Artisans et Administrateurs sont des spécialisations de ce type de compte.
3. **Boutique** : Un espace virtuel géré par un Artisan où les œuvres sont exposées et vendues.
4. **Produit** : Un article proposé à la vente.
5. **Commande** : Regroupe les produits achetés par un utilisateur ou un visiteur.
6. **Panier** : Contient les produits sélectionnés avant validation de la commande.
7. **PanierItem** : Représente un produit spécifique dans un panier.

## Schéma UML

Voici un schéma UML représentant les entités et leurs relations dans **ArtFlow** :

![Class global](https://github.com/user-attachments/assets/b343c731-12ab-4818-81ab-5d0d3d97cdc2)

## Démarrage

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [Java 17+](https://adoptopenjdk.net/) (pour le backend)
- [MySQL](https://dev.mysql.com/downloads/) (pour la base de données)
- [Maven](https://maven.apache.org/) (pour construire le backend)

## Installation

1. Clonez le dépôt du projet :

```bash
git clone https://github.com/DivineSpeed/ArtFlow.git
```

2. Accédez au dossier Frontend :

```bash
cd frontend
```

3. Téléchargez les packages nécessaires :

```bash
npm i --force
```

4. Lancez l'application frontend :

Double-cliquez sur le fichier start.bat dans le dossier backend, ou lancez-le directement via la ligne de commande en utilisant la commande suivante :

```bash
start.bat
```

6. Accédez au dossier Backend :

```bash
cd backend
```

7. Configurer la connexion à la base de données :

- Le fichier application.properties se trouve dans le dossier src/main/resources du projet backend

- Ouvrez ce fichier pour vérifier les paramètres de connexion à la base de données et assurez-vous que le port, l'utilisateur et le mot de passe sont correctement définis.

```bash
# Exemple de paramètres de connexion à la base de données
spring.datasource.url=jdbc:mysql://localhost:3306/nom_de_la_base
spring.datasource.username=utilisateur
spring.datasource.password=mot_de_passe
```

`* Port : Assurez-vous que le port 3306 (par défaut pour MySQL) est correct, ou remplacez-le par celui que vous utilisez`

`* Nom de la base de données : Modifiez nom_de_la_base par le nom réel de votre base de données dans notre cas Artflow.`

`* Utilisateur et mot de passe : Remplissez utilisateur et mot_de_passe avec vos informations de connexion.`

8. Exécuter le backend à partir d'IntelliJ :

- Allez dans Run > Edit Configurations et assurez-vous que votre configuration est prête pour un projet Spring Boot.

- Sélectionnez la classe principale de votre application Spring Boot qui contient l'annotation @SpringBootApplication.

- Cliquez sur Run (la flèche verte en haut à droite) pour démarrer le backend.

## API Reference

- **Authentication:**

  - `POST /auth/login` - Permettre à l'artisan de se connecter à sa boutique.

  ###### Paramètre JSON Body - Exemple :

      ```json
      {
         "mail": "admin@example.com",
         "password": "admin123"
      }
       ```

- **Visiteur:**

  - `GET /produits/public/products` - Récupérer tous les produits.
  - `GET /produits/getproductbyid/:id` - Récupérer le produit par ID.
  - `POST /cart/ajouter?quantite=:QUANTITE&Idproduit=:IDPROD` - Ajouter un produit au panier.
  - `DELETE /cart/removeItem?:Idproduit` - Supprimer produit du panier .
  - `POST /Commandes/creer` - Créer commande .
    ###### Paramètre JSON Body - Exemple :
    ```json
    {
      "nomVisiteur": "Ahmed",
      "prenomVisiteur": "Ali",
      "dateCommande": "2024-12-06T09:15:00",
      "adresseLivraison": "45 Avenue de l'Indépendance",
      "ville": "Tunis",
      "codePostal": "1001",
      "pays": "Tunisie",
      "numeroTelephone": "+2162384751",
      "email": "ahmed.ali@example.com"
    }
    ```

- **Admin:**

  - `GET /boutiques/All` - Récupérer toutes les boutiques.
  - `GET /Commandes/All` - Récupérer toutes les commandes.
  - `DELETE /boutiques/deleteBoutiqueByid/:idboutique` - Supprimer boutique par IDBoutique.
  - `GET /boutiques/getBoutiqueById/:idboutique` - Récupérer la boutique par IDBoutique.
  - `GET /Commandes/getCommandeByID/:idcommande` -Récupérer la commande par IDCommande .
  - `GET /Commandes/getCommandeByIDBoutique/:idboutique` - Récupérer les commandes de la boutique par IDBoutique.

- **Artisan:**

  - `POST /boutiques/createBoutique` - Créer une nouvelle boutique.
  - `POST /produits/artisan/addProduct` - Ajouter un nouveau produit.
  - `POST produits/artisan/getProduitsByArtisanActif` - Afficher tous les produits de l'artisan authentifié.
  - `PUT /produits/artisan/updateProduit/:idProduit` - Mettre à jour les information d'un produit existant.

  ###### Paramètre JSON Body - Exemple :

      ```json
      {
         "nomProduit": "Table en bois",
         "descriptionProduit": "Une table artisanale fabriquée à la main.",
         "prix": 150.00,
         "quantite": 10,
         "imageProduit": "https://example.com/images/table.jpg"
      }
       ```

  - `DELETE /produits/artisan/deleteProduit/:idProduit` - Supprimer un produit existant.
  - `POST /produits/artisan/getProduitById/:idProduit` - Récupérer un produit par son idProduit.
  - `POST /artisan/updateProfile`

    ###### Paramètre JSON Body - Exemple :

    ```json
    {
      "userId": 16,
      "nomArtisan": "Doe",
      "prenomArtisan": "John",
      "numTelephone": "+21612345678",
      "nomBoutique": "Artisan Créations",
      "description": "Création d'objets artisanaux faits main.",
      "adresseBoutique": "123 Rue des Artisans, Tunis",
      "facebookLink": "https://facebook.com/ArtisanCreations",
      "instagramLink": "https://instagram.com/ArtisanCreations"
    }
    ```

  - `GET /Commandes/getCommandeByIDArtisan/:idArtisan` - Récupérer les commandes par ID Artisan.
