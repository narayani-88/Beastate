import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiHome } from 'react-icons/fi'

export default function LoginModal({ onClose, initialMode = 'login', onSuccess }) {
    const { login, register } = useAuth()
    const [mode, setMode] = useState(initialMode) // 'login' | 'register'
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            if (mode === 'login') {
                await login(form.email, form.password)
            } else {
                await register(form.username, form.email, form.password)
            }
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" style={{ animation: 'slideUp 0.25s ease' }}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-logo">
                        <div className="modal-logo-icon">B</div>
                        <span>Beastate</span>
                    </div>
                    <button className="modal-close" onClick={onClose}><FiX size={20} /></button>
                </div>

                {/* Title */}
                <div className="modal-title-section">
                    <h2>{mode === 'login' ? 'Welcome back' : 'Join Beastate'}</h2>
                    <p>{mode === 'login' ? 'Sign in to save properties and contact agents' : 'Create your free account today'}</p>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>Sign In</button>
                    <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError('') }}>Sign Up</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" size={16} />
                                <input
                                    name="username"
                                    type="text"
                                    className="form-input input-with-icon"
                                    placeholder="Rajesh Kumar"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" size={16} />
                            <input
                                name="email"
                                type="email"
                                className="form-input input-with-icon"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" size={16} />
                            <input
                                name="password"
                                type={showPw ? 'text' : 'password'}
                                className="form-input input-with-icon"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? <span className="spinner" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>

            <style>{`
        .modal-box {
          background: var(--bg-card);
          border: 1px solid var(--border-hover);
          border-radius: var(--radius-xl);
          padding: 32px;
          width: 100%;
          max-width: 440px;
          margin: 16px;
          position: relative;
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
        }
        .modal-logo { display: flex; align-items: center; gap: 9px; font-size: 1.05rem; font-weight: 800; }
        .modal-logo-icon {
          width: 30px; height: 30px; background: var(--accent); border-radius: 7px;
          display: flex; align-items: center; justify-content: center; font-weight: 900;
        }
        .modal-close {
          color: var(--text-secondary); padding: 6px; border-radius: 6px; transition: color var(--transition);
        }
        .modal-close:hover { color: var(--text-primary); }
        .modal-title-section { margin-bottom: 24px; }
        .modal-title-section h2 { font-size: 1.35rem; font-weight: 700; margin-bottom: 4px; }
        .modal-title-section p { font-size: 0.875rem; color: var(--text-secondary); }
        .auth-tabs {
          display: flex; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm);
          padding: 3px; margin-bottom: 24px; gap: 3px;
        }
        .auth-tab {
          flex: 1; padding: 9px; border-radius: 6px; font-size: 0.875rem; font-weight: 500;
          color: var(--text-secondary); transition: all var(--transition); font-family: inherit;
        }
        .auth-tab.active { background: var(--bg-primary); color: var(--text-primary); box-shadow: 0 1px 8px rgba(0,0,0,0.4); }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .input-with-icon { padding-left: 38px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); transition: color var(--transition);
        }
        .pw-toggle:hover { color: var(--text-primary); }
        .auth-error {
          background: rgba(233,69,96,0.12); border: 1px solid rgba(233,69,96,0.3);
          border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.85rem; color: var(--accent);
        }
        .auth-submit { width: 100%; padding: 13px; font-size: 0.95rem; margin-top: 4px; }
        .auth-switch { text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 20px; }
        .auth-switch button { color: var(--accent); font-weight: 600; font-family: inherit; }
        .auth-switch button:hover { text-decoration: underline; }
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}
