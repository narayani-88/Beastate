import { useState } from 'react'
import { AUCTIONS } from '../data/mockData'
import { FiClock, FiUsers, FiTrendingUp, FiTool } from 'react-icons/fi'

export default function AuctionsPage() {
    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <div className="auction-hero-banner">
                        <div className="auction-hero-bg" />
                        <div className="auction-hero-text">
                            <span className="eyebrow">⚖️ Legal Auctions</span>
                            <h1>Auction Properties</h1>
                            <p>Grab SARFAESI, DRT & Bank auction properties at below-market prices. All legally clear.</p>
                        </div>
                    </div>

                    <div className="auction-grid">
                        {AUCTIONS.map(a => (
                            <div key={a.id} className="auction-card card">
                                <div className="auction-img-wrap">
                                    <img src={a.image} alt={a.title} className="auction-img" />
                                    <div className="auction-badge-row">
                                        <span className="badge badge-gold">{a.bank}</span>
                                        <span className="badge badge-accent">{a.type}</span>
                                    </div>
                                    <div className="auction-countdown">
                                        <FiClock size={12} /> {a.endsIn} left
                                    </div>
                                </div>
                                <div className="auction-body">
                                    <h3 className="auction-title">{a.title}</h3>
                                    <p className="auction-loc">📍 {a.locality}</p>
                                    <div className="auction-price-row">
                                        <div>
                                            <div className="price-label">Reserve Price</div>
                                            <div className="price-val reserve">{a.reservePrice}</div>
                                        </div>
                                        <div>
                                            <div className="price-label">Current Bid</div>
                                            <div className="price-val current">{a.currentBid}</div>
                                        </div>
                                        <div>
                                            <div className="price-label">Bidders</div>
                                            <div className="price-val bidders"><FiUsers size={13} /> {a.bidders}</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary auction-btn">
                                        <FiTool size={15} /> Place Bid
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
        .eyebrow { font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; display: block; }
        .auction-hero-banner { position: relative; border-radius: var(--radius-xl); overflow: hidden; padding: 48px 40px; margin-bottom: 40px; border: 1px solid rgba(245,166,35,0.2); }
        .auction-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 80% at 0% 50%, rgba(245,166,35,0.1) 0%, transparent 70%); }
        .auction-hero-text { position: relative; }
        .auction-hero-text h1 { font-size: 2rem; font-weight: 800; margin: 8px 0; }
        .auction-hero-text p { color: var(--text-secondary); max-width: 520px; }
        .auction-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .auction-card { overflow: hidden; }
        .auction-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .auction-img { width: 100%; height: 100%; object-fit: cover; }
        .auction-badge-row { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; }
        .auction-countdown { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); border-radius: 6px; padding: 4px 10px; font-size: 0.78rem; font-weight: 600; color: var(--gold); display: flex; align-items: center; gap: 5px; border: 1px solid rgba(245,166,35,0.3); }
        .auction-body { padding: 20px; }
        .auction-title { font-size: 1rem; font-weight: 700; margin-bottom: 5px; }
        .auction-loc { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px; }
        .auction-price-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; padding: 14px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border); }
        .price-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 3px; }
        .price-val { font-size: 0.95rem; font-weight: 700; }
        .price-val.reserve { color: var(--text-secondary); }
        .price-val.current { color: var(--green); }
        .price-val.bidders { display: flex; align-items: center; gap: 4px; color: var(--blue); }
        .auction-btn { width: 100%; }
      `}</style>
        </div>
    )
}
