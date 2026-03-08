import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FiHome, FiSearch, FiTrendingUp, FiMapPin,
    FiTool, FiPercent, FiZap, FiUser, FiLogOut,
    FiMenu, FiX, FiChevronDown
} from 'react-icons/fi'
import LoginModal from './LoginModal'

export default function Navbar() {
    const { user, logout, isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location.pathname])

    const navLinks = [
        { to: '/properties', label: 'Properties', icon: <FiHome size={15} /> },
        { to: '/analytics', label: 'Analytics', icon: <FiTrendingUp size={15} /> },
        { to: '/locality', label: 'Localities', icon: <FiMapPin size={15} /> },
        { to: '/auctions', label: 'Auctions', icon: <FiTool size={15} /> },
        { to: '/rental-yields', label: 'Rental Yields', icon: <FiPercent size={15} /> },
        { to: '/discover', label: 'Swipe', icon: <FiZap size={15} /> },
    ]

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="container navbar-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="navbar-logo-icon">B</div>
                        <span>Beastate</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="nav-links">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Auth CTA */}
                    <div className="nav-auth">
                        {isLoggedIn ? (
                            <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
                                <span className="user-name">{user.username}</span>
                                <FiChevronDown size={14} />
                                {dropdownOpen && (
                                    <div className="user-dropdown">
                                        <Link to="/saved" className="dropdown-item"><FiHome size={14} /> Saved Properties</Link>
                                        <Link to="/create-listing" className="dropdown-item"><FiZap size={14} /> Create Listing</Link>
                                        <div className="dropdown-divider" />
                                        <button className="dropdown-item danger" onClick={() => { logout(); setDropdownOpen(false) }}>
                                            <FiLogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="nav-auth-btns">
                                <button className="btn btn-ghost nav-btn" onClick={() => setShowAuthModal('login')}>Sign In</button>
                                <button className="btn btn-primary nav-btn" onClick={() => setShowAuthModal('register')}>Sign Up</button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to} className="mobile-link">
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        {!isLoggedIn && (
                            <div className="mobile-auth">
                                <button className="btn btn-outline" onClick={() => { setShowAuthModal('login'); setMenuOpen(false) }}>Sign In</button>
                                <button className="btn btn-primary" onClick={() => { setShowAuthModal('register'); setMenuOpen(false) }}>Sign Up</button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {showAuthModal && (
                <LoginModal
                    initialMode={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            )}

            <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--navbar-h);
          background: transparent;
          transition: background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(10, 10, 15, 0.92);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 var(--border);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 100%;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .navbar-logo-icon {
          width: 34px;
          height: 34px;
          background: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1rem;
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 4px;
          margin-left: auto;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color var(--transition), background var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active { color: var(--accent); }
        .nav-auth { margin-left: 8px; }
        .nav-auth-btns { display: flex; gap: 8px; }
        .nav-btn { padding: 8px 16px; font-size: 0.85rem; }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: var(--radius);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          position: relative;
          transition: background var(--transition);
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .user-menu:hover { background: rgba(255,255,255,0.1); }
        .user-avatar {
          width: 28px; height: 28px;
          background: var(--accent);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-hover);
          border-radius: var(--radius);
          min-width: 200px;
          overflow: hidden;
          box-shadow: var(--shadow);
          animation: slideUp 0.15s ease;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 16px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: background var(--transition), color var(--transition);
          width: 100%;
          text-align: left;
          font-family: inherit;
          cursor: pointer;
        }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .dropdown-item.danger:hover { color: var(--accent); }
        .dropdown-divider { height: 1px; background: var(--border); }
        .menu-toggle {
          display: none;
          color: var(--text-primary);
          margin-left: auto;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: 12px;
          gap: 4px;
        }
        .mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: var(--radius-sm);
          color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;
          transition: all var(--transition);
        }
        .mobile-link:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .mobile-auth { display: flex; gap: 10px; padding: 12px 14px; }
        @media (max-width: 900px) {
          .nav-links, .nav-auth { display: none; }
          .menu-toggle { display: flex; }
          .mobile-menu { display: flex; }
        }
      `}</style>
        </>
    )
}
