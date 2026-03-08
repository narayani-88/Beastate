import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin } from 'react-icons/fi'
import { CITIES } from '../data/mockData'

export default function HeroSection() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Buy')
    const [city, setCity] = useState('Bangalore')
    const [query, setQuery] = useState('')

    const tabs = ['Buy', 'Rent', 'Commercial']

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/properties?type=${activeTab}&city=${city}&q=${query}`)
    }

    return (
        <div className="hero">
            <div className="hero-bg" />
            <div className="hero-overlay" />

            <div className="container hero-content">
                <div className="hero-badge">
                    <span>🏆</span>
                    <span>India's Smartest Real Estate Platform</span>
                </div>

                <h1 className="hero-headline">
                    Find Your <span className="text-accent">Dream Property</span>
                    <br />Without the Broker Drama
                </h1>

                <p className="hero-sub">
                    Browse verified listings, track price trends, and discover your next home — all in one place.
                </p>

                {/* Search Box */}
                <div className="hero-search-card">
                    {/* Tabs */}
                    <div className="hero-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className={`hero-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search Row */}
                    <form className="hero-search-row" onSubmit={handleSearch}>
                        <div className="hero-city-select">
                            <FiMapPin size={16} className="city-icon" />
                            <select
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="city-dropdown"
                            >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="hero-search-divider" />

                        <div className="hero-locality-input">
                            <FiSearch size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search locality, landmark or project..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="locality-input"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary hero-search-btn">
                            <FiSearch size={17} /> Search
                        </button>
                    </form>

                    {/* Quick filters */}
                    <div className="hero-quick-filters">
                        <span className="quick-filter-label">Popular:</span>
                        {['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Marathahalli'].map(loc => (
                            <button
                                key={loc}
                                className="quick-filter-chip"
                                onClick={() => { setQuery(loc); navigate(`/properties?type=${activeTab}&city=${city}&q=${loc}`) }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="hero-stats">
                    <div className="hero-stat"><span className="hero-stat-value">50K+</span><span>Properties</span></div>
                    <div className="hero-stat-div" />
                    <div className="hero-stat"><span className="hero-stat-value">200+</span><span>Cities</span></div>
                    <div className="hero-stat-div" />
                    <div className="hero-stat"><span className="hero-stat-value">No Brokerage</span><span>on rentals</span></div>
                    <div className="hero-stat-div" />
                    <div className="hero-stat"><span className="hero-stat-value">RERA</span><span>Verified</span></div>
                </div>
            </div>

            <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(233,69,96,0.18) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(52,152,219,0.1) 0%, transparent 60%);
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&auto=format') center/cover no-repeat;
          opacity: 0.04;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          padding-top: calc(var(--navbar-h) + 40px);
          padding-bottom: 80px;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px; border-radius: 20px;
          background: rgba(233,69,96,0.12); border: 1px solid rgba(233,69,96,0.25);
          font-size: 0.8rem; font-weight: 600; color: var(--accent);
          margin-bottom: 24px; letter-spacing: 0.02em;
        }
        .hero-headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .text-accent {
          background: linear-gradient(135deg, var(--accent), #ff8a65);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 520px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
        .hero-search-card {
          background: rgba(22,22,31,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-hover);
          border-radius: var(--radius-xl);
          padding: 6px 6px 16px;
          max-width: 760px;
          margin: 0 auto 40px;
          box-shadow: 0 16px 64px rgba(0,0,0,0.5);
        }
        .hero-tabs {
          display: flex;
          background: rgba(255,255,255,0.03);
          border-radius: calc(var(--radius-xl) - 3px) calc(var(--radius-xl) - 3px) 0 0;
          margin-bottom: 8px;
        }
        .hero-tab {
          flex: 1; padding: 13px; font-size: 0.9rem; font-weight: 600;
          color: var(--text-muted); border-radius: calc(var(--radius-xl) - 4px);
          transition: all var(--transition); font-family: inherit;
        }
        .hero-tab.active { background: var(--accent); color: white; box-shadow: 0 4px 16px var(--accent-glow); }
        .hero-search-row {
          display: flex; align-items: center; gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: calc(var(--radius-xl) - 6px);
          overflow: hidden;
          margin: 0 8px 14px;
        }
        .hero-city-select {
          display: flex; align-items: center; gap: 8px;
          padding: 0 16px; min-width: 140px; position: relative;
        }
        .city-icon { color: var(--accent); flex-shrink: 0; }
        .city-dropdown {
          background: none; border: none; color: var(--text-primary);
          font-size: 0.9rem; font-weight: 500; font-family: inherit;
          cursor: pointer; outline: none; padding: 14px 0;
        }
        .city-dropdown option { background: var(--bg-card); }
        .hero-search-divider { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; }
        .hero-locality-input {
          flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 16px;
        }
        .search-icon { color: var(--text-muted); flex-shrink: 0; }
        .locality-input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text-primary); font-size: 0.9rem; font-family: inherit;
          padding: 14px 0;
        }
        .locality-input::placeholder { color: var(--text-muted); }
        .hero-search-btn { margin: 6px; border-radius: calc(var(--radius-xl) - 10px); padding: 12px 24px; }
        .hero-quick-filters {
          display: flex; align-items: center; gap: 8px; padding: 0 14px; flex-wrap: wrap;
        }
        .quick-filter-label { font-size: 0.8rem; color: var(--text-muted); }
        .quick-filter-chip {
          font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          color: var(--text-secondary); transition: all var(--transition); font-family: inherit;
        }
        .quick-filter-chip:hover { border-color: var(--accent); color: var(--accent); }
        .hero-stats {
          display: inline-flex; align-items: center; gap: 24px;
          background: rgba(22,22,31,0.7); backdrop-filter: blur(10px);
          border: 1px solid var(--border); border-radius: 14px;
          padding: 16px 28px; flex-wrap: wrap; justify-content: center;
        }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .hero-stat-value { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
        .hero-stat span:last-child { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .hero-stat-div { width: 1px; height: 32px; background: var(--border); }
        @media (max-width: 640px) {
          .hero-search-row { flex-direction: column; }
          .hero-search-divider { width: 100%; height: 1px; }
          .hero-city-select { border-right: none; border-bottom: 1px solid var(--border); width: 100%; }
          .hero-search-btn { width: calc(100% - 12px); }
        }
      `}</style>
        </div>
    )
}
