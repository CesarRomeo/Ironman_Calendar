# The Kinetic Lab | Ironman Performance Dashboard

The Kinetic Lab is an elite-performance tracking application built with React, designed specifically for Ironman athletes. It provides a professional dashboard for workout management, calendar visualization, and progress tracking, with future integration for AI-driven training adjustments via Gemini.

## Project Overview

-   **Type:** Single Page Application (SPA) / Performance Dashboard.
-   **Purpose:** Ironman training optimization using real-time data and AI.
-   **Architecture:** Modern React architecture with functional components and hooks.
-   **Frontend:** React 19 + TypeScript + Vite.
-   **Styling:** Tailwind CSS v3 (The Kinetic Lab design system).
-   **Backend:** Firebase (Firestore for data persistence, Analytics for performance tracking).
-   **Integrations:** Strava API for activity synchronization.

## Key Features

-   **Performance Dashboard:** High-level overview of daily protocols and monthly volume.
-   **Interactive Calendar:** Bento-grid style visualization of the entire 2026 training season.
-   **Progress Analytics:** Detailed tracking of Swim, Bike, and Run metrics.
-   **Strava Sync:** Connect directly to Strava to import real-world training data.
-   **AI Optimization (Coming Soon):** Integration with Gemini to adjust training intensity based on real fatigue markers.

## Project Structure

-   `ironman-web/`: The main React application.
    -   `src/components/`: Modular UI components (Calendar, Stats, Settings, etc.).
    -   `src/services/`: Integration services (Firebase, Strava).
    -   `src/utils/`: Helper functions and training plan generators.
    -   `.env`: Secure credential management (Local only).

## Building and Running

1.  Navigate to `ironman-web/`.
2.  Install dependencies: `npm install`.
3.  Configure `.env` with Firebase and Strava credentials.
4.  Development: `npm run dev`.
5.  Build: `npm run build`.

## Deployment

The application is configured for Firebase Hosting.
-   The public directory is `ironman-web/dist`.
-   Deploy using: `npx firebase-tools deploy`.
