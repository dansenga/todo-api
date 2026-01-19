import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import TodoForm from '../components/TodoForm';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la tâche');
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await api.put(`/tasks/${taskId}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="dashboard-main">
        <section className="add-task-section">
          <h2>Ajouter une tâche</h2>
          <TodoForm onSubmit={handleAddTask} />
        </section>

        <section className="tasks-section">
          <h2>Mes tâches</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">Aucune tâche pour le moment</p>
          ) : (
            <ul className="tasks-list">
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                  />
                  <span className="task-title">{task.title}</span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-btn"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
