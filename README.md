<p align="center">
  <img src="frontend/public/codolio_logo.svg" alt="Codolio Logo" width="80" />
</p>

<h1 align="center">Codolio — DSA Question Tracker</h1>

<p align="center">
  A full-stack DSA question tracker inspired by <a href="https://codolio.com">Codolio.com</a>, built for the <strong>Codolio Frontend Assessment</strong>.<br/>
  Organize, track, and conquer the <strong>Striver SDE Sheet</strong> with a premium, interactive UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot" alt="Spring Boot 4.1" />
  <img src="https://img.shields.io/badge/Java-21-red?logo=openjdk" alt="Java 21" />
  <img src="https://img.shields.io/badge/Zustand-5-orange" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Bonus Features](#-bonus-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-spring-boot)
  - [Frontend Setup](#2-frontend-react--vite)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Design Decisions](#-design-decisions)

---

## Overview

This project is a **full-stack DSA Question Tracker** that mirrors the core experience of Codolio's question tracking system. It allows users to organize DSA problems by topics and sub-topics, track solve progress, add personal notes, and manage their study sheet — all through a premium, responsive UI with a Spring Boot REST API backend.

The app ships pre-seeded with the complete **Striver SDE Sheet** (191 curated problems from TakeUForward) and gracefully falls back to local sample data if the backend is unavailable.

---

## Features

### Core Functionality
- **📂 Topic Management** — Create, rename, delete, and reorder DSA topic categories
- **📁 Sub-topic Support** — Nest sub-topics within topics for fine-grained organization
- **❓ Question CRUD** — Add, edit, delete questions with title, difficulty, and problem URL
- **✅ Solve Tracking** — Toggle solved/unsolved status per question with visual feedback
- **📊 Progress Tracking** — Real-time progress bars and percentage badges per topic
- **🔍 Search & Filter** — Full-text search across questions + difficulty filter chips (All / Easy / Medium / Hard)
- **🔀 Drag & Drop Reorder** — Reorder topics, sub-topics, and questions via drag-and-drop (powered by `@dnd-kit`)
- **💾 Backend Persistence** — All data persisted to H2 database via Spring Boot REST API
- **📱 Responsive Design** — Fully responsive from mobile to desktop

### Data & Connectivity
- **🌱 Auto Data Seeding** — Backend auto-seeds the complete Striver SDE Sheet on first launch
- **🔌 Offline Fallback** — If the backend is unreachable, the frontend loads from a local `sample-data.json` and operates in offline mode with optimistic updates
- **🟢 Connection Status** — Live indicator badge in the header shows **Connected** (green) or **Local** (amber)

---

## ⭐ Bonus Features

Beyond the core requirements, the following enhancements were implemented:

| Feature | Description |
|---|---|
| **🌗 Dark Mode** | Full light/dark theme toggle with class-based dark mode via Tailwind CSS v4 `@custom-variant`. Persists across session. |
| **🎨 Codolio-inspired Design System** | Premium UI with warm orange accent (`rgb(245,124,6)`), peach highlight backgrounds (`rgb(255,237,213)`), 3D card shadows, and 3D button effects |
| **📝 Question Detail Drawer** | Slide-in side panel for detailed question view — shows difficulty badge, platform icon, external links, and a personal notes editor with save functionality |
| **📝 Personal Notes** | Add and save notes per question (approach, complexity analysis, edge cases) via the detail drawer |
| **🎯 Concentric Progress Ring** | Hero section features SVG concentric ring visualization showing Easy/Medium/Hard solve ratios |
| **🎲 Pick a Random Problem** | One-click random unsolved question picker that opens the detail drawer and scrolls to the question |
| **🔥 Streak Counter** | Derived streak count displayed as a pill badge in the header |
| **🏷️ Platform Detection** | Auto-detects coding platform from problem URL (LeetCode, GeeksforGeeks, InterviewBit, SPOJ, TakeUForward) and shows platform icon |
| **🎥 Video Solution Links** | Quick-access video solution badges on question rows linking to YouTube walkthroughs |
| **📌 Notes Indicator** | Visual "📝 Notes" pill on questions that have personal notes attached |
| **✏️ Inline Editing** | Double-click any topic name or question title to edit in place |
| **🗑️ Contextual Actions** | Edit, delete, and info buttons with hover-reveal on each question row |
| **🏗️ Sub-topic Management** | Full CRUD for sub-topics nested within topics, with their own drag-and-drop reordering |
| **⚡ Optimistic Updates** | All mutations update the UI immediately, then sync to backend — no loading spinners on user actions |
| **🎭 Micro-animations** | Smooth transitions on expand/collapse, hover states, progress bars, and drawer open/close |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19.2 | UI component library |
| [Vite](https://vite.dev) | 8.2 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | Utility-first CSS framework |
| [Zustand](https://zustand.docs.pmnd.rs) | 5.0 | Lightweight state management |
| [@dnd-kit](https://dndkit.com) | 6.3 / 10.0 | Drag-and-drop toolkit |
| [Axios](https://axios-http.com) | 1.20 | HTTP client for API calls |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Spring Boot](https://spring.io/projects/spring-boot) | 4.1.1 | REST API framework |
| [Java](https://openjdk.org) | 21 | Runtime |
| [H2 Database](https://www.h2database.com) | (embedded) | In-memory SQL database |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | (managed) | ORM & repository layer |
| [Lombok](https://projectlombok.org) | (managed) | Boilerplate reduction |
| [Gradle](https://gradle.org) | 8.x | Build automation |

---

## 📁 Project Structure

```
codolio-assessment/
├── backend/                          # Spring Boot REST API
│   ├── build.gradle                  # Gradle build config
│   └── src/main/
│       ├── java/com/codolio/backend/
│       │   ├── BackendApplication.java
│       │   ├── config/
│       │   │   └── WebConfig.java        # CORS configuration
│       │   ├── controller/
│       │   │   ├── TopicController.java
│       │   │   ├── SubTopicController.java
│       │   │   ├── QuestionController.java
│       │   │   └── SheetController.java
│       │   ├── dto/                      # Data Transfer Objects
│       │   ├── entity/
│       │   │   ├── Topic.java
│       │   │   ├── SubTopic.java
│       │   │   ├── Question.java
│       │   │   ├── Sheet.java
│       │   │   ├── Problem.java
│       │   │   ├── Difficulty.java       # Enum
│       │   │   └── Platform.java         # Enum
│       │   ├── repository/               # JPA Repositories
│       │   └── service/
│       │       ├── TopicService.java
│       │       ├── SubTopicService.java
│       │       ├── QuestionService.java
│       │       ├── SheetService.java
│       │       ├── ProblemService.java
│       │       └── DataSeeder.java       # Auto-seeds Striver SDE data
│       └── resources/
│           └── application.properties
│
├── frontend/                         # React + Vite SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   ├── codolio_logo.svg
│   │   ├── favicon.svg
│   │   └── platform-icons/          # LeetCode, GFG, etc. SVG icons
│   └── src/
│       ├── main.jsx                  # Entry point
│       ├── App.jsx                   # Root layout + providers
│       ├── index.css                 # Tailwind + custom 3D utilities
│       ├── store/
│       │   └── useTrackerStore.js    # Zustand store (state + API calls)
│       ├── context/
│       │   ├── ThemeContext.jsx       # Dark mode provider
│       │   └── DrawerContext.jsx      # Question detail drawer state
│       ├── components/
│       │   ├── Header.jsx            # Brand, streak, search, theme toggle
│       │   ├── HeroSection.jsx       # Progress ring + random picker
│       │   ├── SearchBar.jsx         # Search input + difficulty chips
│       │   ├── TopicList.jsx         # DnD-wrapped topic list
│       │   ├── TopicItem.jsx         # Collapsible topic card
│       │   ├── SubTopicList.jsx      # DnD-wrapped sub-topic list
│       │   ├── SubTopicItem.jsx      # Sub-topic accordion
│       │   ├── QuestionList.jsx      # DnD-wrapped question list
│       │   ├── QuestionItem.jsx      # Question row with actions
│       │   └── QuestionDetailDrawer.jsx  # Slide-in detail panel
│       ├── utils/
│       │   └── platform.js           # URL → platform icon resolver
│       └── data/
│           └── sample-data.json      # Fallback dataset (Striver SDE)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | 18+ (LTS recommended) |
| **npm** | 9+ |
| **Java JDK** | 21+ |
| **Gradle** | 8.x (or use the included Gradle wrapper `./gradlew`) |

### 1. Backend (Spring Boot)

```bash
# Navigate to the backend directory
cd backend

# Run the Spring Boot application using the Gradle wrapper
./gradlew bootRun
```

> **Windows users:** Use `.\gradlew.bat bootRun` instead.

The backend will start on **http://localhost:8080** and automatically:
- Create an in-memory H2 database
- Seed the complete Striver SDE Sheet dataset (191 problems across 31 topics)

**H2 Console** is available at [http://localhost:8080/h2-console](http://localhost:8080/h2-console):
- JDBC URL: `jdbc:h2:mem:questiondb`
- Username: `sa`
- Password: *(leave empty)*

### 2. Frontend (React + Vite)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173** (default Vite port).

> **Note:** The frontend works even without the backend! It will gracefully fall back to the bundled `sample-data.json` and display a "Local" badge in the header. All CRUD operations work in-memory in this mode.

### Running Both Together

For the full experience, run both services simultaneously in separate terminals:

```bash
# Terminal 1 — Backend
cd backend && ./gradlew bootRun

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

All endpoints are prefixed with `/api` and served on `http://localhost:8080`.

### Topics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/topics` | List all topics |
| `POST` | `/api/topics` | Create a new topic |
| `PUT` | `/api/topics/{id}` | Update topic name |
| `DELETE` | `/api/topics/{id}` | Delete topic + its sub-topics and questions |
| `PUT` | `/api/topics/reorder` | Bulk reorder topics (array of `{id, position}`) |

### Sub-Topics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/subtopics` | List all sub-topics |
| `POST` | `/api/subtopics` | Create a new sub-topic |
| `PUT` | `/api/subtopics/{id}` | Update sub-topic name |
| `DELETE` | `/api/subtopics/{id}` | Delete sub-topic (questions reassigned) |
| `PUT` | `/api/subtopics/reorder` | Bulk reorder sub-topics |

### Questions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/questions` | List all questions |
| `POST` | `/api/questions` | Create a new question |
| `PUT` | `/api/questions/{id}` | Update question fields |
| `DELETE` | `/api/questions/{id}` | Delete a question |
| `PUT` | `/api/questions/reorder` | Bulk reorder questions |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ Contexts │  │ Zustand  │  │      Components        │ │
│  │ Theme    │  │  Store   │◄─┤ Header, HeroSection,   │ │
│  │ Drawer   │  │ (State)  │  │ TopicList, TopicItem,  │ │
│  └──────────┘  └────┬─────┘  │ SubTopicList/Item,     │ │
│                     │        │ QuestionList/Item,      │ │
│                     │ Axios  │ QuestionDetailDrawer,   │ │
│                     ▼        │ SearchBar               │ │
│              ┌──────────┐    └────────────────────────┘ │
│              │ REST API │                                │
└──────────────┴────┬─────┴────────────────────────────────┘
                    │ HTTP (localhost:8080)
┌───────────────────▼─────────────────────────────────────┐
│               Spring Boot Backend                        │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ Controllers │──│  Services  │──│  JPA Repos       │  │
│  │ Topic       │  │ Topic      │  │ TopicRepository  │  │
│  │ SubTopic    │  │ SubTopic   │  │ SubTopicRepo     │  │
│  │ Question    │  │ Question   │  │ QuestionRepo     │  │
│  │ Sheet       │  │ Sheet      │  │ SheetRepository  │  │
│  └─────────────┘  │ DataSeeder │  └────────┬─────────┘  │
│                    └────────────┘           │             │
│                                     ┌──────▼──────┐     │
│                                     │ H2 Database │     │
│                                     │ (in-memory) │     │
│                                     └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns

- **Optimistic Updates** — UI mutates instantly via Zustand, then fires async API call. If the backend is down, the change persists in-memory.
- **Graceful Degradation** — `fetchAll()` tries the API first; on failure, parses `sample-data.json` and operates fully offline.
- **Centralized State** — Single Zustand store manages all topics, sub-topics, questions, search, and filter state.
- **Context Isolation** — Theme and Drawer contexts are separate from data state to avoid unnecessary re-renders.

---

## 🎨 Screenshots

> Launch the app to see the full UI. Key visual highlights:

- **Light Theme** — Clean white backgrounds with warm orange accents and 3D card shadows
- **Dark Theme** — Rich zinc-900 backgrounds with preserved accent colors
- **Concentric Progress Ring** — SVG rings showing Easy (green), Medium (amber), Hard (red) solve ratios
- **3D Button & Card Effects** — Raised buttons with bottom shadow that press down on click
- **Question Detail Drawer** — Slide-in panel with platform icon, difficulty badge, solve link, and notes editor

---

## 💡 Design Decisions

1. **Tailwind CSS v4** — Used the latest Tailwind with `@import "tailwindcss"` and `@custom-variant dark` for class-based dark mode support.

2. **Zustand over Redux** — Chosen for its minimal API surface and React 19 compatibility. The entire app state fits in a single store file (~280 lines).

3. **@dnd-kit over react-beautiful-dnd** — `react-beautiful-dnd` is deprecated and incompatible with React 19. `@dnd-kit` provides a modern, modular drag-and-drop system with excellent accessibility.

4. **H2 In-Memory Database** — Zero setup required. Data auto-seeds on each application start, making the app instantly runnable without external database configuration.

5. **Platform Icon Detection** — Problem URLs are parsed to auto-detect the coding platform (LeetCode, GFG, etc.) and display the appropriate icon, matching Codolio's UX.

6. **Offline-First Architecture** — The frontend bundles a complete `sample-data.json` so reviewers can evaluate the full UI without running the backend.

---

<p align="center">
  Built with ❤️ for the <strong>Codolio Assessment</strong>
</p>
