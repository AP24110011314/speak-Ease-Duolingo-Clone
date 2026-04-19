import Language from '../models/Language.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';

export const getLanguages = async (req, res) => {
    try {
        const languages = await Language.find({});
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLessonsByLanguage = async (req, res) => {
    try {
        const lessons = await Lesson.find({ languageId: req.params.languageId });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuizzesByLesson = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ lessonId: req.params.lessonId });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProgress = async (req, res) => {
    try {
        // middleware will inject req.user
        const progress = await Progress.findOne({ userId: req.user._id }).populate('completedLessons');
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { lessonId, score } = req.body;
        const progress = await Progress.findOne({ userId: req.user._id });

        if (lessonId && !progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }
        if (score) {
            progress.quizScore += score;
        }

        // naive streak update
        progress.streakDays = progress.streakDays > 0 ? progress.streakDays : 1;
        
        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
