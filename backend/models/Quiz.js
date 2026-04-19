import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
    {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
