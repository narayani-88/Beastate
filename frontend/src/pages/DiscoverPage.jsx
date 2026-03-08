import { useState, useRef } from 'react'
import { PROPERTIES } from '../data/mockData'
import { FiHeart, FiX, FiBookmark, FiZap, FiMaximize2, FiBriefcase } from 'react-icons/fi'

export default function DiscoverPage() {
    const [cards, setCards] = useState([...PROPERTIES].slice(0, 6))
    const [currentIdx, setCurrentIdx] = useState(0)
    const [action, setAction] = useState(null) // 'like' | 'nope'
    const [history, setHistory] = useState([])

    const prop = cards[currentIdx]

    const swipe = (dir) => {
        setAction(dir)
        setHistory(h => [...h, { prop, dir }])
        setTimeout(() => {
            setAction(null)
            setCurrentIdx(i => i + 1)
        }, 350)
    }

    const undo = () => {
        if (history.length === 0) return
        setHistory(h => h.slice(0, -1))
        setCurrentIdx(i => Math.max(0, i - 1))
    }

    if (currentIdx >= cards.length) {
        return (
            <div className="page-wrapper">
                <div className="discover-done">
                    <div className="discover-done-icon">🎉</div>
                    <h2>You've seen them all!</h2>
                    <p>You've gone through all available properties. Come back later for more.</p>
                    <button className="btn btn-primary" onClick={() => { setCurrentIdx(0); setHistory([]) }}>Start Over</button>
                </div>
                <style>{`.discover-done { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; gap: 16px; text-align: center; padding: 40px; } .discover-done-icon { font-size: 3rem; } .discover-done h2 { font-size: 1.5rem; font-weight: 700; } .discover-done p { color: var(--text-secondary); max-width: 360px; } `}</style>
            </div>
        )
    }

    return (
        <div className="page-wrapper">
            <div className="discover-wrapper">
                <div className="discover-header">
                    <h1 className="section-title"><FiZap style={{ color: 'var(--accent)' }} /> Swipe to Discover</h1>
                    <p className="section-sub">Swipe right to save, left to skip. No login needed!</p>
                </div>

                {/* Card Stack */}
                <div className="swipe-area">
                    {/* Background card */}
                    {cards[currentIdx + 1] && (
                        <div className="swipe-card swipe-card-back card">
                            <img src={cards[currentIdx + 1].image} alt="" className="swipe-img" />
                        </div>
                    )}
                    {/* Active card */}
                    <div
                        className={`swipe-card swipe-card-front card ${action === 'like' ? 'swing-right' : ''} ${action === 'nope' ? 'swing-left' : ''}`}
                    >
                        <div className="swipe-img-wrap">
                            <img src={prop.image} alt={prop.title} className="swipe-img" onError={e => e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format'} />
                            <div className="swipe-overlay-tags">
                                <span className={`badge ${prop.transactionType === 'Rent' ? 'badge-blue' : 'badge-gold'}`}>{prop.transactionType}</span>
                                {prop.trending && <span className="badge badge-accent">🔥</span>}
                            </div>
                            {action === 'like' && <div className="action-stamp like-stamp">SAVE ❤️</div>}
                            {action === 'nope' && <div className="action-stamp nope-stamp">SKIP ✕</div>}
                        </div>
                        <div className="swipe-body">
                            <div className="swipe-price">{prop.priceLabel}</div>
                            <div className="swipe-title">{prop.title}</div>
                            <div className="swipe-meta">
                                <span><FiBriefcase size={12} /> {prop.bhk}BHK</span>
                                <span>·</span>
                                <span><FiMaximize2 size={12} /> {prop.area} sqft</span>
                                <span>·</span>
                                <span>📍 {prop.locality}</span>
                            </div>
                            {prop.tags?.length > 0 && (
                                <div className="swipe-tags">
                                    {prop.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="swipe-btns">
                    <button className="swipe-btn skip-btn" onClick={() => swipe('nope')} title="Skip"><FiX size={26} /></button>
                    <button className="swipe-btn undo-btn" onClick={undo} disabled={history.length === 0} title="Undo"><FiBookmark size={20} /></button>
                    <button className="swipe-btn like-btn" onClick={() => swipe('like')} title="Save"><FiHeart size={26} /></button>
                </div>

                {/* Counter */}
                <div className="swipe-counter">
                    {currentIdx + 1} / {cards.length} properties
                </div>
            </div>

            <style>{`
        .badge-blue { background: rgba(52,152,219,0.2); color: #3498db; }
        .discover-wrapper { display: flex; flex-direction: column; align-items: center; padding: 40px 20px; min-height: 100vh; padding-top: calc(var(--navbar-h) + 40px); }
        .discover-header { text-align: center; margin-bottom: 32px; }
        .discover-header .section-title { display: flex; align-items: center; gap: 10px; justify-content: center; font-size: 1.6rem; }
        .swipe-area { position: relative; width: 380px; height: 560px; margin-bottom: 32px; }
        .swipe-card { position: absolute; inset: 0; border-radius: var(--radius-xl); overflow: hidden; }
        .swipe-card-back { transform: scale(0.95) translateY(12px); z-index: 0; opacity: 0.6; }
        .swipe-card-front { z-index: 1; transition: transform 0.35s ease, opacity 0.35s ease; }
        .swing-right { transform: rotate(18deg) translateX(120%) !important; opacity: 0; }
        .swing-left { transform: rotate(-18deg) translateX(-120%) !important; opacity: 0; }
        .swipe-img-wrap { position: relative; height: 340px; overflow: hidden; }
        .swipe-img { width: 100%; height: 100%; object-fit: cover; }
        .swipe-overlay-tags { position: absolute; top: 14px; left: 14px; display: flex; gap: 6px; }
        .action-stamp {
          position: absolute; top: 30px; right: 24px;
          font-size: 1.2rem; font-weight: 900; padding: 8px 16px; border-radius: 8px;
          transform: rotate(12deg); border: 3px solid; letter-spacing: 0.05em;
        }
        .like-stamp { color: var(--green); border-color: var(--green); background: rgba(46,204,113,0.15); }
        .nope-stamp { color: var(--accent); border-color: var(--accent); background: var(--accent-glow); transform: rotate(-12deg); }
        .swipe-body { padding: 18px 20px; }
        .swipe-price { font-size: 1.4rem; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
        .swipe-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; line-height: 1.4; }
        .swipe-meta { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px; }
        .swipe-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .swipe-btns { display: flex; align-items: center; gap: 20px; }
        .swipe-btn { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid; transition: all var(--transition); }
        .skip-btn { border-color: var(--accent); color: var(--accent); background: rgba(233,69,96,0.1); }
        .skip-btn:hover { background: var(--accent); color: white; transform: scale(1.08); }
        .like-btn { border-color: var(--green); color: var(--green); background: rgba(46,204,113,0.1); width: 70px; height: 70px; }
        .like-btn:hover { background: var(--green); color: white; transform: scale(1.08); }
        .undo-btn { width: 44px; height: 44px; border-color: var(--border-hover); color: var(--text-secondary); }
        .undo-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
        .undo-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .swipe-counter { margin-top: 16px; font-size: 0.8rem; color: var(--text-muted); }
        @media (max-width: 440px) { .swipe-area { width: 100%; max-width: 360px; } }
      `}</style>
        </div>
    )
}
