import mongoose from 'mongoose';

const progressSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        quizScore: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        badges: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model('Progress', progressSchema);
