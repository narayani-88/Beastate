import HeroSection from '../components/HeroSection'
import PropertyCard from '../components/PropertyCard'
import { PROPERTIES, LOCALITIES, AUCTIONS } from '../data/mockData'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTrendingUp, FiMapPin, FiTool, FiZap } from 'react-icons/fi'

export default function HomePage() {
    const featured = PROPERTIES.filter(p => p.trending).slice(0, 4)

    return (
        <div>
            <HeroSection />

            {/* Featured Properties */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <div>
                            <p className="section-eyebrow">🔥 Trending Now</p>
                            <h2 className="section-title">Featured Properties</h2>
                            <p className="section-sub">Hand-picked properties making waves this week</p>
                        </div>
                        <Link to="/properties" className="btn btn-outline view-all-btn">
                            View All <FiArrowRight size={15} />
                        </Link>
                    </div>
                    <div className="grid-properties">
                        {featured.map(p => <PropertyCard key={p.id} property={p} />)}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Feature Cards */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>
                        Everything You Need to Decide Smart
                    </h2>
                    <p className="section-sub" style={{ textAlign: 'center', marginBottom: 40 }}>
                        All the data, insights, and tools in one place — free, forever.
                    </p>
                    <div className="feature-grid">
                        <Link to="/analytics" className="feature-card card">
                            <div className="feature-icon analytics-icon"><FiTrendingUp size={26} /></div>
                            <h3>Price Analytics</h3>
                            <p>Track real-time price trends across localities. Know exactly when to buy or wait.</p>
                            <span className="feature-link">Explore trends <FiArrowRight size={13} /></span>
                        </Link>
                        <Link to="/locality" className="feature-card card">
                            <div className="feature-icon locality-icon"><FiMapPin size={26} /></div>
                            <h3>Locality Insights</h3>
                            <p>Livability scores, connectivity, schools, hospitals — all in one card.</p>
                            <span className="feature-link">View localities <FiArrowRight size={13} /></span>
                        </Link>
                        <Link to="/auctions" className="feature-card card">
                            <div className="feature-icon auction-icon"><FiTool size={26} /></div>
                            <h3>Auction Listings</h3>
                            <p>Find bank & court auction properties at 20-40% below market price.</p>
                            <span className="feature-link">See auctions <FiArrowRight size={13} /></span>
                        </Link>
                        <Link to="/discover" className="feature-card card">
                            <div className="feature-icon swipe-icon"><FiZap size={26} /></div>
                            <h3>Swipe Discovery</h3>
                            <p>Tinder-style property discovery. Swipe right on your dream home.</p>
                            <span className="feature-link">Start swiping <FiArrowRight size={13} /></span>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* Top Localities */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <div>
                            <p className="section-eyebrow">📍 Location Intel</p>
                            <h2 className="section-title">Top Localities in Bangalore</h2>
                        </div>
                        <Link to="/locality" className="btn btn-outline view-all-btn">
                            View All <FiArrowRight size={15} />
                        </Link>
                    </div>
                    <div className="grid-3">
                        {LOCALITIES.slice(0, 6).map(loc => (
                            <div key={loc.id} className="locality-card card">
                                <div className="locality-score-ring">
                                    <span className="locality-score">{loc.score}</span>
                                    <span className="locality-score-label">Score</span>
                                </div>
                                <div className="locality-info">
                                    <h4>{loc.name}</h4>
                                    <p className="locality-type">{loc.type}</p>
                                    <div className="locality-stats">
                                        <span>{loc.avgPrice}</span>
                                        <span className="locality-growth">{loc.yoyGrowth}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* CTA Banner */}
            <section className="section">
                <div className="container">
                    <div className="cta-banner">
                        <div className="cta-bg" />
                        <div className="cta-content">
                            <h2>Are You a Property Owner?</h2>
                            <p>List your property for free and reach lakhs of verified buyers and renters.</p>
                            <div className="cta-btns">
                                <Link to="/create-listing" className="btn btn-primary">Post Free Property Ad</Link>
                                <Link to="/properties" className="btn btn-outline cta-outline-btn">Browse Properties</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; }
        .section-eyebrow { font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .view-all-btn { font-size: 0.85rem; padding: 9px 16px; display: flex; align-items: center; gap: 6px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .feature-card { padding: 28px 24px; display: flex; flex-direction: column; gap: 10px; text-decoration: none; }
        .feature-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
        .analytics-icon { background: rgba(233,69,96,0.15); color: var(--accent); }
        .locality-icon { background: rgba(52,152,219,0.15); color: #3498db; }
        .auction-icon { background: rgba(245,166,35,0.15); color: var(--gold); }
        .swipe-icon { background: rgba(46,204,113,0.15); color: var(--green); }
        .feature-card h3 { font-size: 1rem; font-weight: 700; }
        .feature-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; flex: 1; }
        .feature-link { font-size: 0.82rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .locality-card { padding: 20px; display: flex; align-items: center; gap: 16px; }
        .locality-score-ring {
          width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
          background: conic-gradient(var(--accent) 0%, rgba(233,69,96,0.2) 0%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 2.5px solid var(--accent);
        }
        .locality-score { font-size: 1.1rem; font-weight: 800; line-height: 1; }
        .locality-score-label { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }
        .locality-info { flex: 1; }
        .locality-info h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
        .locality-type { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; }
        .locality-stats { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: var(--text-secondary); }
        .locality-growth { color: var(--green); font-weight: 600; }
        .cta-banner {
          position: relative; border-radius: var(--radius-xl); overflow: hidden;
          border: 1px solid rgba(233,69,96,0.25); padding: 56px;
        }
        .cta-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% 50%, rgba(233,69,96,0.12) 0%, transparent 70%);
        }
        .cta-content { position: relative; z-index: 1; text-align: center; }
        .cta-content h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 10px; }
        .cta-content p { color: var(--text-secondary); font-size: 1rem; margin-bottom: 28px; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-outline-btn { border-color: var(--border-hover); }
      `}</style>
        </div>
    )
}
