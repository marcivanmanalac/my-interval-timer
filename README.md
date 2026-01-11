# Interval Timer Application

A premium, web-based interval timer application built with Vue.js, Node.js, and Docker.

## Features

- **Workout Profiles**: Create, save, and delete custom workout details (Work/Rest time, Reps).
- **Audio Feedback**: Startup beeps and countdown tones to guide your workout without looking at the screen.
- **Premium UI**: Sleek, dark-themed interface for a focused workout experience.
- **Global Settings**: Customize audio volume, tone frequencies, and countdown duration.
- **Persistence**: Profiles and settings are saved automatically (even after restarting the application).

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

### Running the Application

1.  **Clone or navigate** to the project directory.
2.  **Start the container**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Open your browser**:
    Access the app at [http://localhost:3000](http://localhost:3000).

### Development

If you want to run the client and server locally for development:

1.  **Install dependencies**:
    ```bash
    npm run install:all
    ```
2.  **Run in development mode**:
    ```bash
    npm run dev
    ```
    - Client: `http://localhost:5173`
    - Server: `http://localhost:3000`

## Architecture

- **Client**: Vue 3 + Vite + TailwindCSS (Dark Theme).
- **Server**: Node.js + Express (Serves static files and API).
- **Database**: JSON file persistence (`data/profiles.json`) mounted via Docker volume.
