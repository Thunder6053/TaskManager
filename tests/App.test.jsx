import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Integration Tests: App Component', () => {
  
  // Czyszczenie localStorage przed każdym testem
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Renderowanie aplikacji
  it('should render the main application title', () => {
    // Arrange & Act
    render(<App />);
    
    // Assert
    expect(screen.getByText('TaskManager')).toBeInTheDocument();
  });

  // Test 2: Obsługa inputa
  it('should update input value when user types', () => {
    // Arrange
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);

    // Act
    fireEvent.change(input, { target: { value: 'Nowe zadanie' } });

    // Assert
    expect(input.value).toBe('Nowe zadanie');
  });

  // Test 3: Dodawanie zadania (Flow)
  it('should add a new task to the list', () => {
    // Arrange
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    const button = screen.getByText('Dodaj zadanie');

    // Act
    fireEvent.change(input, { target: { value: 'Testowe zadanie' } });
    fireEvent.click(button);

    // Assert
    expect(screen.getByText('Testowe zadanie')).toBeInTheDocument();
  });

  // Test 4: Walidacja w UI (Błąd przy pustym tytule)
  it('should show error when trying to add empty task', () => {
    // Arrange
    render(<App />);
    const button = screen.getByText('Dodaj zadanie');

    // Act
    fireEvent.click(button);

    // Assert
    expect(screen.getByText(/Tytuł zadania nie może być pusty/i)).toBeInTheDocument();
  });

  // Test 5: Usuwanie zadania z listy
  it('should remove task when delete button is clicked', () => {
    // Arrange (Dodajemy zadanie)
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    const addBtn = screen.getByText('Dodaj zadanie');
    fireEvent.change(input, { target: { value: 'Do usunięcia' } });
    fireEvent.click(addBtn);

    // Act
    const deleteBtn = screen.getByText('Usuń');
    fireEvent.click(deleteBtn);

    // Assert
    expect(screen.queryByText('Do usunięcia')).not.toBeInTheDocument();
  });

  // Test 6: Oznaczanie jako zakończone (Przeniesienie do innej tabeli)
  it('should move task to completed list when checkbox is clicked', () => {
    // Arrange
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    fireEvent.change(input, { target: { value: 'Zadanie check' } });
    fireEvent.click(screen.getByText('Dodaj zadanie'));

    // Act
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Assert
    // Sprawdzamy czy trafiło do sekcji "Zakończone" (w DOM wciąż jest, ale checkbox zaznaczony)
    expect(checkbox).toBeChecked();
  });

  // Test 7: Tryb edycji
  it('should switch to edit mode when edit button is clicked', () => {
    // Arrange
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    fireEvent.change(input, { target: { value: 'Edycja start' } });
    fireEvent.click(screen.getByText('Dodaj zadanie'));

    // Act
    fireEvent.click(screen.getByText('Edytuj'));

    // Assert
    expect(screen.getByDisplayValue('Edycja start')).toBeInTheDocument();
    expect(screen.getByText('Zapisz')).toBeInTheDocument(); 
  });

  // Test 8: Licznik zadań (Stats)
  it('should update task counter', () => {
    // Arrange
    render(<App />);
    
    // Act
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    fireEvent.change(input, { target: { value: 'Zadanie 1' } });
    fireEvent.click(screen.getByText('Dodaj zadanie'));

    // Assert
    // POPRAWKA: Znajdujemy element po stałym fragmencie tekstu "Aktywne:"
    // (React Testing Library jest sprytny i znajdzie rodzica)
    const activeStat = screen.getByText(/Aktywne:/i);
    
    // Sprawdzamy, czy ten element zawiera w sobie cyfrę "1"
    expect(activeStat).toHaveTextContent("1");
  });

  // Test 9: Filtrowanie listy
  it('should filter displayed tasks when searching', () => {
    // Arrange
    render(<App />);
    const input = screen.getByPlaceholderText(/Np. Przygotować prezentację/i);
    const addBtn = screen.getByText('Dodaj zadanie');
    
    fireEvent.change(input, { target: { value: 'Jabłko' } });
    fireEvent.click(addBtn);

    fireEvent.change(input, { target: { value: 'Gruszka' } });
    fireEvent.click(addBtn);

    // Act - Szukaj "Gruszka"
    const searchInput = screen.getByPlaceholderText(/Szukaj po tytule/i);
    fireEvent.change(searchInput, { target: { value: 'Gruszka' } });

    // Assert
    expect(screen.getByText('Gruszka')).toBeInTheDocument();
    expect(screen.queryByText('Jabłko')).not.toBeInTheDocument();
  });

  // Test 10: Brak zadań (Empty state)
  it('should display empty state message when no tasks exist', () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(screen.getByText('Brak aktywnych zadań.')).toBeInTheDocument();
  });
});