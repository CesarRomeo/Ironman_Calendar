# IronCalendar - Ironman Training Tracker

IronCalendar is a mobile-first Progressive Web App (PWA) designed to help athletes track their Ironman training progress. It provides a visual calendar interface, workout detailing, and progress statistics with offline support.

## Project Overview

-   **Type:** Progressive Web App (PWA) / Single Page Application (SPA).
-   **Purpose:** Ironman training scheduling, tracking, and progress visualization.
-   **Architecture:** Vanilla frontend architecture using a single-page approach with dynamic view switching. State is persisted locally using `localStorage`.

### Main Technologies
-   **HTML5:** Semantic structure for a mobile-app feel.
-   **CSS3:** Custom styling with CSS Variables, Flexbox, and Grid. Features a modern dark theme (`#0f172a`).
-   **JavaScript (Vanilla):** Core logic for calendar generation, training plan management, and UI interactions.
-   **Service Workers:** Basic offline caching support.
-   **Web Manifest:** Configured for "standalone" display mode on mobile devices.

## Project Structure

-   `index.html`: The entry point and main UI container.
-   `main.js`: Contains the application logic, including the training plan generator, calendar rendering, and state management.
-   `style.css`: All styling, including the dark theme and responsive layout.
-   `manifest.json`: PWA metadata and icon configuration.
-   `sw.js`: Service worker for caching core assets (`index.html`, `style.css`, `main.js`).
-   `guia.md`: Initial design notes and architectural guidelines.

## Key Features

-   **Interactive Calendar:** Visualizes the training plan for the year 2026. Indicates training types (Swim, Bike, Run, Gym) with visual cues.
-   **Workout Management:** Allows users to view workout details and mark them as "completed".
-   **Progress Tracking:** Calculates and displays weekly and monthly stats (distance and time) for each discipline.
-   **PWA Ready:** Can be installed on mobile devices for a native-like experience.

## Building and Running

Since this is a vanilla web project, there is no build step required.

-   **Development:** Open `index.html` directly in a browser or use a simple local server (e.g., Live Server in VS Code).
-   **Testing:** Manual testing in browser developer tools (Mobile simulation recommended).
-   **Production:** Host the files on any static web server (GitHub Pages, Vercel, etc.).

## Development Conventions

-   **Style:** Use Vanilla CSS for all styling. Maintain the dark-themed aesthetic.
-   **State:** The `trainingPlan` object in `main.js` is the source of truth. Always call `savePlan()` after modifying workout completion states.
-   **Formatting:** Follow the existing indentation and naming conventions in `main.js` (camelCase for variables/functions).
-   **Mobile First:** Ensure all new UI components are responsive and touch-friendly.
