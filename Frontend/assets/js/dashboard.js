// Page Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification
    if (!API.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Variables globales
    let tasks = [];
    let currentFilter = 'all';

    // Éléments du DOM
    const userName = document.getElementById('userName');
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // Charger les données utilisateur
    async function loadUser() {
        try {
            const user = await API.getUser();
            userName.textContent = user.name;
        } catch (error) {
            console.error('Erreur de chargement utilisateur:', error);
        }
    }

    // Charger les tâches
    async function loadTasks() {
        try {
            const data = await API.getTasks();
            tasks = data.data || data || [];
            renderTasks();
            updateStats();
        } catch (error) {
            console.error('Erreur de chargement des tâches:', error);
            Utils.showToast('Erreur de chargement des tâches', 'error');
        }
    }

    // Calculer les statistiques
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = `${percentage}%`;

        // Mettre à jour les badges des filtres
        document.getElementById('allCount').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
    }

    // Filtrer les tâches
    function getFilteredTasks() {
        switch (currentFilter) {
            case 'pending':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }

    // Afficher les tâches
    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-date">${Utils.formatDate(task.created_at)}</div>
                </div>
                <button class="task-delete" onclick="deleteTask(${task.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Échapper le HTML pour éviter les injections XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Ajouter une tâche
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = taskInput.value.trim();
        if (!title) return;

        try {
            const newTask = await API.createTask(title);
            tasks.push(newTask.data || newTask);
            
            taskInput.value = '';
            renderTasks();
            updateStats();
            
            Utils.showToast('Tâche ajoutée avec succès', 'success');
        } catch (error) {
            console.error('Erreur d\'ajout:', error);
            Utils.showToast('Erreur lors de l\'ajout de la tâche', 'error');
        }
    });

    // Basculer le statut d'une tâche
    window.toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        try {
            const updatedTask = await API.updateTask(id, {
                title: task.title,
                completed: !task.completed
            });
            
            const index = tasks.findIndex(t => t.id === id);
            tasks[index] = updatedTask.data || updatedTask;
            
            renderTasks();
            updateStats();
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            Utils.showToast('Erreur lors de la mise à jour', 'error');
        }
    };

    // Supprimer une tâche
    window.deleteTask = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

        try {
            await API.deleteTask(id);
            tasks = tasks.filter(t => t.id !== id);
            
            renderTasks();
            updateStats();
            
            Utils.showToast('Tâche supprimée', 'success');
        } catch (error) {
            console.error('Erreur de suppression:', error);
            Utils.showToast('Erreur lors de la suppression', 'error');
        }
    };

    // Gestion des filtres
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter = tab.dataset.filter;
            
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            renderTasks();
        });
    });

    // Menu utilisateur
    userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
        userButton.classList.toggle('active');
    });

    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
        userButton.classList.remove('active');
    });

    // Déconnexion
    logoutBtn.addEventListener('click', async () => {
        await API.logout();
    });

    // Toggle theme
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    function updateThemeIcon() {
        const theme = Utils.getCurrentTheme();
        if (theme === 'dark') {
            themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }
    
    themeToggle.addEventListener('click', () => {
        Utils.toggleTheme();
        updateThemeIcon();
    });
    
    updateThemeIcon();

    // Initialisation
    loadUser();
    loadTasks();
});
