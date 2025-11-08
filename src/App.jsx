import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Lưu tasks vào LocalStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now(), text: newTask, done: false };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleDone = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );

  const startEdit = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📝 My Todo App
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập công việc..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thêm
        </button>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white shadow rounded-lg flex justify-between items-center px-4 py-2"
          >
            {editingTaskId === task.id ? (
              <input
                type="text"
                className="border rounded px-2 py-1 flex-grow mr-2"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && saveEdit(task.id)
                }
              />
            ) : (
              <span
                onClick={() => toggleDone(task.id)}
                className={`flex-grow cursor-pointer ${
                  task.done
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.text}
              </span>
            )}

            <div className="flex gap-2">
              {editingTaskId === task.id ? (
                <button
                  onClick={() => saveEdit(task.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  💾
                </button>
              ) : (
                <button
                  onClick={() => startEdit(task.id, task.text)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
