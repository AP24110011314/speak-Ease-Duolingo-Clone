import express from 'express';
import { getLanguages, getLessonsByLanguage, getQuizzesByLesson, getProgress, updateProgress } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/languages', getLanguages);
router.get('/lessons/:languageId', getLessonsByLanguage);
router.get('/quizzes/:lessonId', getQuizzesByLesson);

router.get('/progress', protect, getProgress);
router.post('/progress', protect, updateProgress);

export default router;
