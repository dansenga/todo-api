/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error) => {
    // Network error
    if (!error.response) {
        return {
            message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.',
            status: null
        };
    }

    const { status, data } = error.response;

    // Handle different HTTP status codes
    switch (status) {
        case 400:
            return {
                message: data.message || 'Requête invalide.',
                status: 400,
                errors: data.errors || {}
            };

        case 401:
            return {
                message: 'Session expirée. Veuillez vous reconnecter.',
                status: 401
            };

        case 403:
            return {
                message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
                status: 403
            };

        case 404:
            return {
                message: 'Ressource introuvable.',
                status: 404
            };

        case 422:
            return {
                message: data.message || 'Les données fournies sont invalides.',
                status: 422,
                errors: data.errors || {}
            };

        case 429:
            return {
                message: 'Trop de requêtes. Veuillez patienter quelques instants.',
                status: 429
            };

        case 500:
            return {
                message: 'Erreur serveur. Veuillez réessayer plus tard.',
                status: 500
            };

        case 503:
            return {
                message: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
                status: 503
            };

        default:
            return {
                message: data.message || 'Une erreur inattendue est survenue.',
                status
            };
    }
};

/**
 * Format validation errors from Laravel
 */
export const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
        return {};
    }

    const formatted = {};

    Object.keys(errors).forEach(key => {
        // Laravel returns arrays of error messages
        formatted[key] = Array.isArray(errors[key])
            ? errors[key][0]
            : errors[key];
    });

    return formatted;
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error) => {
    return error?.response?.status === 401;
};

/**
 * Check if error is validation related
 */
export const isValidationError = (error) => {
    return error?.response?.status === 422;
};

/**
 * Get error message for display in toast
 */
export const getErrorMessage = (error) => {
    const errorInfo = handleApiError(error);
    return errorInfo.message;
};
