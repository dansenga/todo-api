import { useState } from 'react';
import { validateTask } from '../utils/validation';

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const { isValid, errors: validationErrors } = validateTask(title);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onSubmit({ title });
      setTitle('');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Les erreurs sont gérées par le toast via l'intercepteur
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-field">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // Clear error on change
            if (errors.title) {
              setErrors({});
            }
          }}
          placeholder="Entrez le titre de la tâche..."
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Ajout...' : 'Ajouter'}
      </button>
    </form>
  );
};

export default TodoForm;
