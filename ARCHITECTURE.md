# 🏗️ Architecture Technique - TaskFlow Pro

## 📐 Architecture Actuelle (v2.0)

```
┌─────────────────────────────────────────────┐
│           FRONTEND (Port 8080)              │
│  ┌──────────────────────────────────────┐  │
│  │  HTML/CSS/JavaScript Vanilla         │  │
│  │  • PWA avec Service Worker           │  │
│  │  • Dark/Light Mode                   │  │
│  │  • LocalStorage pour cache           │  │
│  │  • Fetch API pour HTTP               │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓ HTTPS/API
┌─────────────────────────────────────────────┐
│           BACKEND (Port 8001)               │
│  ┌──────────────────────────────────────┐  │
│  │  Laravel 12 API                      │  │
│  │  • Sanctum Authentication            │  │
│  │  • RESTful Endpoints                 │  │
│  │  • CORS Middleware                   │  │
│  │  • Validation & Security             │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         DATABASE (SQLite/MySQL)             │
│  • users (auth)                             │
│  • tasks (data)                             │
│  • personal_access_tokens (sessions)        │
└─────────────────────────────────────────────┘
```

## 🎯 Architecture Production Recommandée

```
┌──────────────────────────────────────────────────────────┐
│                   CLOUDFLARE CDN                         │
│  • SSL/TLS Encryption                                    │
│  • DDoS Protection                                       │
│  • Cache statique (images, CSS, JS)                     │
│  • DNS Management                                        │
└──────────────────────────────────────────────────────────┘
                    ↓ HTTPS
┌──────────────────────────────────────────────────────────┐
│              LOAD BALANCER (Nginx/HAProxy)               │
│  • Round Robin ou Least Connections                      │
│  • Health Checks                                         │
│  • SSL Termination                                       │
└──────────────────────────────────────────────────────────┘
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
┌─────────┐   ┌─────────┐   ┌─────────┐
│ APP 1   │   │ APP 2   │   │ APP 3   │
│ Laravel │   │ Laravel │   │ Laravel │
│ + Nginx │   │ + Nginx │   │ + Nginx │
└─────────┘   └─────────┘   └─────────┘
    │               │               │
    └───────────────┼───────────────┘
                    ↓
┌──────────────────────────────────────────────────────────┐
│                    REDIS CLUSTER                         │
│  • Session Storage                                       │
│  • Cache Layer                                           │
│  • Queue Jobs                                            │
└──────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────┐
│              MYSQL CLUSTER (Master-Slave)                │
│  ┌─────────────┐  ←────┐                                │
│  │   MASTER    │        │  Replication                   │
│  │  (Write)    │        │                                │
│  └─────────────┘        │                                │
│         ↓               │                                │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │   SLAVE 1   │  │   SLAVE 2   │                       │
│  │   (Read)    │  │   (Read)    │                       │
│  └─────────────┘  └─────────────┘                       │
└──────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────┐
│               STORAGE & BACKUPS                          │
│  • S3 / Digital Ocean Spaces                            │
│  • Automated Daily Backups                              │
│  • Point-in-time Recovery                               │
└──────────────────────────────────────────────────────────┘
```

## 📊 Structure de Base de Données

### Tables Actuelles
```sql
-- Users (Auth)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tasks (Core)
CREATE TABLE tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed)
);

-- Personal Access Tokens (Sanctum)
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
);
```

### Tables SaaS (À ajouter)
```sql
-- Tenants (Multi-tenant)
CREATE TABLE tenants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    database VARCHAR(100) NULL,
    settings JSON,
    trial_ends_at TIMESTAMP NULL,
    subscribed_at TIMESTAMP NULL,
    plan VARCHAR(50) DEFAULT 'free',
    max_users INT DEFAULT 1,
    max_tasks INT DEFAULT 50,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_subdomain (subdomain),
    INDEX idx_plan (plan)
);

-- Subscriptions (Billing)
CREATE TABLE subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    stripe_id VARCHAR(255) UNIQUE,
    stripe_status VARCHAR(255),
    stripe_price VARCHAR(255),
    quantity INT DEFAULT 1,
    trial_ends_at TIMESTAMP NULL,
    ends_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Invoices (Facturation)
CREATE TABLE invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    subscription_id BIGINT UNSIGNED,
    stripe_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'pending',
    invoice_pdf_url TEXT,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Audit Logs (Sécurité & Compliance)
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(255),
    model_id BIGINT UNSIGNED,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP,
    INDEX idx_tenant (tenant_id),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);
```

## 🔐 Sécurité

### 1. HTTPS/SSL
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name app.taskflow.com;
    
    ssl_certificate /etc/letsencrypt/live/app.taskflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.taskflow.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
}
```

### 2. Rate Limiting
```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

// config/sanctum.php
'middleware' => [
    'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
],

// RouteServiceProvider.php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

### 3. Input Validation & Sanitization
```php
// app/Http/Requests/StoreTaskRequest.php
public function rules() {
    return [
        'title' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s\-_àéèêôûç]+$/u'],
        'completed' => ['boolean'],
        'priority' => ['in:low,medium,high'],
        'category_id' => ['exists:categories,id'],
    ];
}

protected function prepareForValidation() {
    $this->merge([
        'title' => strip_tags($this->title),
    ]);
}
```

### 4. SQL Injection Prevention
```php
// ✅ GOOD - Utiliser Eloquent ORM
Task::where('user_id', $userId)->get();

// ✅ GOOD - Prepared Statements
DB::select('SELECT * FROM tasks WHERE user_id = ?', [$userId]);

// ❌ BAD - Jamais de concatenation
DB::select("SELECT * FROM tasks WHERE user_id = {$userId}");
```

### 5. XSS Prevention
```javascript
// Frontend - Toujours échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Usage
taskList.innerHTML = tasks.map(task => `
    <div class="task-title">${escapeHtml(task.title)}</div>
`).join('');
```

## ⚡ Performance

### 1. Database Indexing
```sql
-- Indexes critiques
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### 2. Query Optimization
```php
// ✅ GOOD - Eager Loading
$users = User::with('tasks')->get();

// ❌ BAD - N+1 Problem
$users = User::all();
foreach ($users as $user) {
    $tasks = $user->tasks; // Nouvelle query à chaque fois!
}
```

### 3. Caching Strategy
```php
// Cache Level 1 - Application
$tasks = Cache::remember("user.{$userId}.tasks", 3600, function () use ($userId) {
    return Task::where('user_id', $userId)->get();
});

// Cache Level 2 - Redis
Cache::store('redis')->remember($key, $ttl, $callback);

// Cache Level 3 - CDN (Cloudflare)
// Automatique pour fichiers statiques
```

### 4. Asset Optimization
```bash
# CSS Minification
npx cssnano assets/css/style.css assets/css/style.min.css

# JavaScript Minification
npx terser assets/js/*.js --compress --mangle -o assets/js/bundle.min.js

# Image Optimization
optipng assets/icons/*.png
jpegoptim assets/images/*.jpg
```

## 📈 Monitoring & Logging

### Application Monitoring
```php
// config/logging.php
'channels' => [
    'production' => [
        'driver' => 'stack',
        'channels' => ['daily', 'sentry'],
        'ignore_exceptions' => false,
    ],
    
    'sentry' => [
        'driver' => 'sentry',
        'level' => 'error',
    ],
];
```

### Server Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
      
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
      
  node_exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
```

## 🚀 Deployment

### Option A : Laravel Forge (Recommandé pour démarrer)
```bash
# 1. Créer compte sur Laravel Forge
# 2. Connecter serveur (DigitalOcean, AWS, Linode)
# 3. Configurer site
# 4. Connecter repository GitHub
# 5. Deploy automatique sur push
```

### Option B : Docker
```dockerfile
# Dockerfile
FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --optimize-autoloader --no-dev

CMD php artisan serve --host=0.0.0.0 --port=8000
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8001:8000"
    environment:
      - DB_HOST=mysql
    depends_on:
      - mysql
      - redis
      
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: taskflow
      
  redis:
    image: redis:alpine
```

### Option C : Kubernetes (Scale)
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taskflow-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskflow-api
  template:
    metadata:
      labels:
        app: taskflow-api
    spec:
      containers:
      - name: api
        image: taskflow/api:latest
        ports:
        - containerPort: 8000
```

## 📊 Métriques Clés

### Performance
- **Response Time** : < 200ms (p95)
- **Throughput** : 1000 req/s minimum
- **Error Rate** : < 0.1%
- **Uptime** : 99.9%

### Database
- **Query Time** : < 50ms
- **Connection Pool** : 20-50 connections
- **Cache Hit Rate** : > 80%

### Infrastructure
- **CPU Usage** : < 70%
- **Memory Usage** : < 80%
- **Disk Usage** : < 85%
- **Network Latency** : < 100ms

---

**Version** : 2.0.0  
**Dernière mise à jour** : Janvier 2026
