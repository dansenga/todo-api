// Service Worker pour mode offline et cache
const CACHE_NAME = 'taskflow-v2.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/register.html',
    '/dashboard.html',
    '/assets/css/style.css',
    '/assets/js/config.js',
    '/assets/js/utils.js',
    '/assets/js/api.js',
    '/assets/js/auth.js',
    '/assets/js/register.js',
    '/assets/js/dashboard.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Stratégie de cache : Network First, Cache Fallback
self.addEventListener('fetch', event => {
    // Ignore les requêtes API (toujours en ligne)
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone la réponse car elle ne peut être consommée qu'une fois
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                
                return response;
            })
            .catch(() => {
                // En cas d'échec réseau, chercher dans le cache
                return caches.match(event.request);
            })
    );
});
