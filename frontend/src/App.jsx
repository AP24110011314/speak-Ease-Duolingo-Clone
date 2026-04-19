import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson/:languageId" element={<LessonView />} />
          <Route path="/quiz/:lessonId" element={<QuizView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
