import { useState, useEffect } from "react";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

const fetchTodos = async () => {
  const response = await fetch("https://dummyjson.com/todos");
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
};

const addTodoToAPI = async (todo: string) => {
  const response = await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo, completed: false, userId: 1 }),
  });
  if (!response.ok) throw new Error("Failed to add todo");
  return response.json();
};

const updateTodoInAPI = async (id: number, completed: boolean) => {
  await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
};

const deleteTodoFromAPI = async (id: number) => {
  await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "DELETE",
  });
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchTodos()
      .then((data) => setTodos(data.todos))
      .catch(() => setError("Failed to fetch todos."))
      .finally(() => setIsLoading(false));
  }, []);

  const addTodo = async () => {
    const todoText = prompt("Enter a new todo:");
    if (!todoText) return;
    setIsLoading(true);
    try {
      const newTodo = await addTodoToAPI(todoText);
      setTodos((prev) => [newTodo, ...prev]);
    } catch {
      setError("Failed to add todo.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
    );
    updateTodoInAPI(id, !completed);
  };

  const editTodo = async (id: number, text: string) => {
    const updatedText = prompt("Edit todo:", text);
    if (!updatedText) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, todo: updatedText } : todo))
    );
  };

  const removeTodo = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    setIsLoading(true);
    try {
      await deleteTodoFromAPI(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setError("Failed to delete todo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Todos</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-4 flex justify-center">
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Todo"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ))
          : todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded shadow flex justify-between items-center ${todo.completed ? "bg-green-200" : "bg-white"}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="mr-2"
                  />
                  <span className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
                    {todo.todo}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => editTodo(todo.id, todo.todo)} className="text-yellow-500">✎</button>
                  <button onClick={() => removeTodo(todo.id)} className="text-red-500">✖</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Todos;
