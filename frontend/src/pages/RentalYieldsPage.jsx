import { RENTAL_YIELDS } from '../data/mockData'
import { FiPercent, FiTrendingUp, FiHome } from 'react-icons/fi'

export default function RentalYieldsPage() {
    const getRecColor = (rec) => {
        if (rec === 'High Yield') return 'var(--green)'
        if (rec === 'Good Yield') return 'var(--blue)'
        if (rec === 'Capital Growth') return 'var(--accent)'
        return 'var(--gold)'
    }

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <span className="eyebrow">💰 Investment Intelligence</span>
                    <h1 className="section-title">Rental Yields</h1>
                    <p className="section-sub">Compare rental yields across localities to identify the best investment pockets</p>

                    {/* Top Banner */}
                    <div className="yield-banner card">
                        <div className="yield-banner-bg" />
                        <div className="yield-banner-stats">
                            <div className="ys"><span className="ys-val">4.7%</span><span className="ys-lbl">Avg Bangalore Yield</span></div>
                            <div className="ys-div" />
                            <div className="ys"><span className="ys-val">5.1%</span><span className="ys-lbl">Highest Yield Locality</span></div>
                            <div className="ys-div" />
                            <div className="ys"><span className="ys-val">₹18K–₹48K</span><span className="ys-lbl">Rental Range</span></div>
                        </div>
                    </div>

                    <div className="yield-grid">
                        {RENTAL_YIELDS.map((y, i) => (
                            <div key={y.locality} className="yield-card card">
                                <div className="yield-rank">#{i + 1}</div>
                                <div className="yield-card-top">
                                    <h3>{y.locality}</h3>
                                    <span className="yield-rec-badge" style={{ color: getRecColor(y.recommendation), background: `${getRecColor(y.recommendation)}20` }}>
                                        {y.recommendation}
                                    </span>
                                </div>
                                <div className="yield-big">{y.yield}</div>
                                <div className="yield-sub">Annual Rental Yield</div>
                                <div className="yield-divider" />
                                <div className="yield-details">
                                    <div className="yd-item">
                                        <span>Avg Monthly Rent</span>
                                        <strong>{y.avgRent}</strong>
                                    </div>
                                    <div className="yd-item">
                                        <span>Avg Buy Price</span>
                                        <strong>{y.avgBuyPrice}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
        .eyebrow { font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; display: block; }
        .yield-banner { padding: 28px 32px; margin-bottom: 32px; position: relative; overflow: hidden; }
        .yield-banner-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(46,204,113,0.08), transparent); }
        .yield-banner-stats { position: relative; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .ys { display: flex; flex-direction: column; gap: 3px; }
        .ys-val { font-size: 1.6rem; font-weight: 800; color: var(--green); }
        .ys-lbl { font-size: 0.78rem; color: var(--text-muted); }
        .ys-div { width: 1px; height: 40px; background: var(--border); }
        .yield-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .yield-card { padding: 24px; position: relative; }
        .yield-rank { position: absolute; top: 16px; right: 16px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
        .yield-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
        .yield-card-top h3 { font-size: 1rem; font-weight: 700; }
        .yield-rec-badge { font-size: 0.72rem; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .yield-big { font-size: 2.4rem; font-weight: 900; color: var(--green); line-height: 1; }
        .yield-sub { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 16px; margin-top: 2px; }
        .yield-divider { height: 1px; background: var(--border); margin-bottom: 14px; }
        .yield-details { display: flex; flex-direction: column; gap: 8px; }
        .yd-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
        .yd-item span { color: var(--text-muted); }
        .yd-item strong { color: var(--text-primary); }
      `}</style>
        </div>
    )
}
