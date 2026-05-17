import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, Save, X } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('languages');
    const [loading, setLoading] = useState(true);

    const [languages, setLanguages] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            fetchLanguages();
        }
    }, [user, navigate]);

    useEffect(() => {
        if (selectedLanguage) fetchLessons(selectedLanguage);
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLesson) fetchQuizzes(selectedLesson);
    }, [selectedLesson]);

    const authFetch = async (url, options = {}) => {
        const userInfoStr = localStorage.getItem('userInfo');
        const token = userInfoStr ? JSON.parse(userInfoStr).token : null;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        });
        if (!res.ok) throw new Error('API Request Failed');
        return res;
    };

    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/languages`);
            setLanguages(await res.json());
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchLessons = async (langId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/lessons/${langId}`);
            setLessons(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchQuizzes = async (lessonId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/quizzes/${lessonId}`);
            setQuizzes(await res.json());
        } catch (err) { console.error(err); }
    };

    // --- LANGUAGE CRUD ---
    const [langForm, setLangForm] = useState({ languageName: '', level: '', description: '' });
    const [editingLang, setEditingLang] = useState(null);

    const handleLangSubmit = async (e) => {
        e.preventDefault();
        if (editingLang) await authFetch(`/languages/${editingLang._id}`, { method: 'PUT', body: JSON.stringify(langForm) });
        else await authFetch('/languages', { method: 'POST', body: JSON.stringify(langForm) });
        setLangForm({ languageName: '', level: '', description: '' }); setEditingLang(null);
        fetchLanguages();
    };

    const deleteLanguage = async (id) => {
        if (!window.confirm('Delete language?')) return;
        await authFetch(`/languages/${id}`, { method: 'DELETE' });
        fetchLanguages();
    };

    // --- LESSON CRUD ---
    const [lessonForm, setLessonForm] = useState({ title: '', description: '', difficulty: 'Beginner', contentStr: '' });
    const [editingLesson, setEditingLesson] = useState(null);

    const handleLessonSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLanguage) return alert('Select a language first');
        
        // Parse content string "Word:Translation, Word2:Translation2"
        const contentArr = lessonForm.contentStr.split(',').map(pair => {
            const [word, translation] = pair.split(':');
            return { word: word?.trim(), translation: translation?.trim() };
        }).filter(item => item.word && item.translation);

        const payload = { ...lessonForm, languageId: selectedLanguage, content: contentArr };

        if (editingLesson) await authFetch(`/lessons/${editingLesson._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        else await authFetch('/lessons', { method: 'POST', body: JSON.stringify(payload) });
        
        setLessonForm({ title: '', description: '', difficulty: 'Beginner', contentStr: '' }); setEditingLesson(null);
        fetchLessons(selectedLanguage);
    };

    const deleteLesson = async (id) => {
        if (!window.confirm('Delete lesson?')) return;
        await authFetch(`/lessons/${id}`, { method: 'DELETE' });
        fetchLessons(selectedLanguage);
    };

    // --- QUIZ CRUD ---
    const [quizForm, setQuizForm] = useState({ question: '', optionsStr: '', correctAnswer: '' });
    const [editingQuiz, setEditingQuiz] = useState(null);

    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLesson) return alert('Select a lesson first');
        
        const optionsArr = quizForm.optionsStr.split(',').map(o => o.trim());
        const payload = { ...quizForm, lessonId: selectedLesson, options: optionsArr };

        if (editingQuiz) await authFetch(`/quizzes/${editingQuiz._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        else await authFetch('/quizzes', { method: 'POST', body: JSON.stringify(payload) });
        
        setQuizForm({ question: '', optionsStr: '', correctAnswer: '' }); setEditingQuiz(null);
        fetchQuizzes(selectedLesson);
    };

    const deleteQuiz = async (id) => {
        if (!window.confirm('Delete quiz?')) return;
        await authFetch(`/quizzes/${id}`, { method: 'DELETE' });
        fetchQuizzes(selectedLesson);
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                <button className="neo-btn neo-btn-secondary" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </header>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className={`neo-btn ${activeTab === 'languages' ? '' : 'neo-btn-secondary'}`} onClick={() => setActiveTab('languages')}>Languages</button>
                <button className={`neo-btn ${activeTab === 'lessons' ? '' : 'neo-btn-secondary'}`} onClick={() => setActiveTab('lessons')}>Lessons</button>
                <button className={`neo-btn ${activeTab === 'quizzes' ? '' : 'neo-btn-secondary'}`} onClick={() => setActiveTab('quizzes')}>Quizzes</button>
            </div>

            {/* LANGUAGES TAB */}
            {activeTab === 'languages' && (
                <div>
                    <form className="neo-box" onSubmit={handleLangSubmit} style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3>{editingLang ? 'Edit Language' : 'Add Language'}</h3>
                        <input className="neo-input" placeholder="Language Name" value={langForm.languageName} onChange={e => setLangForm({...langForm, languageName: e.target.value})} required />
                        <input className="neo-input" placeholder="Level" value={langForm.level} onChange={e => setLangForm({...langForm, level: e.target.value})} required />
                        <textarea className="neo-input" placeholder="Description" value={langForm.description} onChange={e => setLangForm({...langForm, description: e.target.value})} required />
                        <div><button type="submit" className="neo-btn">{editingLang ? 'Update' : 'Create'}</button></div>
                    </form>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {languages.map(l => (
                            <div key={l._id} className="neo-box" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div><strong>{l.languageName}</strong> - {l.level}</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="neo-btn neo-btn-secondary" style={{ padding: '0.5rem' }} onClick={() => {setEditingLang(l); setLangForm(l)}}><Edit size={16}/></button>
                                    <button className="neo-btn" style={{ padding: '0.5rem', background: 'var(--accent-red)' }} onClick={() => deleteLanguage(l._id)}><Trash size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LESSONS TAB */}
            {activeTab === 'lessons' && (
                <div>
                    <select className="neo-input" style={{ marginBottom: '2rem' }} value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                        <option value="">Select a Language...</option>
                        {languages.map(l => <option key={l._id} value={l._id}>{l.languageName}</option>)}
                    </select>

                    {selectedLanguage && (
                        <>
                            <form className="neo-box" onSubmit={handleLessonSubmit} style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h3>
                                <input className="neo-input" placeholder="Title" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required />
                                <input className="neo-input" placeholder="Difficulty" value={lessonForm.difficulty} onChange={e => setLessonForm({...lessonForm, difficulty: e.target.value})} required />
                                <textarea className="neo-input" placeholder="Description" value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})} required />
                                <textarea className="neo-input" placeholder="Content (Word:Translation, Word2:Translation2)" value={lessonForm.contentStr} onChange={e => setLessonForm({...lessonForm, contentStr: e.target.value})} required />
                                <div><button type="submit" className="neo-btn">{editingLesson ? 'Update' : 'Create'}</button></div>
                            </form>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {lessons.map(l => (
                                    <div key={l._id} className="neo-box" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div><strong>{l.title}</strong> - {l.difficulty}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="neo-btn neo-btn-secondary" style={{ padding: '0.5rem' }} onClick={() => {
                                                setEditingLesson(l); 
                                                const contentStr = l.content.map(c => `${c.word}:${c.translation}`).join(', ');
                                                setLessonForm({...l, contentStr});
                                            }}><Edit size={16}/></button>
                                            <button className="neo-btn" style={{ padding: '0.5rem', background: 'var(--accent-red)' }} onClick={() => deleteLesson(l._id)}><Trash size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* QUIZZES TAB */}
            {activeTab === 'quizzes' && (
                <div>
                    <select className="neo-input" style={{ marginBottom: '1rem' }} value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                        <option value="">Select a Language...</option>
                        {languages.map(l => <option key={l._id} value={l._id}>{l.languageName}</option>)}
                    </select>
                    {selectedLanguage && (
                        <select className="neo-input" style={{ marginBottom: '2rem' }} value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)}>
                            <option value="">Select a Lesson...</option>
                            {lessons.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}
                        </select>
                    )}

                    {selectedLesson && (
                        <>
                            <form className="neo-box" onSubmit={handleQuizSubmit} style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3>{editingQuiz ? 'Edit Quiz' : 'Add Quiz Question'}</h3>
                                <input className="neo-input" placeholder="Question" value={quizForm.question} onChange={e => setQuizForm({...quizForm, question: e.target.value})} required />
                                <input className="neo-input" placeholder="Options (comma separated)" value={quizForm.optionsStr} onChange={e => setQuizForm({...quizForm, optionsStr: e.target.value})} required />
                                <input className="neo-input" placeholder="Correct Answer" value={quizForm.correctAnswer} onChange={e => setQuizForm({...quizForm, correctAnswer: e.target.value})} required />
                                <div><button type="submit" className="neo-btn">{editingQuiz ? 'Update' : 'Create'}</button></div>
                            </form>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {quizzes.map(q => (
                                    <div key={q._id} className="neo-box" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div><strong>{q.question}</strong><br/>Ans: {q.correctAnswer}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="neo-btn neo-btn-secondary" style={{ padding: '0.5rem' }} onClick={() => {
                                                setEditingQuiz(q); 
                                                setQuizForm({...q, optionsStr: q.options.join(', ')});
                                            }}><Edit size={16}/></button>
                                            <button className="neo-btn" style={{ padding: '0.5rem', background: 'var(--accent-red)' }} onClick={() => deleteQuiz(q._id)}><Trash size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
