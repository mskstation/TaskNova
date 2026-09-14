import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categories = [
  { value: "work", label: "💼 Work" },
  { value: "study", label: "📚 Study" },
  { value: "personal", label: "👤 Personal" },
  { value: "health", label: "💪 Health" },
  { value: "other", label: "📌 Other" },
];

const priorities = [
  { value: "low", label: "Low", icon: "🟢" },
  { value: "medium", label: "Medium", icon: "🟡" },
  { value: "high", label: "High", icon: "🔴" },
];

function App() {
  const [todo, setTodo] = useState("");

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") !== "false";
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [dailyGoal, setDailyGoal] = useState(() => {
    return Number(localStorage.getItem("dailyGoal")) || 5;
  });

  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem("xp")) || 0;
  });

  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem("streak")) || 0;
  });

  const [lastCompletedDate, setLastCompletedDate] = useState(() => {
    return localStorage.getItem("lastCompletedDate") || "";
  });

  // PROFILE
  const [profileOpen, setProfileOpen] = useState(false);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "Task Master";
  });

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("avatar") || "😎";
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");

  // EDIT TASK
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // NEW TASK OPTIONS
  const [newCategory, setNewCategory] = useState("personal");
  const [newPriority, setNewPriority] = useState("medium");
  const [newReminder, setNewReminder] = useState("");

  // UNDO
  const [undoTask, setUndoTask] = useState(null);

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

  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("lastCompletedDate", lastCompletedDate);
  }, [lastCompletedDate]);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("avatar", avatar);
  }, [avatar]);

  useEffect(() => {
    if (!undoTask) return;

    const timer = setTimeout(() => {
      setUndoTask(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [undoTask]);

  function getTodayKey() {
    return new Date().toISOString().split("T")[0];
  }

  function getYesterdayKey() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  }

  function addTodo() {
    if (!todo.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todo.trim(),
      completed: false,
      priority: newPriority,
      category: newCategory,
      reminder: newReminder,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    setTodos((oldTodos) => [...oldTodos, newTodo]);

    setTodo("");
    setNewReminder("");
    setNewPriority("medium");
    setNewCategory("personal");
  }

  function toggleTodo(id) {
    setTodos((oldTodos) =>
      oldTodos.map((item) => {
        if (item.id !== id) return item;

        if (!item.completed) {
          setXp((oldXp) => oldXp + 10);

          const today = getTodayKey();

          if (lastCompletedDate !== today) {
            if (lastCompletedDate === getYesterdayKey()) {
              setStreak((oldStreak) => oldStreak + 1);
            } else {
              setStreak(1);
            }

            setLastCompletedDate(today);
          }
        } else {
          setXp((oldXp) => Math.max(0, oldXp - 10));
        }

        return {
          ...item,
          completed: !item.completed,
        };
      })
    );
  }

  function deleteTodo(id) {
    const taskToDelete = todos.find((item) => item.id === id);

    if (!taskToDelete) return;

    setTodos((oldTodos) =>
      oldTodos.filter((item) => item.id !== id)
    );

    setUndoTask(taskToDelete);
  }

  function undoDelete() {
    if (!undoTask) return;

    setTodos((oldTodos) => {
      if (oldTodos.some((item) => item.id === undoTask.id)) {
        return oldTodos;
      }

      return [...oldTodos, undoTask];
    });

    setUndoTask(null);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditText(item.text);
  }

  function saveEdit(id) {
    if (!editText.trim()) return;

    setTodos((oldTodos) =>
      oldTodos.map((item) =>
        item.id === id
          ? { ...item, text: editText.trim() }
          : item
      )
    );

    setEditingId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
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

  function changeCategory(id, category) {
    setTodos((oldTodos) =>
      oldTodos.map((item) =>
        item.id === id
          ? { ...item, category }
          : item
      )
    );
  }

  function changeReminder(id, reminder) {
    setTodos((oldTodos) =>
      oldTodos.map((item) =>
        item.id === id
          ? { ...item, reminder }
          : item
      )
    );
  }

  function clearCompleted() {
    setTodos((oldTodos) =>
      oldTodos.filter((item) => !item.completed)
    );
  }

  function openProfile() {
    setProfileNameInput(username);
    setEditingProfile(false);
    setProfileOpen(true);
  }

  function saveProfile() {
    const cleanName = profileNameInput.trim();

    if (cleanName) {
      setUsername(cleanName);
    }

    setEditingProfile(false);
  }

  function changeAvatar() {
    const avatars = [
      "😎",
      "😈",
      "🤖",
      "🦁",
      "🐺",
      "🦊",
      "🐼",
      "🚀",
      "👑",
      "⚡",
    ];

    const currentIndex = avatars.indexOf(avatar);
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + 1) % avatars.length;

    setAvatar(avatars[nextIndex]);
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

  const highPriorityCount = todos.filter(
    (item) =>
      item.priority === "high" && !item.completed
  ).length;

  const activeCategories = new Set(
    todos.map((item) => item.category || "other")
  ).size;

  const filteredTodos = useMemo(() => {
    return todos.filter((item) => {
      const filterMatch =
        filter === "all" ||
        (filter === "active" && !item.completed) ||
        (filter === "completed" && item.completed);

      const searchMatch = item.text
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        categoryFilter === "all" ||
        (item.category || "other") === categoryFilter;

      return (
        filterMatch &&
        searchMatch &&
        categoryMatch
      );
    });
  }, [
    todos,
    filter,
    search,
    categoryFilter,
  ]);

  function categoryLabel(category) {
    const found = categories.find(
      (item) => item.value === category
    );

    return found ? found.label : "📌 Other";
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <div className="brand">
            <div className="brand-icon">
              🚀
            </div>

            <div>
              <h1>Task Nova</h1>
              <p>
                Plan. Focus. Get Things Done.
              </p>
            </div>
          </div>

          <div className="header-actions">

            <button
              className="theme-btn"
              onClick={() =>
                setDarkMode((old) => !old)
              }
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              className="profile-mini"
              onClick={openProfile}
              title="Open Profile"
            >
              <span>{avatar}</span>
              <b>{username}</b>
            </button>

          </div>
        </div>

        {/* PROFILE HERO */}
        <div className="profile-hero">

          <div className="profile-main">

            <button
              className="profile-avatar"
              onClick={changeAvatar}
              title="Change avatar"
            >
              {avatar}
            </button>

            <div>
              <span className="welcome-text">
                Welcome back 👋
              </span>

              <h2>{username}</h2>

              <p>
                Keep going — you're doing great!
              </p>
            </div>

          </div>

          <div className="profile-level">

            <div>
              <span>LEVEL</span>
              <strong>{level}</strong>
            </div>

            <div className="profile-xp">
              <span>{xp} XP</span>
              <small>
                {100 - levelXP} XP to next level
              </small>
            </div>

          </div>

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
            <div className="card-icon">🔥</div>

            <div>
              <span>Streak</span>
              <strong>{streak}</strong>
            </div>
          </div>

        </div>

        {/* EXTRA STATS */}
        <div className="mini-stats">

          <div className="mini-stat">
            <span>🔴 High Priority</span>
            <strong>{highPriorityCount}</strong>
          </div>

          <div className="mini-stat">
            <span>📂 Categories Used</span>
            <strong>{activeCategories}</strong>
          </div>

          <div className="mini-stat">
            <span>⚡ Total XP</span>
            <strong>{xp}</strong>
          </div>

          <div className="mini-stat">
            <span>📈 Progress</span>
            <strong>{progress}%</strong>
          </div>

        </div>

        {/* XP */}
        <div className="xp-card">

          <div className="xp-header">
            <span>
              🏆 Level {level}
            </span>

            <span>
              {levelXP}/100 XP
            </span>
          </div>

          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{
                width: `${levelXP}%`,
              }}
            />
          </div>

          <p>
            Complete tasks to earn XP and level up!
          </p>

        </div>

        {/* DAILY GOAL */}
        <div className="goal-card">

          <div className="goal-header">

            <div>
              <h3>🎯 Daily Goal</h3>

              <span>
                {completedCount} / {dailyGoal} tasks
                completed
              </span>
            </div>

            <select
              value={dailyGoal}
              onChange={(e) =>
                setDailyGoal(
                  Number(e.target.value)
                )
              }
            >
              <option value="3">
                3 Tasks
              </option>

              <option value="5">
                5 Tasks
              </option>

              <option value="10">
                10 Tasks
              </option>

              <option value="15">
                15 Tasks
              </option>
            </select>

          </div>

          <div className="goal-bar">
            <div
              className="goal-fill"
              style={{
                width: `${goalProgress}%`,
              }}
            />
          </div>

        </div>

        {/* ADD TASK */}
        <div className="add-task-card">

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

          <div className="task-options">

            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
            >
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={newPriority}
              onChange={(e) =>
                setNewPriority(e.target.value)
              }
            >
              {priorities.map((priority) => (
                <option
                  key={priority.value}
                  value={priority.value}
                >
                  {priority.icon}{" "}
                  {priority.label} Priority
                </option>
              ))}
            </select>

            <input
              className="reminder-input"
              type="datetime-local"
              value={newReminder}
              onChange={(e) =>
                setNewReminder(e.target.value)
              }
            />

          </div>

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
            />
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

        {/* CATEGORY FILTER */}
        <div className="category-filters">

          <button
            className={
              categoryFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoryFilter("all")
            }
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category.value}
              className={
                categoryFilter === category.value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategoryFilter(
                  category.value
                )
              }
            >
              {category.label}
            </button>
          ))}

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
                item.completed
                  ? "task-completed"
                  : ""
              }`}
              key={item.id}
            >

              <div
                className="todo-content"
                onClick={() => {
                  if (editingId !== item.id) {
                    toggleTodo(item.id);
                  }
                }}
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

                  {editingId === item.id ? (
                    <div className="edit-box">

                      <input
                        value={editText}
                        autoFocus
                        onChange={(e) =>
                          setEditText(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(item.id);
                          }

                          if (e.key === "Escape") {
                            cancelEdit();
                          }
                        }}
                      />

                      <button
                        className="save-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(item.id);
                        }}
                      >
                        ✓
                      </button>

                      <button
                        className="cancel-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEdit();
                        }}
                      >
                        ✕
                      </button>

                    </div>
                  ) : (
                    <span
                      className={
                        item.completed
                          ? "completed-text"
                          : ""
                      }
                    >
                      {item.text}
                    </span>
                  )}

                  <div className="task-meta">

                    <small>
                      📅{" "}
                      {item.date ||
                        "Old Task"}
                    </small>

                    <span className="category-badge">
                      {categoryLabel(
                        item.category
                      )}
                    </span>

                    {item.reminder && (
                      <span className="reminder-badge">
                        🔔{" "}
                        {item.reminder.replace(
                          "T",
                          " "
                        )}
                      </span>
                    )}

                  </div>

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
                    item.priority || "medium"
                  }`}
                  value={
                    item.priority ||
                    "medium"
                  }
                  onChange={(e) =>
                    changePriority(
                      item.id,
                      e.target.value
                    )
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  {priorities.map(
                    (priority) => (
                      <option
                        key={
                          priority.value
                        }
                        value={
                          priority.value
                        }
                      >
                        {priority.icon}{" "}
                        {priority.label}
                      </option>
                    )
                  )}
                </select>

                <select
                  className="category-select"
                  value={
                    item.category ||
                    "other"
                  }
                  onChange={(e) =>
                    changeCategory(
                      item.id,
                      e.target.value
                    )
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.value
                        }
                        value={
                          category.value
                        }
                      >
                        {category.label}
                      </option>
                    )
                  )}
                </select>

                <input
                  className="task-reminder"
                  type="datetime-local"
                  value={
                    item.reminder || ""
                  }
                  onChange={(e) =>
                    changeReminder(
                      item.id,
                      e.target.value
                    )
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  title="Reminder"
                />

                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(item);
                  }}
                >
                  ✏️
                </button>

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

        {/* UNDO */}
        {undoTask && (
          <div className="undo-bar">

            <span>
              🗑️ "{undoTask.text}" deleted
            </span>

            <button onClick={undoDelete}>
              ↩️ Undo
            </button>

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

        {/* PROFILE MODAL */}
        {profileOpen && (
          <div
            className="modal-overlay"
            onClick={() =>
              setProfileOpen(false)
            }
          >
            <div
              className="profile-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="modal-close"
                onClick={() =>
                  setProfileOpen(false)
                }
              >
                ✕
              </button>

              <div className="modal-avatar">
                <button
                  onClick={changeAvatar}
                  title="Change avatar"
                >
                  {avatar}
                </button>
              </div>

              <h2>
                {username}
              </h2>

              <p className="profile-subtitle">
                Your Task Nova Profile
              </p>

              {!editingProfile ? (
                <button
                  className="profile-edit-button"
                  onClick={() =>
                    setEditingProfile(true)
                  }
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="profile-edit-box">

                  <input
                    value={profileNameInput}
                    onChange={(e) =>
                      setProfileNameInput(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                    autoFocus
                  />

                  <div>
                    <button
                      onClick={saveProfile}
                      className="profile-save"
                    >
                      Save
                    </button>

                    <button
                      onClick={() =>
                        setEditingProfile(false)
                      }
                      className="profile-cancel"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              )}

              <div className="profile-stats">

                <div>
                  <span>🏆 Level</span>
                  <strong>
                    {level}
                  </strong>
                </div>

                <div>
                  <span>⚡ XP</span>
                  <strong>
                    {xp}
                  </strong>
                </div>

                <div>
                  <span>🔥 Streak</span>
                  <strong>
                    {streak}
                  </strong>
                </div>

                <div>
                  <span>✅ Done</span>
                  <strong>
                    {completedCount}
                  </strong>
                </div>

                <div>
                  <span>📋 Tasks</span>
                  <strong>
                    {todos.length}
                  </strong>
                </div>

                <div>
                  <span>📈 Progress</span>
                  <strong>
                    {progress}%
                  </strong>
                </div>

              </div>

              <div className="profile-progress">

                <div>
                  <span>
                    Level {level}
                  </span>

                  <span>
                    {levelXP}/100 XP
                  </span>
                </div>

                <div className="profile-progress-bar">
                  <div
                    style={{
                      width: `${levelXP}%`,
                    }}
                  />
                </div>

              </div>

              <p className="avatar-tip">
                💡 Click your avatar to change it.
              </p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;