import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    await api.post("/tasks", { title });
    setTitle("");
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <h2>Mes tâches</h2>

      <input
        value={title}
        placeholder="Nouvelle tâche"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Ajouter</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </>
  );
}
