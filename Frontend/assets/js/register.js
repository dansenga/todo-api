// Page d'inscription
document.addEventListener('DOMContentLoaded', () => {
    // Rediriger si déjà connecté
    if (API.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Nettoyer les erreurs précédentes
        Utils.clearErrors();

        // Récupérer les données du formulaire
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirmation = document.getElementById('password_confirmation').value;

        // Validation côté client
        let hasError = false;

        if (!name) {
            Utils.showFieldError('name', 'Le nom est requis');
            hasError = true;
        } else if (name.length < 2) {
            Utils.showFieldError('name', 'Le nom doit contenir au moins 2 caractères');
            hasError = true;
        }

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

        if (!passwordConfirmation) {
            Utils.showFieldError('passwordConfirmation', 'La confirmation est requise');
            hasError = true;
        } else if (password !== passwordConfirmation) {
            Utils.showFieldError('passwordConfirmation', 'Les mots de passe ne correspondent pas');
            hasError = true;
        }

        if (hasError) return;

        // Afficher le loader
        Utils.toggleButtonLoading(submitBtn, true);

        try {
            // Appel API
            await API.register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            // Succès
            Utils.showToast('Compte créé avec succès !', 'success');
            
            // Redirection
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);

        } catch (error) {
            Utils.toggleButtonLoading(submitBtn, false);

            // Gestion des erreurs de validation
            if (error.status === 422 && error.errors) {
                Object.keys(error.errors).forEach(field => {
                    const fieldName = field === 'password_confirmation' ? 'passwordConfirmation' : field;
                    Utils.showFieldError(fieldName, error.errors[field][0]);
                });
                Utils.showToast(error.message, 'error');
            } else {
                Utils.showToast(error.message || 'Erreur lors de l\'inscription', 'error');
            }
        }
    });
});
