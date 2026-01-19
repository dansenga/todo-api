import { useState } from 'react';

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setLoading(true);
    
    try {
      await onSubmit({ title });
      setTitle('');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entrez le titre de la tâche..."
        required
      />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Ajout...' : 'Ajouter'}
      </button>
    </form>
  );
};

export default TodoForm;
