<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 1. Lister toutes les tâches de l'utilisateur connecté
    public function index(Request $request)
    {
        $query = $request->user()->tasks()->with('category');

        // Filtrer par catégorie
        if ($request->has('category_id')) {
            if ($request->category_id === 'null') {
                $query->whereNull('category_id');
            } else {
                $query->where('category_id', $request->category_id);
            }
        }

        // Filtrer par priorité
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filtrer par statut de complétion
        if ($request->has('completed')) {
            $query->where('completed', $request->completed === 'true');
        }

        // Recherche par titre ou description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['created_at', 'title', 'priority', 'due_date'])) {
            if ($sortBy === 'priority') {
                // Tri personnalisé pour priorité: high > medium > low
                $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low')");
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        $tasks = $query->get();
        
        return response()->json($tasks);
    }

    // 2. Créer une tâche
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date'
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'category_id' => $request->category_id,
            'due_date' => $request->due_date,
            'completed' => false
        ]);

        $task->load('category');

        return response()->json($task, 201);
    }

    // 3. Voir une tâche
    public function show(Request $request, Task $task)
    {
        // Vérifier que la tâche appartient à l'utilisateur
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($task);
    }

    // 4. Modifier une tâche
    public function update(Request $request, Task $task)
    {
        // Vérifier que la tâche appartient à l'utilisateur
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
            'priority' => 'nullable|in:low,medium,high',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date'
        ]);

        $task->update($request->only('title', 'description', 'completed', 'priority', 'category_id', 'due_date'));

        $task->load('category');

        return response()->json($task);
    }

    // 5. Supprimer une tâche
    public function destroy(Request $request, Task $task)
    {
        // Vérifier que la tâche appartient à l'utilisateur
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $task->delete();

        return response()->json(null, 204);
    }
}
