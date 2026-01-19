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
        $tasks = $request->user()->tasks()->orderBy('created_at', 'desc')->get();
        return response()->json($tasks);
    }

    // 2. Créer une tâche
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'completed' => false
        ]);

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
            'completed' => 'sometimes|boolean'
        ]);

        $task->update($request->only('title', 'completed'));

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
