import { useState, useEffect, useMemo } from 'react';
import { 
  ListTodo, 
  CheckCircle2, 
  Circle,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '../components/layout';
import { Card, Spinner } from '../components/ui';
import TodoForm from '../components/TodoForm';
import TaskItem from '../components/TaskItem';
import api from '../api/axios';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      toast.error(err.userMessage || 'Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    setTasks(prev => [response.data, ...prev]);
    toast.success('Tâche ajoutée avec succès !');
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const response = await api.put(`/tasks/${taskId}`, {
      completed: !task.completed
    });
    setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
    toast.success(response.data.completed ? 'Tâche complétée !' : 'Tâche réactivée');
  };

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success('Tâche supprimée');
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'pending':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Gérez vos tâches efficacement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <ListTodo className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total des tâches</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Circle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-500">En cours</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-500">Terminées</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
            <p className="text-sm text-gray-500">Progression</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Task Card */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <Card.Title>Nouvelle tâche</Card.Title>
            <Card.Description>
              Ajoutez une tâche à votre liste
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <TodoForm onSubmit={handleAddTask} />
          </Card.Content>
        </Card>

        {/* Tasks List */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mes tâches</h3>
                <p className="text-sm text-gray-500">
                  {filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'Toutes' },
                  { key: 'pending', label: 'En cours' },
                  { key: 'completed', label: 'Terminées' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={clsx(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                      filter === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-gray-900 font-medium mb-1">
                  {filter === 'all' 
                    ? 'Aucune tâche pour le moment'
                    : filter === 'pending'
                    ? 'Aucune tâche en cours'
                    : 'Aucune tâche terminée'}
                </h4>
                <p className="text-sm text-gray-500">
                  {filter === 'all' && 'Commencez par ajouter votre première tâche'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
