import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password };
        
        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            if (res.ok) {
                login(data);
                navigate('/dashboard');
            } else {
                alert(data.message || 'Error occurred');
            }
        } catch (error) {
            alert('Failed to connect to server');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="neo-box animate-pop" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
                    {isLogin ? 'Welcome Back!' : 'Create Profile'}
                </h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isLogin && (
                        <input 
                            type="text" 
                            className="neo-input" 
                            placeholder="Your Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        className="neo-input" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="neo-input" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" className="neo-btn" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent-purple)' }}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </p>
            </div>
        </div>
    );
};

export default Login;
