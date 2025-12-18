# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Przypadki Testowe (Manualne)

| ID | Tytuł Scenariusza | Warunki początkowe | Kroki testowe (Action) | Oczekiwany Rezultat (Expected Result) |
|----|-------------------|--------------------|------------------------|---------------------------------------|
| TC01 | Dodanie poprawnego zadania | Aplikacja jest uruchomiona | 1. Wpisz "Kupić chleb" w polu tytuł.<br>2. Kliknij "Dodaj zadanie". | Zadanie pojawia się na liście "Aktywne". Formularz zostaje wyczyszczony. |
| TC02 | Próba dodania pustego zadania | Aplikacja jest uruchomiona | 1. Pozostaw pole tytuł puste.<br>2. Kliknij "Dodaj zadanie". | Pojawia się komunikat błędu "Tytuł zadania nie może być pusty". Zadanie nie jest dodane. |
| TC03 | Dodanie zadania z datą | Aplikacja jest uruchomiona | 1. Wpisz "Zadanie z datą".<br>2. Wybierz datę w przyszłości.<br>3. Kliknij "Dodaj". | Zadanie pojawia się na liście z poprawnie sformatowaną datą i zielonym/żółtym wskaźnikiem. |
| TC04 | Zakończenie zadania | Na liście "Aktywne" znajduje się zadanie | 1. Znajdź zadanie na liście "Aktywne".<br>2. Kliknij checkbox przy zadaniu. | Zadanie znika z "Aktywne" i pojawia się w "Zakończone". Checkbox jest zaznaczony. |
| TC05 | Przywrócenie zadania | Na liście "Zakończone" znajduje się zadanie | 1. Znajdź zadanie na liście "Zakończone".<br>2. Odznacz checkbox. | Zadanie wraca na listę "Aktywne". |
| TC06 | Usunięcie zadania | Na liście znajduje się dowolne zadanie | 1. Kliknij przycisk "Usuń" przy dowolnym zadaniu. | Zadanie znika całkowicie z listy. Licznik zadań maleje. |
| TC07 | Edycja tytułu zadania | Na liście znajduje się zadanie | 1. Kliknij "Edytuj" przy zadaniu.<br>2. Zmień tytuł w polu tekstowym.<br>3. Kliknij "Zapisz". | Nowy tytuł jest widoczny na liście. Tryb edycji się zamyka. |
| TC08 | Anulowanie edycji | Rozpoczęto edycję zadania | 1. Kliknij "Edytuj".<br>2. Zmień tekst.<br>3. Kliknij "Anuluj". | Tryb edycji zamyka się. Zmiany NIE są zapisane (widoczny stary tytuł). |
| TC09 | Wyszukiwanie zadania | Na liście są zadania: "Praca" i "Dom" | 1. Wpisz "Dom" w pole wyszukiwania. | Na liście widoczne jest tylko zadanie "Dom". Zadanie "Praca" jest ukryte. |
| TC10 | Sortowanie malejące | Na liście znajduje się kilka zadań | 1. Kliknij strzałkę sortowania obok listy wyboru. | Kolejność zadań na liście odwraca się. |