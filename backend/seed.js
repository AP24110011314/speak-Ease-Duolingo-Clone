import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Language from './models/Language.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';
import User from './models/User.js';
import Progress from './models/Progress.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/speakease');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();
        await Language.deleteMany();
        await Lesson.deleteMany();
        await Quiz.deleteMany();
        await User.deleteMany();
        await Progress.deleteMany();

        const lang = await Language.create({
            languageName: 'Spanish',
            level: 'Beginner',
            description: 'Basic Spanish lessons for beginners'
        });

        const lesson = await Lesson.create({
            title: 'Greetings in Spanish',
            description: 'Learn basic greetings and introductions',
            languageId: lang._id,
            difficulty: 'Beginner',
            content: [
                { word: 'Hola', translation: 'Hello' },
                { word: 'Buenos días', translation: 'Good morning' },
                { word: 'Adiós', translation: 'Goodbye' }
            ]
        });

        await Quiz.insertMany([
            {
                lessonId: lesson._id,
                question: 'What is the Spanish word for Hello?',
                options: ['Hola', 'Bonjour', 'Ciao', 'Hallo'],
                correctAnswer: 'Hola'
            },
            {
                lessonId: lesson._id,
                question: 'What does "Buenos días" mean?',
                options: ['Good evening', 'Good morning', 'Goodbye', 'Good night'],
                correctAnswer: 'Good morning'
            }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
