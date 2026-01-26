import { useState } from 'react';
import { Check, Trash2, Circle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={clsx(
        'group flex items-center gap-4 p-4 bg-white rounded-xl border transition-all duration-200',
        task.completed
          ? 'border-gray-100 bg-gray-50'
          : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          task.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-gray-300 hover:border-indigo-500 group-hover:border-indigo-400'
        )}
      >
        {isToggling ? (
          <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
        ) : task.completed ? (
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        ) : (
          <Circle className="w-3 h-3 text-transparent group-hover:text-indigo-200" />
        )}
      </button>

      {/* Title */}
      <span
        className={clsx(
          'flex-1 text-base transition-all duration-200',
          task.completed
            ? 'text-gray-400 line-through'
            : 'text-gray-700'
        )}
      >
        {task.title}
      </span>

      {/* Date */}
      <span className="hidden sm:block text-xs text-gray-400">
        {new Date(task.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        })}
      </span>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={clsx(
          'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
          'text-gray-400 hover:text-red-500 hover:bg-red-50',
          'opacity-0 group-hover:opacity-100 focus:opacity-100'
        )}
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default TaskItem;
