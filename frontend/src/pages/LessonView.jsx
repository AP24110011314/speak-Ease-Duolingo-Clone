import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Play } from 'lucide-react';

const LessonView = () => {
    const { languageId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        fetch(`http://localhost:8000/api/courses/lessons/${languageId}`)
            .then(res => res.json())
            .then(data => setLessons(data))
            .catch(err => console.error(err));
    }, [languageId, user, navigate]);

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', background: '#e0f7fa' }}>
             <header style={{ marginBottom: '2rem' }}>
                <Link to="/dashboard" className="neo-btn" style={{ background: 'white' }}>
                    <ArrowLeft /> Back
                </Link>
            </header>

            <div className="neo-container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Pathways</h1>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    {lessons.map((lesson, index) => (
                        <div key={lesson._id} className="neo-box animate-slide" style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: index % 2 === 0 ? 'var(--accent-lime)' : 'var(--accent-peach)' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem' }}>{lesson.title}</h2>
                                <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{lesson.description}</p>
                            </div>
                            <Link to={`/quiz/${lesson._id}`} className="neo-btn" style={{ padding: '1rem', borderRadius: '50%', width: '60px', height: '60px', background: 'white' }}>
                                <Play fill="black" />
                            </Link>
                        </div>
                    ))}
                    {lessons.length === 0 && <p>No lessons available for this language yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default LessonView;
