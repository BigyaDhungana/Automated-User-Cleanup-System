# Automated User Cleanup System

This repository contains the **Automated User Cleanup System**, a Django backend with **Celery task scheduling** and **Redis**, set up using **Docker** for easy local development.

It also includes a frontend built with **Vite** for demonstration purposes.

---

## Project Structure

```
Automated-User-Cleanup-System/
├── django-backend/          # Django project folder
│   ├── project/             # Django project (settings, celery.py, urls)
│   ├── cleanup/                 # Main Django app (endpoints, tasks)
│   ├── manage.py
│   └── requirements.txt
├── Dockerfile               # Dockerfile for backend, worker, scheduler
├── docker-compose.yml       # Multi-container Docker setup
├── .dockerignore            # Files to ignore when building Docker image
└── frontend/                # Vite frontend
    ├── src/
    │   ├── api/             # Fetch functions
    │   ├── types/           # Type declarations
    │   └── App.tsx          # Main frontend file
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/BigyaDhungana/Automated-User-Cleanup-System.git
cd Automated-User-Cleanup-System
```

---

### 2. Backend Setup

#### a. Using Docker

```bash
cp django-backend/docker.env.example django-backend/docker.env
# Edit docker.env with real secrets (SECRET_KEY, etc.)
docker compose up --build
```

**Services started:**

* `backend` → Django server
* `redis` → Celery broker
* `worker` → Celery worker
* `scheduler` → Celery beat (periodic tasks)

Access Django backend at: [http://localhost:8000/](http://localhost:8000/)

#### b. Running Locally (without Docker)

```bash
cd django-backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or venv\Scripts\activate for Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access frontend at: [http://localhost:5173/](http://localhost:5173/) (default Vite port)

---

## API Endpoints

| Method | Endpoint                | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| GET    | `/api/reports/latest/`  | Retrieve the most recent CleanupReport        |
| POST   | `/api/cleanup/trigger/` | Manually trigger the cleanup task immediately |
| GET    | `/api/reports/all/`     | Retrieve all CleanupReports                   |

---

## Design Choices

* **Dockerized setup** for consistent development and testing environment.
* **SQLite** database for simplicity (no credentials needed).
* **Redis + Celery** for asynchronous task execution.
* **Environment variables** managed via `.env` files.
* **Separation of concerns**: backend, worker, scheduler are separate services.
* **Frontend**: built with Vite + TypeScript, with hot module replacement and TanStack Query for state managemen

