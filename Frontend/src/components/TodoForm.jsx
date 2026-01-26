import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { validateTask } from '../utils/validation';
import clsx from 'clsx';

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateTask(title);
    if (!isValid) {
      setError(errors.title);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ title: title.trim() });
      setTitle('');
    } catch (err) {
      // Errors handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ajouter une nouvelle tâche..."
            disabled={loading}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
            )}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className={clsx(
            'px-5 py-3 rounded-xl font-medium transition-all duration-200',
            'flex items-center gap-2',
            'bg-indigo-600 text-white hover:bg-indigo-700',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 pl-1">{error}</p>
      )}
    </form>
  );
};

export default TodoForm;
