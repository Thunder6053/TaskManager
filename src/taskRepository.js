const DB_KEY = "taskmanager_tasks_v1";

export const taskRepository = {
  findAll: () => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return [];
      
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Database Error (Read):", e);
      return [];
    }
  },
  saveAll: (tasks) => {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(DB_KEY, data);
    } catch (e) {
      console.error("Database Error (Write):", e);
    }
  },
  deleteAll: () => {
    try {
      localStorage.removeItem(DB_KEY);
    } catch (e) {
      console.error("Database Error (Delete):", e);
    }
  }
};