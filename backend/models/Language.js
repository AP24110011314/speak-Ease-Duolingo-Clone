import mongoose from 'mongoose';

const languageSchema = mongoose.Schema(
    {
        languageName: { type: String, required: true },
        level: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Language', languageSchema);
