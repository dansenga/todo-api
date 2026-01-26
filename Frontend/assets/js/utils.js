// Utilitaires généraux
const Utils = {
    // Gestion du thème
    initTheme() {
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(CONFIG.THEME_KEY, theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    },

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },

    // Afficher un toast
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.TOAST_DURATION);
    },

    // Formatter une date
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return minutes === 0 ? "À l'instant" : `Il y a ${minutes} min`;
            }
            return `Il y a ${hours}h`;
        }
        
        if (days === 1) return 'Hier';
        if (days < 7) return `Il y a ${days} jours`;
        
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    },

    // Validation d'email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Afficher/Cacher le loader du bouton
    toggleButtonLoading(button, loading) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        
        if (loading) {
            text.style.display = 'none';
            loader.style.display = 'flex';
            button.disabled = true;
        } else {
            text.style.display = 'block';
            loader.style.display = 'none';
            button.disabled = false;
        }
    },

    // Afficher les erreurs de validation
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    },

    // Nettoyer les erreurs
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
    }
};
