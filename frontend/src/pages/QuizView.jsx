import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Check, X } from 'lucide-react';

const QuizView = () => {
    const { lessonId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8000/api/courses/quizzes/${lessonId}`)
            .then(res => res.json())
            .then(data => setQuizzes(data))
            .catch(err => console.error(err));
    }, [lessonId, user, navigate]);

    const handleAnswer = (option) => {
        if (feedback !== null) return; // Prevent multiple clicks

        const isCorrect = option === quizzes[currentIndex].correctAnswer;
        setFeedback(isCorrect ? 'correct' : 'wrong');
        
        if (isCorrect) {
            setScore(prev => prev + 10);
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex + 1 < quizzes.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                finishQuiz(score + (isCorrect ? 10 : 0));
            }
        }, 1500);
    };

    const finishQuiz = async (finalScore) => {
        setIsFinished(true);
        try {
            await fetch('http://localhost:8000/api/courses/progress', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ lessonId, score: finalScore })
            });
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    };

    if (quizzes.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Quiz...</div>;

    if (isFinished) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="neo-box animate-pop" style={{ textAlign: 'center', background: 'var(--accent-lime)' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Great Job!</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>You earned {score} XP.</p>
                    <button onClick={() => navigate('/dashboard')} className="neo-btn" style={{ background: 'white' }}>
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    const currentQuiz = quizzes[currentIndex];

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem', height: '16px', background: 'white', border: 'var(--border-thick)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((currentIndex) / quizzes.length) * 100}%`, background: 'var(--accent-lime)', transition: 'width 0.3s ease' }}></div>
            </div>

            <div className="neo-box animate-slide" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{currentQuiz.question}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {currentQuiz.options.map((option, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAnswer(option)}
                            className="neo-box" 
                            style={{ 
                                cursor: 'pointer', 
                                border: 'var(--border-thick)', 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold',
                                background: feedback ? (option === currentQuiz.correctAnswer ? 'var(--accent-lime)' : '#ffcccc') : 'white',
                                pointerEvents: feedback ? 'none' : 'auto'
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {feedback && (
                    <div className="animate-slide" style={{ marginTop: '2rem', padding: '1.5rem', background: feedback === 'correct' ? 'var(--accent-lime)' : 'var(--accent-peach)', border: 'var(--border-thick)', borderRadius: 'var(--radius-chunky)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {feedback === 'correct' ? <Check size={32} /> : <X size={32} />}
                        <h3 style={{ fontSize: '1.5rem' }}>{feedback === 'correct' ? 'Excellent!' : `Correct answer: ${currentQuiz.correctAnswer}`}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizView;
