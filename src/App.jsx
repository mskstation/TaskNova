import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [dailyGoal, setDailyGoal] = useState(() => {
    return Number(localStorage.getItem("dailyGoal")) || 5;
  });

  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem("xp")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("dailyGoal", dailyGoal);
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  function addTodo() {
    if (!todo.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todo.trim(),
      completed: false,
      priority: "medium",
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    setTodos((oldTodos) => [...oldTodos, newTodo]);
    setTodo("");
  }

  function toggleTodo(id) {
    setTodos((oldTodos) =>
      oldTodos.map((item) => {
        if (item.id === id) {
          if (!item.completed) {
            setXp((oldXp) => oldXp + 10);
          } else {
            setXp((oldXp) => Math.max(0, oldXp - 10));
          }

          return {
            ...item,
            completed: !item.completed,
          };
        }

        return item;
      })
    );
  }

  function deleteTodo(id) {
    setTodos((oldTodos) =>
      oldTodos.filter((item) => item.id !== id)
    );
  }

  function changePriority(id, priority) {
    setTodos((oldTodos) =>
      oldTodos.map((item) =>
        item.id === id
          ? { ...item, priority }
          : item
      )
    );
  }

  function clearCompleted() {
    setTodos((oldTodos) =>
      oldTodos.filter((item) => !item.completed)
    );
  }

  const completedCount = todos.filter(
    (item) => item.completed
  ).length;

  const remainingCount =
    todos.length - completedCount;

  const progress =
    todos.length === 0
      ? 0
      : Math.round(
          (completedCount / todos.length) * 100
        );

  const level = Math.floor(xp / 100) + 1;
  const levelXP = xp % 100;

  const goalProgress =
    dailyGoal === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedCount / dailyGoal) * 100
          )
        );

  const filteredTodos = todos.filter((item) => {
    const filterMatch =
      filter === "all" ||
      (filter === "active" && !item.completed) ||
      (filter === "completed" && item.completed);

    const searchMatch = item.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return filterMatch && searchMatch;
  });

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <div className="brand">
            <div className="brand-icon">🚀</div>

            <div>
              <h1>Task Nova</h1>
              <p>Plan. Focus. Get Things Done.</p>
            </div>
          </div>

          <button
            className="theme-btn"
            onClick={() =>
              setDarkMode((old) => !old)
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* DASHBOARD */}
        <div className="dashboard">

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <div>
              <span>Total Tasks</span>
              <strong>{todos.length}</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⏳</div>
            <div>
              <span>Remaining</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">✅</div>
            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⭐</div>
            <div>
              <span>Level</span>
              <strong>{level}</strong>
            </div>
          </div>

        </div>

        {/* XP */}
        <div className="xp-card">
          <div className="xp-header">
            <span>🏆 Level {level}</span>
            <span>{levelXP}/100 XP</span>
          </div>

          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{
                width: `${levelXP}%`,
              }}
            ></div>
          </div>

          <p>Complete tasks to earn XP!</p>
        </div>

        {/* DAILY GOAL */}
        <div className="goal-card">
          <div className="goal-header">
            <div>
              <h3>🎯 Daily Goal</h3>
              <span>
                {completedCount} / {dailyGoal} tasks completed
              </span>
            </div>

            <select
              value={dailyGoal}
              onChange={(e) =>
                setDailyGoal(Number(e.target.value))
              }
            >
              <option value="3">3 Tasks</option>
              <option value="5">5 Tasks</option>
              <option value="10">10 Tasks</option>
              <option value="15">15 Tasks</option>
            </select>
          </div>

          <div className="goal-bar">
            <div
              className="goal-fill"
              style={{
                width: `${goalProgress}%`,
              }}
            ></div>
          </div>
        </div>

        {/* ADD TASK */}
        <div className="input-box">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={todo}
            onChange={(e) =>
              setTodo(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />

          <button onClick={addTodo}>
            + Add Task
          </button>
        </div>

        {/* PROGRESS */}
        <div className="progress-section">
          <div className="progress-text">
            <span>Overall Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔎 Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* FILTERS */}
        <div className="filters">
          <button
            className={
              filter === "all" ? "active" : ""
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={
              filter === "active" ? "active" : ""
            }
            onClick={() => setFilter("active")}
          >
            Active
          </button>

          <button
            className={
              filter === "completed"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("completed")
            }
          >
            Completed
          </button>
        </div>

        {/* TASKS */}
        <ul>
          {filteredTodos.map((item) => (
            <li
              className={`todo-item ${
                item.completed ? "task-completed" : ""
              }`}
              key={item.id}
            >

              <div
                className="todo-content"
                onClick={() =>
                  toggleTodo(item.id)
                }
              >
                <div
                  className={`check ${
                    item.completed
                      ? "checked"
                      : ""
                  }`}
                >
                  {item.completed ? "✓" : ""}
                </div>

                <div className="task-info">
                  <span
                    className={
                      item.completed
                        ? "completed-text"
                        : ""
                    }
                  >
                    {item.text}
                  </span>

                  <small>
                    📅 {item.date || "Old Task"}
                  </small>
                </div>
              </div>

              <div className="todo-actions">

                {item.completed && (
                  <span className="completed-badge">
                    ✓ COMPLETED
                  </span>
                )}

                <select
                  className={`priority ${
                    item.priority
                  }`}
                  value={
                    item.priority || "medium"
                  }
                  onChange={(e) =>
                    changePriority(
                      item.id,
                      e.target.value
                    )
                  }
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(item.id);
                  }}
                >
                  🗑️
                </button>

              </div>
            </li>
          ))}
        </ul>

        {/* EMPTY */}
        {filteredTodos.length === 0 && (
          <div className="empty">
            <div>🎯</div>
            <h3>No tasks found</h3>
            <p>
              Add a new task to get started.
            </p>
          </div>
        )}

        {/* CLEAR */}
        {completedCount > 0 && (
          <button
            className="clear-btn"
            onClick={clearCompleted}
          >
            🧹 Clear Completed
          </button>
        )}

      </div>
    </div>
  );
}

export default App;