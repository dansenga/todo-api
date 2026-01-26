# 🚀 TaskFlow Pro - Gestionnaire de Tâches SaaS-Ready

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/dansenga/todo-api)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2-purple.svg)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)](https://laravel.com)

Application web professionnelle de gestion de tâches, développée pour être évolutive vers une solution **SaaS multi-tenant**.

## ✨ Fonctionnalités (v2.0)

### Frontend
- ✅ **HTML/CSS/JavaScript** vanilla pur (zéro dépendance)
- 🎨 **Dark/Light Mode** automatique avec switch
- 📱 **PWA** - Installable et fonctionne offline
- 🚀 **Performance** - Chargement < 1s
- 🎯 **Responsive** - Tablette, mobile, desktop
- 💾 **Service Worker** - Cache intelligent

### Backend
- 🔐 **Authentification** JWT via Laravel Sanctum
- 📊 **API RESTful** complète et documentée
- 🛡️ **Sécurité** - CORS, validation, rate limiting
- 🗄️ **Base de données** SQLite (dev) / MySQL (prod)
- ⚡ **Optimisé** - Indexes, eager loading, caching ready

### Fonctionnalités Utilisateur
- ✅ Inscription / Connexion sécurisée
- ➕ Créer, modifier, supprimer des tâches
- ✔️ Marquer comme terminé/en cours
- 🔍 Filtrer (Toutes / En attente / Terminées)
- 📊 Statistiques en temps réel
- 🎨 Interface moderne et intuitive

## 📁 Structure du Projet

```
todo-api/
├── Backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/   # AuthController, TaskController
│   │   └── Models/            # User, Task
│   ├── database/
│   │   ├── migrations/        # Schema SQL
│   │   └── seeders/
│   ├── routes/api.php         # Endpoints API
│   └── .env                   # Configuration
│
├── Frontend/                   # Application Web
│   ├── index.html             # Login
│   ├── register.html          # Inscription
│   ├── dashboard.html         # Dashboard principal
│   ├── manifest.json          # PWA Manifest
│   ├── sw.js                  # Service Worker
│   └── assets/
│       ├── css/style.css      # Styles complets (variables CSS)
│       └── js/
│           ├── config.js      # Configuration API
│           ├── api.js         # Client HTTP
│           ├── utils.js       # Utilitaires (toast, thème)
│           ├── auth.js        # Logique login
│           ├── register.js    # Logique inscription
│           └── dashboard.js   # Gestion tâches
│
├── GUIDE.md                    # Guide démarrage rapide
├── SAAS-ROADMAP.md            # Plan transformation SaaS
├── ARCHITECTURE.md            # Documentation technique
└── README.md                  # Ce fichier
```

## 🚀 Installation

### Prérequis
- PHP >= 8.2
- Composer
- Python 3 (pour serveur HTTP frontend)
- Git

### 1. Cloner le repository
```bash
git clone https://github.com/dansenga/todo-api.git
cd todo-api
```

### 2. Configuration Backend
```bash
cd Backend

# Installer dépendances
composer install

# Configuration environnement
cp .env.example .env
php artisan key:generate

# Base de données
touch database/database.sqlite
php artisan migrate

# Démarrer serveur
php artisan serve --port=8001
```

✅ Backend disponible sur : `http://127.0.0.1:8001`

### 3. Configuration Frontend
```bash
cd ../Frontend

# Démarrer serveur HTTP (choisir une option)

# Option A - Python
python3 -m http.server 8080

# Option B - PHP
php -S localhost:8080

# Option C - VS Code Live Server
# Installer extension > Clic droit index.html > Open with Live Server
```

✅ Frontend disponible sur : `http://localhost:8080`

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [GUIDE.md](GUIDE.md) | Guide de démarrage rapide (5 min) |
| [SAAS-ROADMAP.md](SAAS-ROADMAP.md) | Plan transformation en SaaS multi-tenant |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture technique détaillée |
| [Frontend/README.md](Frontend/README.md) | Documentation frontend |

## 🎯 Endpoints API

### Authentification
```http
POST /api/register
POST /api/login
POST /api/logout
GET  /api/user
```

### Tâches (Auth required)
```http
GET    /api/tasks         # Liste toutes les tâches de l'utilisateur
POST   /api/tasks         # Créer une tâche
GET    /api/tasks/{id}    # Voir une tâche
PUT    /api/tasks/{id}    # Modifier une tâche
DELETE /api/tasks/{id}    # Supprimer une tâche
```

## 🔐 Sécurité

- ✅ **HTTPS** - SSL/TLS encryption
- ✅ **JWT Tokens** - Authentification sécurisée
- ✅ **CORS** - Protection cross-origin
- ✅ **Rate Limiting** - Anti brute-force
- ✅ **Input Validation** - Sanitization SQL/XSS
- ✅ **Password Hashing** - BCrypt
- ✅ **CSRF Protection** - Token validation

## ⚡ Performance

### Frontend
- 📦 **Taille** : ~50 KB (vs 250+ MB avec React)
- ⚡ **Chargement** : < 1 seconde
- 🚀 **PWA** : Fonctionne offline
- 💾 **Cache** : Service Worker intelligent

### Backend
- 🔍 **Indexes** : Requêtes optimisées
- 📊 **Eager Loading** : Évite N+1 queries
- 🗄️ **Ready Cache** : Redis/Memcached support
- ⚙️ **Queue Jobs** : Async processing ready

## 🌍 Roadmap SaaS

### Phase 1 ✅ (Actuelle)
- [x] Application fonctionnelle
- [x] Dark/Light mode
- [x] PWA
- [x] Documentation complète

### Phase 2 🔄 (3 mois)
- [ ] Priorités des tâches (High/Medium/Low)
- [ ] Catégories et tags
- [ ] Recherche avancée
- [ ] Export données (JSON, CSV)
- [ ] Statistiques graphiques

### Phase 3 📅 (6 mois)
- [ ] Multi-tenant architecture
- [ ] Plans d'abonnement (Free/Pro/Enterprise)
- [ ] Intégration Stripe/PayPal
- [ ] Système de facturation
- [ ] Support multi-utilisateurs par workspace

### Phase 4 🚀 (12 mois)
- [ ] API publique avec webhooks
- [ ] Intégrations (Slack, Zapier, etc.)
- [ ] Mobile app (React Native / Flutter)
- [ ] Analytics avancés
- [ ] White-label solution

## 💻 Stack Technique

### Frontend
- HTML5 / CSS3 (Variables CSS)
- JavaScript ES6+ (Vanilla)
- Service Worker (PWA)
- Fetch API
- LocalStorage

### Backend
- PHP 8.2
- Laravel 12
- Laravel Sanctum (Auth)
- SQLite (dev) / MySQL (prod)

### DevOps (Production Ready)
- Docker / Kubernetes
- Nginx / Apache
- Redis (cache)
- GitHub Actions (CI/CD)
- Cloudflare (CDN)

## 📊 Comparaison Versions

| Aspect | v1.0 (React) | v2.0 (Vanilla) |
|--------|--------------|----------------|
| Dépendances | 193 packages | 0 package |
| Taille | 250+ MB | 50 KB |
| Chargement | 3-5s | < 1s |
| Build | Obligatoire | Aucun |
| Déploiement | Complexe | Simple |
| Maintenance | Moyenne | Facile |
| Performance | Bonne | Excellente |

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Changelog

### v2.0.0 (2026-01-26)
- ✨ Refonte complète en HTML/CSS/JS vanilla
- 🎨 Ajout Dark/Light mode
- 📱 Transformation en PWA
- 📚 Documentation SaaS complète
- 🏗️ Architecture production-ready

### v1.0.0 (2026-01-19)
- 🎉 Version initiale avec React
- 🔐 Authentification Sanctum
- ✅ CRUD tâches basique

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Dan Senga**
- GitHub: [@dansenga](https://github.com/dansenga)
- Email: contact@example.com

## 🙏 Remerciements

- Laravel Team pour le framework
- Communauté open-source
- Professeurs et mentors

---

<div align="center">

**TaskFlow Pro** - De l'apprentissage au SaaS 🚀

[Documentation](GUIDE.md) · [Roadmap SaaS](SAAS-ROADMAP.md) · [Architecture](ARCHITECTURE.md)

Made with ❤️ for academic and professional purposes

</div>
