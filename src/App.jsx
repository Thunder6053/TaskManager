import { useEffect, useState } from "react";
import "./App.css";
import {
  createTask,
  validateTitle,
  toggleTask,
  deleteTask,
  updateTask,
  splitByStatus,
  searchTasks,
  sortTasks,
  getDeadlineStatus,
  DEADLINE_STATUS,
} from "./taskService";

import { taskRepository } from "./taskRepository";

function App() {
  const [tasks, setTasks] = useState(() => taskRepository.findAll());

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDate, setEditingDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("asc");

  /*SYNCHRONIZACJA Z BAZĄ DANYCH*/
  useEffect(() => {
    taskRepository.saveAll(tasks);
  }, [tasks]);

  /*HANDLERY (Logika UI -> Logika Biznesowa)*/
  const handleAdd = (e) => {
    e.preventDefault();
    const validationError = validateTitle(newTitle);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const task = createTask({
        title: newTitle,
        description: newDescription,
        dueDate: newDate,
      });
      setTasks((prev) => [...prev, task]);
      
      setNewTitle("");
      setNewDescription("");
      setNewDate("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    setTasks((prev) => deleteTask(prev, id));
  };

  const handleToggle = (id) => {
    setTasks((prev) => toggleTask(prev, id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
    setEditingDate(task.dueDate || "");
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDate("");
  };

  const saveEditing = (id) => {
    const validationError = validateTitle(editingTitle);
    if (validationError) {
      setError(validationError);
      return;
    }
    setTasks((prev) =>
      updateTask(prev, id, {
        title: editingTitle.trim(),
        description: editingDescription.trim(),
        dueDate: editingDate || null,
      })
    );
    setEditingId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDate("");
    setError("");
  };

  /*FILTROWANIE / SORTOWANIE*/
  const processed = sortTasks(searchTasks(tasks, searchQuery), {
    by: sortBy,
    direction: sortDir,
  });

  const { active, completed } = splitByStatus(processed);

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString();
    } catch {
      return value;
    }
  };

  const getDeadlineClass = (task) => {
    const status = getDeadlineStatus(task);
    switch (status) {
      case DEADLINE_STATUS.OVERDUE:
        return "deadline-overdue";
      case DEADLINE_STATUS.SOON:
        return "deadline-soon";
      case DEADLINE_STATUS.OK:
        return "deadline-ok";
      default:
        return "deadline-none";
    }
  };

  /*RENDER*/

  return (
    <div className="app-root">
      <main className="card glass card-anim">
        <header className="card-header">
          <h1>TaskManager</h1>
          <p className="subtitle">Prosta aplikacja do zarządzania zadaniami</p>
        </header>

        <section className="layout-grid">
          {/* LEWY PANEL */}
          <section className="left-panel glass panel-anim-left">
            <h2 className="panel-title">Nowe / edytowane zadanie</h2>

            <form onSubmit={handleAdd} className="add-form-column">
              <div className="field-group">
                <label className="field-label">Tytuł zadania *</label>
                <input
                  type="text"
                  placeholder="Np. Przygotować prezentację na zajęcia"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Opis (opcjonalny)</label>
                <textarea
                  placeholder="Dodatkowe szczegóły, linki, wymagania..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="text-area"
                  rows={4}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Termin (opcjonalny)</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <button type="submit" className="primary-btn wide-btn">
                Dodaj zadanie
              </button>
            </form>

            {error && <p className="error-text">{error}</p>}

            <div className="hint-box glass-soft">
              <p className="hint-title">Podpowiedź</p>
              <p className="hint-text">
                Zadania po dodaniu pojawią się w panelu po prawej. Zmiana
                statusu odbywa się za pomocą checkboxa w kolumnie{" "}
                <strong>„Status”</strong>. Kolor terminu oznacza: czerwony – po
                terminie, żółty – zbliża się, zielony – jest jeszcze czas.
              </p>
            </div>
          </section>

          {/* PRAWY PANEL */}
          <section className="right-panel glass panel-anim-right">
            {/* toolbar: szukaj + sort */}
            <div className="toolbar-row">
              <div className="toolbar-left">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Szukaj po tytule lub opisie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="toolbar-right">
                <label className="toolbar-label">
                  Sortuj:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="createdAt">Data utworzenia</option>
                    <option value="dueDate">Termin</option>
                    <option value="title">Tytuł</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="sort-dir-btn"
                  onClick={() =>
                    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-chip">
                Aktywne: <span>{active.length}</span>
              </div>
              <div className="stat-chip">
                Zakończone: <span>{completed.length}</span>
              </div>
              <div className="stat-chip stat-chip-muted">
                Łącznie: <span>{tasks.length}</span>
              </div>
            </div>

            <div className="deadline-legend">
              <span className="legend-dot legend-overdue" /> Po terminie
              <span className="legend-dot legend-soon" /> Zbliża się
              <span className="legend-dot legend-ok" /> Jest czas
            </div>

            <div className="tables-section">
              {/* Aktywne */}
              <div className="table-column glass-soft">
                <h2 className="table-title">Aktywne</h2>
                {active.length === 0 ? (
                  <p className="empty-text">Brak aktywnych zadań.</p>
                ) : (
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Tytuł</th>
                        <th>Opis</th>
                        <th>Termin</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.map((task) => (
                        <tr key={task.id}>
                          <td className="cell-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggle(task.id)}
                            />
                          </td>
                          <td>
                            {editingId === task.id ? (
                              <input
                                className="table-input"
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                              />
                            ) : (
                              task.title
                            )}
                          </td>
                          <td>
                            {editingId === task.id ? (
                              <textarea
                                className="table-input"
                                rows={2}
                                value={editingDescription}
                                onChange={(e) =>
                                  setEditingDescription(e.target.value)
                                }
                              />
                            ) : task.description ? (
                              task.description
                            ) : (
                              "—"
                            )}
                          </td>
                          <td
                            className={`deadline-cell ${getDeadlineClass(
                              task
                            )}`}
                          >
                            {editingId === task.id ? (
                              <input
                                type="date"
                                className="table-input"
                                value={editingDate || ""}
                                onChange={(e) => setEditingDate(e.target.value)}
                              />
                            ) : (
                              formatDate(task.dueDate)
                            )}
                          </td>
                          <td className="cell-actions">
                            {editingId === task.id ? (
                              <>
                                <button
                                  className="secondary-btn"
                                  type="button"
                                  onClick={() => saveEditing(task.id)}
                                >
                                  Zapisz
                                </button>
                                <button
                                  className="ghost-btn"
                                  type="button"
                                  onClick={cancelEditing}
                                >
                                  Anuluj
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="secondary-btn"
                                  type="button"
                                  onClick={() => startEditing(task)}
                                >
                                  Edytuj
                                </button>
                                <button
                                  className="danger-btn"
                                  type="button"
                                  onClick={() => handleDelete(task.id)}
                                >
                                  Usuń
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Zakończone */}
              <div className="table-column glass-soft">
                <h2 className="table-title">Zakończone</h2>
                {completed.length === 0 ? (
                  <p className="empty-text">Brak zakończonych zadań.</p>
                ) : (
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Tytuł</th>
                        <th>Opis</th>
                        <th>Termin</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completed.map((task) => (
                        <tr key={task.id} className="row-completed">
                          <td className="cell-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggle(task.id)}
                            />
                          </td>
                          <td>{task.title}</td>
                          <td>{task.description || "—"}</td>
                          <td
                            className={`deadline-cell ${getDeadlineClass(
                              task
                            )}`}
                          >
                            {formatDate(task.dueDate)}
                          </td>
                          <td className="cell-actions">
                            <button
                              className="secondary-btn"
                              type="button"
                              onClick={() => startEditing(task)}
                            >
                              Edytuj
                            </button>
                            <button
                              className="danger-btn"
                              type="button"
                              onClick={() => handleDelete(task.id)}
                            >
                              Usuń
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        </section>
        <footer className="footer">
          © {new Date().getFullYear()} TaskManager — Projekt studencki Jakub
          Kurek
        </footer>
      </main>
    </div>
  );
}

export default App;