import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        languageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Language', required: true },
        difficulty: { type: String, required: true },
        content: [{ word: String, translation: String }] // simplified vocabulary array
    },
    { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
