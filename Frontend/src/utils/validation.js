import { handleApiError } from './errorHandler';

/**
 * Validate task data
 */
export const validateTask = (title, description = '') => {
    const errors = {};

    if (!title || title.trim().length === 0) {
        errors.title = 'Le titre est requis';
    } else if (title.length > 255) {
        errors.title = 'Le titre ne peut dépasser 255 caractères';
    }

    if (description && description.length > 5000) {
        errors.description = 'La description ne peut dépasser 5000 caractères';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate registration data
 */
export const validateRegister = (name, email, password, passwordConfirmation) => {
    const errors = {};

    if (!name || name.trim().length === 0) {
        errors.name = 'Le nom est requis';
    } else if (name.length > 255) {
        errors.name = 'Le nom ne peut dépasser 255 caractères';
    }

    if (!email || email.trim().length === 0) {
        errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'L\'email n\'est pas valide';
    }

    if (!password) {
        errors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Les mots de passe ne correspondent pas';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate login data
 */
export const validateLogin = (email, password) => {
    const errors = {};

    if (!email || email.trim().length === 0) {
        errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'L\'email n\'est pas valide';
    }

    if (!password) {
        errors.password = 'Le mot de passe est requis';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate category data
 */
export const validateCategory = (name, color) => {
    const errors = {};

    if (!name || name.trim().length === 0) {
        errors.name = 'Le nom est requis';
    } else if (name.length > 100) {
        errors.name = 'Le nom ne peut dépasser 100 caractères';
    }

    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        errors.color = 'La couleur doit être au format hexadécimal (ex: #FF5733)';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate due date
 */
export const validateDueDate = (dueDate) => {
    if (!dueDate) return { isValid: true, errors: {} };

    const errors = {};
    const date = new Date(dueDate);

    if (isNaN(date.getTime())) {
        errors.dueDate = 'Date invalide';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
