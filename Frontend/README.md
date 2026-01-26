# TaskFlow - Frontend (HTML/CSS/JavaScript)

Application web moderne et professionnelle de gestion de tâches développée en **HTML, CSS et JavaScript vanilla** pur.

## 🎯 Caractéristiques

- ✅ **Aucune dépendance** - HTML/CSS/JavaScript pur
- 🎨 **Design moderne** - Interface professionnelle et responsive
- 🔐 **Authentification complète** - Login, Register, Logout
- 📊 **Statistiques en temps réel** - Suivi des tâches
- 🚀 **Performance optimale** - Chargement ultra-rapide
- 📱 **Responsive** - Fonctionne sur tous les écrans

## 📁 Structure du projet

```
Frontend/
├── index.html              # Page de connexion
├── register.html           # Page d'inscription
├── dashboard.html          # Tableau de bord
└── assets/
    ├── css/
    │   └── style.css       # Styles complets (CSS Variables)
    └── js/
        ├── config.js       # Configuration (API URL, etc.)
        ├── utils.js        # Fonctions utilitaires
        ├── api.js          # Client API (fetch)
        ├── auth.js         # Logique de connexion
        ├── register.js     # Logique d'inscription
        └── dashboard.js    # Logique du dashboard
```

## 🚀 Installation & Démarrage

### Option 1: Serveur HTTP Python (Recommandé)
```bash
cd Frontend
python3 -m http.server 8080
```

### Option 2: Serveur HTTP PHP
```bash
cd Frontend
php -S localhost:8080
```

### Option 3: Live Server (VS Code)
1. Installer l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

Ensuite, ouvrez votre navigateur à : **http://localhost:8080**

## 🔗 Configuration Backend

Assurez-vous que le backend Laravel est lancé sur le port **8001** :

```bash
cd ../Backend
php artisan serve --port=8001
```

Le frontend est configuré pour communiquer avec : `http://127.0.0.1:8001/api`

Pour modifier l'URL de l'API, éditez `assets/js/config.js` :
```javascript
const CONFIG = {
    API_URL: 'http://127.0.0.1:8001/api',  // Modifier ici
    // ...
};
```

## 🎨 Fonctionnalités

### Pages d'authentification
- **Login** (`index.html`) - Connexion avec email/password
- **Register** (`register.html`) - Inscription avec validation

### Dashboard
- Statistiques : Total, En attente, Terminées, Progression
- Ajout de tâches avec formulaire intuitif
- Filtres : Toutes / En attente / Terminées
- Actions : Cocher/Décocher, Supprimer
- Menu utilisateur avec déconnexion

## 💾 Stockage

- **Token d'authentification** : `localStorage` (`auth_token`)
- **Données utilisateur** : `localStorage` (`user_data`)

## 🎯 API Endpoints utilisés

```
POST   /api/register          - Inscription
POST   /api/login             - Connexion
POST   /api/logout            - Déconnexion
GET    /api/user              - Infos utilisateur
GET    /api/tasks             - Liste des tâches
POST   /api/tasks             - Créer une tâche
PUT    /api/tasks/{id}        - Modifier une tâche
DELETE /api/tasks/{id}        - Supprimer une tâche
```

## 🛡️ Sécurité

- Protection XSS avec `escapeHtml()`
- Validation côté client avant envoi
- Token Bearer pour toutes les requêtes authentifiées
- Redirection automatique si non-authentifié

## 📱 Responsive Design

Le design s'adapte automatiquement :
- **Desktop** : Layout complet avec grilles
- **Tablet** : Layout adapté
- **Mobile** : Colonnes empilées, menu optimisé

## 🎨 Personnalisation

Les couleurs sont définies dans `:root` dans `style.css` :

```css
:root {
    --primary-500: #6366f1;  /* Couleur principale */
    --primary-600: #4f46e5;
    /* ... */
}
```

## 🐛 Débogage

Ouvrez la **Console développeur** (F12) pour voir :
- Les appels API
- Les erreurs éventuelles
- Les logs de débogage

## 📄 Licence

Projet académique et professionnel - TaskFlow
