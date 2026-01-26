// Page de connexion
document.addEventListener('DOMContentLoaded', () => {
    // Rediriger si déjà connecté
    if (API.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Nettoyer les erreurs précédentes
        Utils.clearErrors();

        // Récupérer les données du formulaire
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation côté client
        let hasError = false;

        if (!email) {
            Utils.showFieldError('email', 'L\'email est requis');
            hasError = true;
        } else if (!Utils.isValidEmail(email)) {
            Utils.showFieldError('email', 'Email invalide');
            hasError = true;
        }

        if (!password) {
            Utils.showFieldError('password', 'Le mot de passe est requis');
            hasError = true;
        } else if (password.length < 8) {
            Utils.showFieldError('password', 'Le mot de passe doit contenir au moins 8 caractères');
            hasError = true;
        }

        if (hasError) return;

        // Afficher le loader
        Utils.toggleButtonLoading(submitBtn, true);

        try {
            // Appel API
            await API.login({ email, password });

            // Succès
            Utils.showToast('Connexion réussie !', 'success');
            
            // Redirection
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);

        } catch (error) {
            Utils.toggleButtonLoading(submitBtn, false);

            // Gestion des erreurs de validation
            if (error.status === 422 && error.errors) {
                Object.keys(error.errors).forEach(field => {
                    Utils.showFieldError(field, error.errors[field][0]);
                });
                Utils.showToast(error.message, 'error');
            } else {
                Utils.showToast(error.message || 'Erreur de connexion', 'error');
            }
        }
    });
});
