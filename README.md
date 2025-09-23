# WildWatch 🌿

Une application mobile développée avec Expo et React Native pour l'observation et la documentation de la faune et de la flore locales. WildWatch permet aux utilisateurs de créer facilement des observations géolocalisées avec photos et de les sauvegarder localement.

## 📱 Fonctionnalités principales

### 🗺️ Carte interactive
- **Carte basée sur Mapbox** : Interface cartographique moderne et fluide
- **Géolocalisation en temps réel** : Affichage de votre position actuelle avec un indicateur visuel pulsant
- **Navigation intuitive** : Zoom, déplacement et boussole intégrée
- **Points d'observation** : Visualisation de toutes vos observations sur la carte avec des marqueurs animés

### 📍 Ajout d'observations
- **Sélection par tap** : Tapez n'importe où sur la carte pour créer une nouvelle observation
- **Formulaire complet** :
  - Nom de l'observation (obligatoire)
  - Date d'observation (pré-remplie avec la date actuelle)
  - Coordonnées GPS automatiques (latitude/longitude)
  - Photo optionnelle (appareil photo ou galerie)
- **Validation des données** : Vérification des champs obligatoires avant sauvegarde
- **Feedback visuel** : Animation d'apparition des nouveaux marqueurs sur la carte

### 📷 Gestion des photos
- **Capture photo** : Prise de photo directe via l'appareil photo
- **Import galerie** : Sélection d'images existantes depuis la galerie
- **Gestion des permissions** : Demande automatique des autorisations caméra et galerie
- **Prévisualisation** : Affichage de l'image sélectionnée dans le formulaire
- **Modification** : Possibilité de changer l'image avant sauvegarde

### 🔍 Consultation des observations
- **Détails complets** : Affichage modal avec toutes les informations
- **Informations disponibles** :
  - Nom de l'observation
  - Date d'observation
  - Coordonnées GPS précises (6 décimales)
  - Date de création
  - Photo en taille réelle (si disponible)
- **Interface intuitive** : Modal coulissant depuis le bas de l'écran

### 💾 Stockage local
- **Sauvegarde automatique** : Toutes les observations sont stockées localement
- **Persistance des données** : Les observations restent disponibles après fermeture de l'app
- **Gestion d'erreurs** : Messages d'erreur informatifs en cas de problème de sauvegarde
- **Identifiants uniques** : Chaque observation possède un ID unique généré automatiquement

### 🔐 Gestion des permissions
- **Localisation** : Demande d'autorisation pour accéder à votre position
- **Caméra** : Permission pour prendre des photos
- **Galerie** : Autorisation pour accéder aux photos existantes
- **Écrans d'erreur** : Interfaces dédiées pour les cas de permissions refusées
- **Nouvelle tentative** : Possibilité de redemander les permissions

## 🛠️ Technologies utilisées

### Frontend
- **React Native** 0.81.4 - Framework multiplateforme
- **Expo** ~54.0.9 - Plateforme de développement
- **TypeScript** - Typage statique
- **Expo Router** - Navigation basée sur les fichiers

### Cartographie
- **@rnmapbox/maps** - Intégration Mapbox pour les cartes
- **expo-location** - Services de géolocalisation

### Médias
- **expo-image-picker** - Capture et sélection de photos
- **expo-image-manipulator** - Manipulation d'images

### Stockage
- **@react-native-async-storage/async-storage** - Stockage local persistant

### Navigation
- **@react-navigation/native** - Navigation entre écrans
- **@react-navigation/bottom-tabs** - Navigation par onglets

## 📁 Structure du projet

```
WildWatch/
├── app/                    # Pages principales (Expo Router)
│   ├── _layout.tsx        # Configuration de navigation
│   ├── index.tsx          # Page d'accueil (MapScreen)
│   └── map.tsx            # Page carte
├── components/            # Composants réutilisables
│   ├── MapScreen.tsx      # Écran principal avec carte
│   ├── ObservationForm.tsx # Formulaire d'ajout d'observation
│   ├── ObservationDetails.tsx # Modal de détails d'observation
│   ├── LoadingScreen.tsx  # Écran de chargement
│   └── UnauthorizedScreen.tsx # Écran d'erreur permissions
├── hooks/                 # Hooks personnalisés
│   └── useCurrentPosition.ts # Hook de géolocalisation
├── services/              # Services et logique métier
│   └── ObservationService.ts # Service de gestion des observations
├── types/                 # Définitions TypeScript
│   └── Observation.ts     # Interface Observation
└── package.json           # Dépendances et scripts
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Un token d'accès Mapbox

### Installation

1. **Cloner le repository**
   ```bash
   git clone [URL_DU_REPO]
   cd WildWatch
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Mapbox**
   - Créez un compte sur [Mapbox](https://www.mapbox.com/)
   - Obtenez votre token d'accès public
   - Créez un fichier `.env` à la racine du projet :
     ```
     EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN=votre_token_ici
     ```

4. **Lancer l'application**
   ```bash
   npm start
   ```

### Scripts disponibles

- `npm start` - Démarrer le serveur de développement Expo
- `npm run android` - Lancer sur émulateur/appareil Android
- `npm run ios` - Lancer sur simulateur/appareil iOS
- `npm run web` - Lancer la version web
- `npm run lint` - Vérification du code avec ESLint
- `npm run prebuild` - Préparation pour les builds natifs

## 📱 Utilisation

1. **Premier lancement** : L'application demande l'autorisation d'accès à votre localisation
2. **Navigation** : La carte s'ouvre centrée sur votre position actuelle
3. **Ajouter une observation** :
   - Tapez n'importe où sur la carte
   - Remplissez le formulaire qui apparaît
   - Ajoutez optionnellement une photo
   - Sauvegardez votre observation
4. **Consulter les observations** : Tapez sur un marqueur existant pour voir les détails
5. **Navigation** : Utilisez les gestes de pincement et glissement pour naviguer sur la carte

## 🔧 Configuration avancée

### Mapbox
Le projet utilise Mapbox pour les cartes. Assurez-vous de :
- Avoir un token valide dans votre fichier de configuration
- Respecter les limites d'usage de votre plan Mapbox
- Configurer les domaines autorisés si nécessaire

### Permissions
L'application nécessite les permissions suivantes :
- **Localisation** : Pour afficher votre position et géolocaliser les observations
- **Caméra** : Pour prendre des photos des observations
- **Galerie** : Pour sélectionner des photos existantes

## 🐛 Résolution de problèmes

### Problèmes courants

1. **Erreur de token Mapbox**
   - Vérifiez que votre token est correct dans le fichier `.env`
   - Assurez-vous que le token est public (commence par `pk.`)

2. **Problème de localisation**
   - Vérifiez que les permissions de localisation sont accordées
   - Testez sur un appareil physique (la localisation peut ne pas fonctionner sur simulateur)

3. **Images ne s'affichent pas**
   - Vérifiez les permissions caméra/galerie
   - Testez sur un appareil physique