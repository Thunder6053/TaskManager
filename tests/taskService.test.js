import { describe, it, expect } from 'vitest';
import {
  validateTitle,
  createTask,
  toggleTask,
  deleteTask,
  updateTask,
  searchTasks,
  sortTasks,
  getDeadlineStatus,
  DEADLINE_STATUS
} from '../src/taskService';

describe('Unit Tests: taskService', () => {

  // Test 1: Walidacja pustego tytułu
  it('should return error message when title is empty', () => {
    // Arrange
    const title = '';

    // Act
    const result = validateTitle(title);

    // Assert
    expect(result).toBe("Tytuł zadania nie może być pusty.");
  });

  // Test 2: Walidacja poprawnego tytułu
  it('should return empty string when title is valid', () => {
    // Arrange
    const title = 'Kupić mleko';

    // Act
    const result = validateTitle(title);

    // Assert
    expect(result).toBe("");
  });

  // Test 3: Tworzenie nowego zadania
  it('should create a new task object correctly', () => {
    // Arrange
    const data = { title: 'Zadanie 1', description: 'Opis', dueDate: '2023-01-01' };

    // Act
    const task = createTask(data);

    // Assert
    expect(task.title).toBe('Zadanie 1');
    expect(task.completed).toBe(false);
    expect(task.id).toBeDefined();
  });

  // Test 4: Rzucanie błędu przy tworzeniu zadania z błędnymi danymi
  it('should throw error when creating task with empty title', () => {
    // Arrange
    const data = { title: '' };

    // Act & Assert
    expect(() => createTask(data)).toThrow("Tytuł zadania nie może być pusty.");
  });

  // Test 5: Zmiana statusu zadania (toggle)
  it('should toggle task completion status', () => {
    // Arrange
    const tasks = [{ id: 1, completed: false }];

    // Act
    const updated = toggleTask(tasks, 1);

    // Assert
    expect(updated[0].completed).toBe(true);
  });

  // Test 6: Usuwanie zadania
  it('should remove task from the list', () => {
    // Arrange
    const tasks = [{ id: 1 }, { id: 2 }];

    // Act
    const updated = deleteTask(tasks, 1);

    // Assert
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe(2);
  });

  // Test 7: Aktualizacja zadania
  it('should update task details', () => {
    // Arrange
    const tasks = [{ id: 1, title: 'Stary' }];
    const updates = { title: 'Nowy' };

    // Act
    const updated = updateTask(tasks, 1, updates);

    // Assert
    expect(updated[0].title).toBe('Nowy');
  });

  // Test 8: Wyszukiwanie zadań
  it('should filter tasks by search query', () => {
    // Arrange
    const tasks = [{ title: 'Zakupy' }, { title: 'Praca' }];

    // Act
    const result = searchTasks(tasks, 'zak');

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Zakupy');
  });

  // Test 9: Sortowanie zadań
  it('should sort tasks by title', () => {
    // Arrange
    const tasks = [{ title: 'B' }, { title: 'A' }];

    // Act
    const result = sortTasks(tasks, { by: 'title', direction: 'asc' });

    // Assert
    expect(result[0].title).toBe('A');
    expect(result[1].title).toBe('B');
  });

  // Test 10: Status terminu (Overdue)
  it('should return OVERDUE status for past dates', () => {
    // Arrange
    const task = { dueDate: '2020-01-01' }; // Data z przeszłości
    
    // Act
    const status = getDeadlineStatus(task);

    // Assert
    expect(status).toBe(DEADLINE_STATUS.OVERDUE);
  });
});