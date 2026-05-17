import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Users, Search, UserPlus, UserMinus, ArrowLeft, Flame, Medal } from 'lucide-react';

const Leaderboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [leaderboard, setLeaderboard] = useState([]);
    const [view, setView] = useState('global'); // 'global' or 'friends'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchLeaderboard();
    }, [user, view, navigate]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const endpoint = view === 'global' ? '/api/users/leaderboard' : '/api/users/leaderboard/friends';
            const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/search?keyword=${query}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Search error", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const followUser = async (targetId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/follow/${targetId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                // Refresh data
                if (view === 'friends') fetchLeaderboard();
                // If in search, we might want to update local state or just refetch
            }
        } catch (error) {
            console.error("Follow error", error);
        }
    };

    const unfollowUser = async (targetId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/unfollow/${targetId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                fetchLeaderboard();
            }
        } catch (error) {
            console.error("Unfollow error", error);
        }
    };

    // Helper to render rank icons
    const getRankIcon = (index) => {
        if (index === 0) return <Trophy color="#FFD700" size={32} />;
        if (index === 1) return <Medal color="#C0C0C0" size={32} />;
        if (index === 2) return <Medal color="#CD7F32" size={32} />;
        return <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{index + 1}</span>;
    };

    const topThree = leaderboard.slice(0, 3);
    const restOfUsers = leaderboard.slice(3);

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
            <div className="neo-container">
                <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <button className="neo-btn" onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem', borderRadius: '50%' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>Leaderboard</h1>
                </header>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                    <button 
                        className={`neo-btn ${view === 'global' ? '' : 'neo-btn-secondary'}`} 
                        onClick={() => setView('global')}
                        style={{ flex: 1 }}
                    >
                        <Trophy size={20} /> Global
                    </button>
                    <button 
                        className={`neo-btn ${view === 'friends' ? '' : 'neo-btn-secondary'}`} 
                        onClick={() => setView('friends')}
                        style={{ flex: 1, background: view === 'friends' ? 'var(--accent-purple)' : 'var(--accent-blue)', color: 'white' }}
                    >
                        <Users size={20} /> Friends
                    </button>
                </div>

                {/* Top 3 Spotlight */}
                {!loading && leaderboard.length > 0 && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'flex-end', 
                        justifyContent: 'center', 
                        gap: '1rem', 
                        marginBottom: '4rem',
                        padding: '2rem 0'
                    }}>
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="neo-box animate-pop" style={{ 
                                background: 'white', 
                                height: '240px', 
                                width: '180px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}>
                                <Medal color="#C0C0C0" size={48} />
                                <h3 style={{ marginTop: '0.5rem' }}>{topThree[1].userId.name}</h3>
                                <p style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{topThree[1].quizScore} XP</p>
                            </div>
                        )}
                        {/* 1st Place */}
                        {topThree[0] && (
                            <div className="neo-box animate-pop" style={{ 
                                background: 'var(--accent-lime)', 
                                height: '300px', 
                                width: '220px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                textAlign: 'center',
                                transform: 'scale(1.1)',
                                zIndex: 2
                            }}>
                                <Trophy color="#121212" size={64} fill="#FFD700" />
                                <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>{topThree[0].userId.name}</h2>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{topThree[0].quizScore} XP</p>
                            </div>
                        )}
                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="neo-box animate-pop" style={{ 
                                background: 'white', 
                                height: '200px', 
                                width: '180px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}>
                                <Medal color="#CD7F32" size={48} />
                                <h3 style={{ marginTop: '0.5rem' }}>{topThree[2].userId.name}</h3>
                                <p style={{ fontWeight: 'bold', color: 'var(--accent-peach)' }}>{topThree[2].quizScore} XP</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Rest of Users List */}
                <div className="neo-box" style={{ background: 'white', padding: '1rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <h2 className="animate-pulse">Loading legends...</h2>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>No one here yet!</h2>
                            <p>Be the first to claim the throne.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {restOfUsers.map((entry, index) => (
                                <div key={entry._id} className="animate-slide" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '1rem 1.5rem', 
                                    border: '3px solid #121212', 
                                    borderRadius: '12px',
                                    background: entry.userId._id === user._id ? 'var(--bg-secondary)' : 'white',
                                    transition: 'var(--transition-bounce)',
                                    cursor: 'default'
                                }}>
                                    <div style={{ width: '50px', textAlign: 'center' }}>
                                        {getRankIcon(index + 3)}
                                    </div>
                                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                                        <h3 style={{ margin: 0 }}>{entry.userId.name}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 'bold', opacity: 0.8 }}>
                                            <span style={{ color: 'var(--accent-purple)' }}>{entry.quizScore} XP</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-peach)' }}>
                                                <Flame size={14} fill="var(--accent-peach)" /> {entry.streakDays} Day Streak
                                            </span>
                                        </div>
                                    </div>
                                    {entry.userId._id !== user._id && view === 'friends' && (
                                        <button className="neo-btn" onClick={() => unfollowUser(entry.userId._id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--accent-peach)' }}>
                                            Unfollow
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Social Section */}
                <div style={{ marginTop: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Find Friends</h2>
                    <div style={{ position: 'relative', marginBottom: '2rem' }}>
                        <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input 
                            type="text" 
                            className="neo-input" 
                            placeholder="Search by name or email..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{ paddingLeft: '3.5rem' }}
                        />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="neo-grid animate-slide">
                            {searchResults.map(u => (
                                <div key={u._id} className="neo-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{u.name}</h3>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{u.email}</p>
                                    </div>
                                    <button 
                                        className="neo-btn" 
                                        onClick={() => followUser(u._id)}
                                        style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}
                                    >
                                        <UserPlus size={18} /> Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
