import { LOCALITIES } from '../data/mockData'
import { FiMapPin, FiTrendingUp, FiPercent } from 'react-icons/fi'

export default function LocalityPage() {
    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <p className="eyebrow">📍 Locality Intel</p>
                    <h1 className="section-title">Locality Insights</h1>
                    <p className="section-sub">Comprehensive data on livability, growth, and rental potential by locality</p>
                    <div className="loc-grid">
                        {LOCALITIES.map(loc => (
                            <div key={loc.id} className="loc-card card">
                                <div className="loc-card-header">
                                    <div>
                                        <h3>{loc.name}</h3>
                                        <p className="loc-city">{loc.city} · {loc.type}</p>
                                    </div>
                                    <div className="loc-score-circle" style={{ '--score': loc.score }}>
                                        <span>{loc.score}</span>
                                        <small>Score</small>
                                    </div>
                                </div>
                                <div className="loc-divider" />
                                <div className="loc-stats-grid">
                                    <div className="loc-stat">
                                        <span className="loc-stat-icon"><FiMapPin size={14} /></span>
                                        <div>
                                            <div className="loc-stat-val">{loc.avgPrice}</div>
                                            <div className="loc-stat-lbl">Avg Price/sqft</div>
                                        </div>
                                    </div>
                                    <div className="loc-stat">
                                        <span className="loc-stat-icon trend"><FiTrendingUp size={14} /></span>
                                        <div>
                                            <div className="loc-stat-val trend">{loc.yoyGrowth}</div>
                                            <div className="loc-stat-lbl">YoY Growth</div>
                                        </div>
                                    </div>
                                    <div className="loc-stat">
                                        <span className="loc-stat-icon yield"><FiPercent size={14} /></span>
                                        <div>
                                            <div className="loc-stat-val yield">{loc.rentYield}</div>
                                            <div className="loc-stat-lbl">Rental Yield</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="score-track">
                                    <div className="score-fill" style={{ width: `${loc.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
        .eyebrow { font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .loc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .loc-card { padding: 24px; }
        .loc-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .loc-card-header h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 3px; }
        .loc-city { font-size: 0.8rem; color: var(--text-muted); }
        .loc-score-circle {
          width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
          border: 2.5px solid var(--accent);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: var(--accent-glow);
        }
        .loc-score-circle span { font-size: 1.1rem; font-weight: 800; line-height: 1; }
        .loc-score-circle small { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }
        .loc-divider { height: 1px; background: var(--border); margin-bottom: 16px; }
        .loc-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
        .loc-stat { display: flex; align-items: flex-start; gap: 8px; }
        .loc-stat-icon { width: 28px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
        .loc-stat-icon.trend { background: rgba(46,204,113,0.12); color: var(--green); }
        .loc-stat-icon.yield { background: rgba(245,166,35,0.12); color: var(--gold); }
        .loc-stat-val { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); }
        .loc-stat-val.trend { color: var(--green); }
        .loc-stat-val.yield { color: var(--gold); }
        .loc-stat-lbl { font-size: 0.7rem; color: var(--text-muted); }
        .score-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .score-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--gold)); border-radius: 2px; transition: width 0.8s ease; }
      `}</style>
        </div>
    )
}
