# Testowanie i Jakość Oprogramowania

## Autor

**Jakub Kurek** <br>

[![GitHub](https://img.shields.io/badge/GitHub-Odwiedź_Profil-181717?style=for-the-badge&logo=github)](https://github.com/Thunder6053)

## Temat i opis projektu
**Aplikacja TaskManager - System zarządzania listą zadań.**

Projekt jest aplikacją typu SPA (Single Page Application) stworzoną w oparciu o bibliotekę React. Służy do efektywnego zarządzania zadaniami osobistymi. Aplikacja umożliwia pełną obsługę cyklu życia zadania (CRUD): dodawanie, edycję, usuwanie oraz oznaczanie jako wykonane. 

Głównym celem projektu było stworzenie kodu wysokiej jakości, pokrytego testami automatycznymi (jednostkowymi i integracyjnymi) oraz przygotowanie scenariuszy dla testów manualnych. Dane przechowywane są lokalnie (LocalStorage), co zapewnia ich trwałość między sesjami przeglądarki.

## Uruchomienie projektu

Aby uruchomić projekt lokalnie, należy wykonać poniższe komendy w terminalu:

1. **Instalacja zależności:**
   
   ```bash
   npm install
   ```
2. **Uruchomienie w trybie deweloperskim:**
    
    ```bash
   npm run dev
   ```
**Aplikacja będzie dostępna pod adresem:** http://localhost:5173

## Testy

Projekt zawiera zestaw testów automatycznych zaimplementowanych przy użyciu **Vitest** oraz **React Testing Library**. Kod testów jest zgodny z konwencją **AAA (Arrange-Act-Assert)**.

1. **Lokalizacja plików testowych:**
* **Testy Jednostkowe:** [`tests/taskService.test.js`](./tests/taskService.test.js)  
  Weryfikują logikę biznesową aplikacji (walidacja, tworzenie obiektów, sortowanie, filtrowanie) w izolacji od interfejsu.

* **Testy Integracyjne:** [`tests/App.test.jsx`](./tests/App.test.jsx)  
  Weryfikują interakcje użytkownika z interfejsem (wprowadzanie danych, klikanie przycisków, renderowanie listy).

2. **Uruchomienie testów:**
    
    ```bash
    npm test
    ```
**Oczekiwany rezultat:** 20 passed (10 jednostkowych + 10 integracyjnych).

## Dokumentacja API
W projekcie rolę warstwy logicznej (API wewnętrznego) pełni moduł `taskService.js`. Udostępnia on następujące funkcje:

* `createTask(data)` - Tworzy nowy obiekt zadania z unikalnym ID i datą.
* `validateTitle(title)` - Sprawdza poprawność wprowadzonych danych (walidacja).
* `toggleTask(tasks, id)` - Zmienia status zadania (aktywne/zakończone).
* `deleteTask(tasks, id)` - Usuwa zadanie z listy.
* `updateTask(tasks, id, updates)` - Aktualizuje dane istniejącego zadania.
* `sortTasks(tasks, config)` - Sortuje listę według zadanych kryteriów.
* `searchTasks(tasks, query)` - Filtruje zadania na podstawie frazy wyszukiwania.

## Przypadki Testowe (Manualne)

| ID | Tytuł Scenariusza | Warunki początkowe | Kroki testowe (Action) | Oczekiwany Rezultat (Expected Result) |
|----|-------------------|--------------------|------------------------|---------------------------------------|
| TC01 | Dodanie poprawnego zadania | Aplikacja jest uruchomiona | 1. Wpisz "Kupić chleb" w polu tytuł.<br>2. Kliknij "Dodaj zadanie". | Zadanie pojawia się na liście "Aktywne". Formularz zostaje wyczyszczony. |
| TC02 | Próba dodania pustego zadania | Aplikacja jest uruchomiona | 1. Pozostaw pole tytuł puste.<br>2. Kliknij "Dodaj zadanie". | Pojawia się komunikat błędu "Tytuł zadania nie może być pusty". Zadanie nie jest dodane. |
| TC03 | Dodanie zadania z datą | Aplikacja jest uruchomiona | 1. Wpisz "Zadanie z datą".<br>2. Wybierz datę w przyszłości.<br>3. Kliknij "Dodaj". | Zadanie pojawia się na liście z poprawnie sformatowaną datą i zielonym/żółtym wskaźnikiem. |
| TC04 | Zakończenie zadania | Na liście "Aktywne" znajduje się zadanie | 1. Znajdź zadanie na liście "Aktywne".<br>2. Kliknij checkbox przy zadaniu. | Zadanie znika z "Aktywne" i pojawia się w "Zakończone". Checkbox jest zaznaczony. |
| TC05 | Przywrócenie zadania | Na liście "Zakończone" znajduje się zadanie | 1. Znajdź zadanie na liście "Zakończone".<br>2. Odznacz checkbox. | Zadanie wraca na listę "Aktywne". |
| TC06 | Usunięcie zadania | Na liście znajduje się dowolne zadanie | 1. Kliknij przycisk "Usuń" przy dowolnym zadaniu. | Zadanie znika całkowicie z listy. Licznik zadań maleje. |
| TC07 | Edycja tytułu zadania | Na liście znajduje się zadanie | 1. Kliknij "Edytuj" przy zadaniu.<br>2. Zmień tytuł w polu tekstowym.<br>3. Kliknij "Zapisz". | Nowy tytuł jest widoczny na liście. Tryb edycji się zamyka. |
| TC08 | Anulowanie edycji | Rozpoczęto edycję zadania | 1. Kliknij "Edytuj".<br>2. Zmień tekst.<br>3. Kliknij "Anuluj". | Tryb edycji zamyka się. Zmiany NIE są zapisane (widoczny stary tytuł). |
| TC09 | Wyszukiwanie zadania | Na liście są zadania: "Praca" i "Dom" | 1. Wpisz "Dom" w pole wyszukiwania. | Na liście widoczne jest tylko zadanie "Dom". Zadanie "Praca" jest ukryte. |
| TC10 | Sortowanie malejące | Na liście znajduje się kilka zadań | 1. Kliknij strzałkę sortowania obok listy wyboru. | Kolejność zadań na liście odwraca się. |

## Technologie użyte w projekcie
* **Frontend:** React 19
* **Build Tool:** Vite
* **Język:** JavaScript (ES6+)
* **Style:** TailwindCSS
* **Testy:** Vitest, React Testing Library, JSDOM
