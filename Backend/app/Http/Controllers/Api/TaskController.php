<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 1. Lister toutes les tâches
    public function index()
    {
        return response()->json(Task::all());
    }
    // 2. Créer une tâche
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string'
        ]);

        $task = Task::create([
            'title' => $request->title
        ]);

        return response()->json($task, 201);
    }
    // 3. Voir une tâche
    public function show(Task $task)
    {
        return response()->json($task);
    }
    // 4. Modifier une tâche
    public function update(Request $request, Task $task)
    {
        $task->update($request->only('title', 'completed'));

        return response()->json($task);
    }
    // 5. Supprimer une tâche
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }
}
