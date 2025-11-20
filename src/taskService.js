export const DEADLINE_STATUS = {
  NONE: "none",
  OK: "ok",
  SOON: "soon",
  OVERDUE: "overdue",
};

export function validateTitle(title) {
  const trimmed = (title ?? "").trim();
  if (!trimmed) return "Tytuł zadania nie może być pusty.";
  if (trimmed.length > 100)
    return "Tytuł zadania nie może być dłuższy niż 100 znaków.";
  return "";
}

export function createTask(
  { title, description = "", dueDate = null },
  now = new Date()
) {
  const error = validateTitle(title);
  if (error) {
    throw new Error(error);
  }

  return {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    dueDate: dueDate || null,
    completed: false,
    createdAt: now.toISOString(),
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

export function deleteTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

export function updateTask(tasks, id, updates) {
  return tasks.map((t) =>
    t.id === id
      ? {
          ...t,
          ...updates,
        }
      : t
  );
}

export function splitByStatus(tasks) {
  const active = [];
  const completed = [];
  for (const t of tasks) {
    if (t.completed) completed.push(t);
    else active.push(t);
  }
  return { active, completed };
}

export function searchTasks(tasks, query) {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter((t) => {
    const title = (t.title ?? "").toLowerCase();
    const desc = (t.description ?? "").toLowerCase();
    return title.includes(q) || desc.includes(q);
  });
}

export function sortTasks(tasks, { by = "createdAt", direction = "asc" } = {}) {
  const dir = direction === "desc" ? -1 : 1;
  const copy = [...tasks];

  copy.sort((a, b) => {
    let av, bv;

    switch (by) {
      case "title":
        av = (a.title ?? "").toLowerCase();
        bv = (b.title ?? "").toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;

      case "dueDate": {
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        if (ad < bd) return -1 * dir;
        if (ad > bd) return 1 * dir;
        return 0;
      }

      case "createdAt":
      default: {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (ad < bd) return -1 * dir;
        if (ad > bd) return 1 * dir;
        return 0;
      }
    }
  });

  return copy;
}

export function getDeadlineStatus(task, today = new Date()) {
  if (!task.dueDate) return DEADLINE_STATUS.NONE;

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const due = new Date(task.dueDate);
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffMs = dueStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return DEADLINE_STATUS.OVERDUE;
  if (diffDays <= 2) return DEADLINE_STATUS.SOON;
  return DEADLINE_STATUS.OK;
}
