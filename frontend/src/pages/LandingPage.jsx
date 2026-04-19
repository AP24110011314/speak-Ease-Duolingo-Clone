import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="neo-box animate-pop" style={{ maxWidth: '800px', width: '90%', padding: '4rem 2rem' }}>
                <Globe size={64} color="var(--accent-purple)" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Speak Ease</h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', fontWeight: 600 }}>The fun, free, and effective way to learn a language!</p>
                
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/login" className="neo-btn" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
                        Get Started <ArrowRight size={24} />
                    </Link>
                    <Link to="/login" className="neo-btn neo-btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
                        I already have an account
                    </Link>
                </div>
            </div>
            
            <div className="animate-slide" style={{ marginTop: '4rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                    { label: 'Spanish', color: 'var(--accent-lime)' },
                    { label: 'French', color: 'var(--accent-blue)' },
                    { label: 'German', color: 'var(--accent-peach)' }
                ].map((lang) => (
                    <div key={lang.label} className="neo-box" style={{ padding: '1rem 2rem', background: lang.color, transform: 'rotate(-2deg)' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>{lang.label}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
