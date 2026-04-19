import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Flame, Trophy, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [languages, setLanguages] = useState([]);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchData = async () => {
            try {
                const langRes = await fetch('http://localhost:8000/api/courses/languages');
                const langData = await langRes.json();
                setLanguages(langData);

                const progRes = await fetch('http://localhost:8000/api/courses/progress', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (progRes.ok) {
                    const progData = await progRes.json();
                    setProgress(progData);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, [user, navigate]);

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Speak Ease</h1>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent-peach)' }}>
                        <Flame fill="var(--accent-peach)" size={28} /> {progress?.streakDays || 0}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'orange' }}>
                        <Trophy fill="orange" size={28} /> {progress?.quizScore || 0} XP
                    </div>
                    <button className="neo-btn" onClick={logout} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: 'var(--bg-secondary)' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="neo-container">
                <div className="neo-box" style={{ background: 'var(--accent-purple)', color: 'white', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Jump back in, {user?.name}!</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Consistency is key. Keep up your streak.</p>
                </div>

                <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Choose a Language</h2>
                <div className="neo-grid">
                    {languages.map((lang) => (
                        <Link to={`/lesson/${lang._id}`} key={lang._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="neo-box" style={{ background: 'var(--accent-lime)', cursor: 'pointer' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{lang.languageName}</h3>
                                <p style={{ fontWeight: 'bold' }}>{lang.level}</p>
                                <p style={{ marginTop: '1rem' }}>{lang.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
