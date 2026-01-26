// Gestion des appels API
const API = {
    // Récupérer le token
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    // Sauvegarder le token
    setToken(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    },

    // Supprimer le token
    removeToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    },

    // Récupérer les headers avec authentification
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    },

    // Requête HTTP générique
    async request(endpoint, options = {}) {
        try {
            const url = `${CONFIG.API_URL}${endpoint}`;
            const config = {
                ...options,
                headers: this.getHeaders(options.auth !== false)
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Gestion des erreurs de validation
                if (response.status === 422 && data.errors) {
                    throw { 
                        status: 422, 
                        errors: data.errors,
                        message: data.message || 'Erreur de validation'
                    };
                }

                // Erreur d'authentification
                if (response.status === 401) {
                    this.removeToken();
                    window.location.href = 'index.html';
                    throw new Error('Session expirée');
                }

                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Méthodes HTTP
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Authentification
    async register(userData) {
        const data = await this.post('/register', userData);
        this.setToken(data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return data;
    },

    async login(credentials) {
        const data = await this.post('/login', credentials);
        this.setToken(data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return data;
    },

    async logout() {
        try {
            await this.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            window.location.href = 'index.html';
        }
    },

    async getUser() {
        return this.get('/user');
    },

    // Tâches
    async getTasks() {
        return this.get('/tasks');
    },

    async createTask(title) {
        return this.post('/tasks', { title, completed: false });
    },

    async updateTask(id, data) {
        return this.put(`/tasks/${id}`, data);
    },

    async deleteTask(id) {
        return this.delete(`/tasks/${id}`);
    },

    // Vérifier si l'utilisateur est authentifié
    isAuthenticated() {
        return !!this.getToken();
    }
};
