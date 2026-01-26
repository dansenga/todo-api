// Page Dashboard V2 - Avec catégories, priorités, recherche
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification
    if (!API.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Variables globales
    let tasks = [];
    let categories = [];
    let currentFilter = {
        status: 'all',
        category: null,
        priority: null,
        search: ''
    };

    // Éléments du DOM
    const userName = document.getElementById('userName');
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDescription = document.getElementById('taskDescription');
    const taskPriority = document.getElementById('taskPriority');
    const taskCategory = document.getElementById('taskCategory');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const sortBy = document.getElementById('sortBy');

    // Modales
    const categoryModalBtn = document.getElementById('categoryModalBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const categoryForm = document.getElementById('categoryForm');

    // Charger les données utilisateur
    async function loadUser() {
        try {
            const user = await API.getUser();
            userName.textContent = user.name;
        } catch (error) {
            console.error('Erreur de chargement utilisateur:', error);
        }
    }

    // Charger les catégories
    async function loadCategories() {
        try {
            categories = await API.getCategories();
            renderCategoryOptions();
            renderCategoryFilters();
        } catch (error) {
            console.error('Erreur de chargement des catégories:', error);
        }
    }

    // Rendre les options de catégorie dans le formulaire
    function renderCategoryOptions() {
        const options = categories.map(cat => 
            `<option value="${cat.id}">${cat.icon || '📁'} ${cat.name}</option>`
        ).join('');
        
        taskCategory.innerHTML = `<option value="">Aucune catégorie</option>${options}`;
        categoryFilter.innerHTML = `<option value="">Toutes</option>${options}`;
    }

    // Rendre les filtres de catégorie
    function renderCategoryFilters() {
        const filtersContainer = document.getElementById('categoryFilters');
        if (!filtersContainer) return;

        const html = categories.map(cat => `
            <button class="category-chip" data-category="${cat.id}" style="background-color: ${cat.color}22; border-color: ${cat.color}">
                <span>${cat.icon || '📁'}</span>
                <span>${cat.name}</span>
                <span class="category-count">${tasks.filter(t => t.category_id === cat.id).length}</span>
            </button>
        `).join('');
        
        filtersContainer.innerHTML = html;
        
        // Event listeners
        document.querySelectorAll('.category-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const catId = parseInt(btn.dataset.category);
                currentFilter.category = currentFilter.category === catId ? null : catId;
                loadTasks();
            });
        });
    }

    // Charger les tâches
    async function loadTasks() {
        try {
            const filters = {};
            
            if (currentFilter.status === 'pending') filters.completed = 'false';
            if (currentFilter.status === 'completed') filters.completed = 'true';
            if (currentFilter.category) filters.category_id = currentFilter.category;
            if (currentFilter.priority) filters.priority = currentFilter.priority;
            if (currentFilter.search) filters.search = currentFilter.search;
            if (sortBy && sortBy.value) {
                const [sort_by, sort_order] = sortBy.value.split('-');
                filters.sort_by = sort_by;
                filters.sort_order = sort_order;
            }

            const data = await API.getTasks(filters);
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

        const statElements = {
            totalTasks: total,
            pendingTasks: pending,
            completedTasks: completed,
            completionRate: `${percentage}%`
        };

        Object.entries(statElements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Badges des filtres
        const badges = {
            allCount: total,
            pendingCount: pending,
            completedCount: completed
        };

        Object.entries(badges).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    // Afficher les tâches
    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        taskList.innerHTML = tasks.map(task => {
            const category = task.category ? categories.find(c => c.id === task.category_id) : null;
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
            
            return `
                <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${task.id}">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                    
                    <div class="task-content">
                        <div class="task-header">
                            <div class="task-title">${escapeHtml(task.title)}</div>
                            <div class="task-badges">
                                ${getPriorityBadge(task.priority)}
                                ${category ? getCategoryBadge(category) : ''}
                            </div>
                        </div>
                        
                        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                        
                        <div class="task-meta">
                            <span class="task-date">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                ${Utils.formatDate(task.created_at)}
                            </span>
                            
                            ${task.due_date ? `
                                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    ${Utils.formatDate(task.due_date)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <button class="task-delete" onclick="deleteTask(${task.id})" title="Supprimer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Badges de priorité
    function getPriorityBadge(priority) {
        const badges = {
            high: '<span class="priority-badge high">🔴 Élevée</span>',
            medium: '<span class="priority-badge medium">🟡 Moyenne</span>',
            low: '<span class="priority-badge low">🟢 Basse</span>'
        };
        return badges[priority] || '';
    }

    // Badges de catégorie
    function getCategoryBadge(category) {
        return `<span class="category-badge" style="background-color: ${category.color}22; color: ${category.color}; border-color: ${category.color}">
            ${category.icon || '📁'} ${category.name}
        </span>`;
    }

    // Échapper le HTML
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

        const taskData = {
            title,
            description: taskDescription.value.trim() || null,
            priority: taskPriority.value || 'medium',
            category_id: taskCategory.value ? parseInt(taskCategory.value) : null,
            due_date: taskDueDate.value || null,
            completed: false
        };

        try {
            const newTask = await API.createTask(taskData);
            tasks.push(newTask.data || newTask);
            
            // Réinitialiser le formulaire
            taskForm.reset();
            taskPriority.value = 'medium';
            
            loadTasks();
            
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
                completed: !task.completed
            });
            
            loadTasks();
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
            loadTasks();
            
            Utils.showToast('Tâche supprimée', 'success');
        } catch (error) {
            console.error('Erreur de suppression:', error);
            Utils.showToast('Erreur lors de la suppression', 'error');
        }
    };

    // Gestion des filtres de statut
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter.status = tab.dataset.filter;
            
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            loadTasks();
        });
    });

    // Recherche
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilter.search = e.target.value.trim();
                loadTasks();
            }, 300);
        });
    }

    // Filtre de priorité
    if (priorityFilter) {
        priorityFilter.addEventListener('change', (e) => {
            currentFilter.priority = e.target.value || null;
            loadTasks();
        });
    }

    // Tri
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            loadTasks();
        });
    }

    // Modal catégorie
    if (categoryModalBtn) {
        categoryModalBtn.addEventListener('click', () => {
            categoryModal.classList.add('show');
        });
    }

    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', () => {
            categoryModal.classList.remove('show');
        });
    }

    if (categoryModal) {
        categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                categoryModal.classList.remove('show');
            }
        });
    }

    // Ajouter une catégorie
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const categoryData = {
                name: document.getElementById('categoryName').value.trim(),
                color: document.getElementById('categoryColor').value,
                icon: document.getElementById('categoryIcon').value.trim() || null
            };

            try {
                await API.createCategory(categoryData);
                await loadCategories();
                categoryForm.reset();
                categoryModal.classList.remove('show');
                
                Utils.showToast('Catégorie créée', 'success');
            } catch (error) {
                console.error('Erreur création catégorie:', error);
                Utils.showToast('Erreur lors de la création', 'error');
            }
        });
    }

    // Menu utilisateur
    if (userButton) {
        userButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
            userButton.classList.toggle('active');
        });
    }

    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('show');
        if (userButton) userButton.classList.remove('active');
    });

    // Déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await API.logout();
        });
    }

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
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            Utils.toggleTheme();
            updateThemeIcon();
        });
        updateThemeIcon();
    }

    // Initialisation
    loadUser();
    loadCategories();
    loadTasks();
});
