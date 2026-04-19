# Quick Setup Guide

This guide will walk you through setting up the **Speak Ease** MERN stack project smoothly on any operating system (Windows, Mac, or Linux).

## Prerequisites
- **Node.js**: Ensure Node.js (v18+) is installed.
- **MongoDB**: You need either an active MongoDB Atlas cluster URI or a local MongoDB instance running.

---

## 1. Backend Setup

The backend runs on an Express server on port `8000`.

**Open your terminal (PowerShell/Command Prompt on Windows, Terminal on Mac/Linux):**

```bash
cd backend
npm install
```

**Environment Variables**
Create a `.env` file in the `backend/` directory by copying the `.env.example` file. 

*On Windows:*
```cmd
copy .env.example .env
```
*On Mac/Linux:*
```bash
cp .env.example .env
```

Open `.env` and fill in your `MONGO_URI`. If you are using a local MongoDB, `mongodb://127.0.0.1:27017/speakease` works perfectly. If you are using Mongo Atlas, paste your connection string.

**Seed the Database (One-time only)**
This populates the database with default languages and lessons.
```bash
node seed.js
```

**Start the Server**
```bash
npm start
```
*The server will successfully connect to MongoDB and listen on port 8000.*

---

## 2. Frontend Setup

The frontend uses React and Vite and runs on port `5173`. 

**Open a NEW, separate terminal window/tab:**

```bash
cd frontend
npm install --legacy-peer-deps
```
*(Note: `--legacy-peer-deps` is required to gracefully handle React 19's brand-new ecosystem upgrades alongside UI components like lucide-react).*

**Start the Frontend Application**
```bash
npm run dev
```

You're done! Navigate to `http://localhost:5173` in your browser to experience Speak Ease.
