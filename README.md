# Speak Ease (Language Learning Platform)

![Home Page](frontend/public/images/home.png)

Speak Ease is a comprehensive, gamified language learning platform inspired by popular apps like Duolingo. Built entirely on the MERN stack (MongoDB, Express, React, Node.js), it offers a highly engaging environment for users to learn new languages through interactive lessons, quizzes, and vocabulary tracking.

The application features a premium, high-contrast **"Neo-Brutalist Gamified"** frontend design. By leveraging bespoke CSS variables and dynamic animations, the UI delivers an exciting and visually striking experience that stands out from generic templates.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
  - [Implemented Core Features](#implemented-core-features)
  - [Advanced Features (To Build)](#advanced-features-to-build)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Testing](#testing)

---

## Demo Videos

1. [Frontend Code Explained](https://drive.google.com/file/d/1BjQKp_uvH1C4bOfq_mgT2SBq_SXCg0IV/view?usp=drivesdk)
2. [Backend Code Explained](https://drive.google.com/file/d/1leqmBjKNvMwNSxcvvK3svAr_ejVhygyX/view?usp=drivesdk)
3. [App Working](https://drive.google.com/file/d/1MvMFGkYpaFmhAC2t-6aXB00LUMQZAFkZ/view?usp=drivesdk)

---

## Tech Stack

**Frontend**
- React 19 (Hooks, Context API)
- Vite (Build Tool & Dev Server)
- React Router DOM (Routing)
- Lucide React (Icons)
- Vanilla CSS (Custom Design System & Neo-Brutalist styling)

**Backend**
- Node.js & Express.js (RESTful API)
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) & BcryptJS (Authentication & Security)
- Jest & Supertest (Testing)

---

## Key Features

### Implemented Core Features

#### User Authentication
Secure JWT-based Login and Registration with encrypted passwords.
![Register](frontend/public/images/register.png)

#### Language Selection
Browse, preview, and select languages to start learning.
![User Landing Page](frontend/public/images/user-landing-page.png)

#### Lesson Modules
Navigate structured, categorized learning pathways.
![Modules](frontend/public/images/modules.png)

#### Quizzes & Vocabulary
Interactive flashcard and multiple-choice quizzes with instant visual feedback and bouncy animations.
![Quiz](frontend/public/images/quiz.png)

#### Admin Dashboard
A secure panel for administrators to visually manage courses, lessons, and questions.
![Admin Dashboard](frontend/public/images/admin-dashboard.png)

*Add Language:*
![Add Language](frontend/public/images/add-language.png)

*Add Lesson:*
![Add Lesson](frontend/public/images/add-lesson.png)

*Add Quizzes:*
![Add Quizzes](frontend/public/images/add-quizes.png)

#### Progress Tracking
Tracks user XP and daily streak, securely saved to the database.

#### Custom UI/UX
A tailored design system mapping vivid, high-contrast colors to engaging interactive elements.

### Advanced Features (To Build)
- **Leaderboard System:** Compare your XP and lesson streak with your friends globally.
- **Audio & Pronunciation:** Speech Recognition and interactive listening exercises.
- **AI-Based Recommendations:** Generative dynamic questions tailored to the areas where the user struggles most.
- **Multi-language Interface:** Translating the actual website UI for different native tongues.

---

## Project Architecture

```text
speak-Ease-Duolingo-Clone/
├── backend/                  # Express server & API
│   ├── models/               # Mongoose schemas (User, Lesson, etc.)
│   ├── routes/               # API endpoint definitions
│   ├── controllers/          # Request handling logic
│   ├── middleware/           # Auth and error handlers
│   ├── package.json          # Backend dependencies
│   └── server.js             # Entry point
├── frontend/                 # React UI
│   ├── src/                  # React components, pages, and hooks
│   ├── public/               # Static assets
│   ├── index.css             # Global Neo-Brutalist styling
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── README.md                 # Project documentation
└── setup.md                  # Quick setup guide
```

---

## Getting Started

Follow these instructions to set up the project locally. For a more visual cross-platform guide, please refer to the [setup.md](setup.md) file.

### Prerequisites
- **Node.js**: v18.0.0 or higher.
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas URI.

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/AP24110011314/speak-Ease-Duolingo-Clone.git
cd speak-Ease-Duolingo-Clone
```

**2. Setup Backend**
```bash
cd backend
npm install
```
Create a `.env` file from the example and configure your environment variables:
```bash
cp .env.example .env
```
Ensure your `MONGO_URI` is correctly set in `.env` (e.g., `mongodb://127.0.0.1:27017/speakease`). Next, seed the database with initial languages and lessons:
```bash
node seed.js
```
Start the backend server:
```bash
npm start
```

**3. Setup Frontend**
Open a new terminal window:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Navigate to `http://localhost:5173` in your browser to start learning!

---

## Available Scripts

In the **backend** directory:
- `npm start`: Runs the production server.
- `npm run dev`: Runs the server in watch mode using native node watch.
- `npm test`: Runs the Jest test suite.

In the **frontend** directory:
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the React app for production.
- `npm run lint`: Runs ESLint for code quality.

---

## Testing

The backend is fully equipped with an automated test suite using **Jest** and **Supertest** along with an in-memory MongoDB server (`mongodb-memory-server`) to ensure robust API endpoints without affecting your development database.

To run tests:
```bash
cd backend
npm test
```
