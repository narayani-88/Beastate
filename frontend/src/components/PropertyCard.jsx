import { useState } from 'react'
import { FiBookmark, FiStar, FiMaximize2, FiBriefcase, FiDroplet } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

function formatPrice(price, type) {
    if (type === 'Rent') return `₹${(price / 1000).toFixed(0)}K/mo`
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`
    return `₹${price.toLocaleString()}`
}

export default function PropertyCard({ property, onSave, saved = false }) {
    const { isLoggedIn } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [localSaved, setLocalSaved] = useState(saved)
    const [imgError, setImgError] = useState(false)

    const handleBookmark = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isLoggedIn) {
            setShowModal(true)
            return
        }
        setLocalSaved(!localSaved)
        onSave?.(!localSaved)
    }

    return (
        <>
            <div className="prop-card card">
                {/* Image */}
                <div className="prop-img-wrap">
                    <img
                        src={imgError ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format' : property.image}
                        alt={property.title}
                        className="prop-img"
                        onError={() => setImgError(true)}
                    />
                    <div className="prop-overlay-tags">
                        {property.trending && <span className="badge badge-accent">🔥 Trending</span>}
                        <span className={`badge ${property.transactionType === 'Rent' ? 'badge-blue' : 'badge-gold'}`}>
                            {property.transactionType}
                        </span>
                    </div>
                    <button
                        className={`bookmark-btn ${localSaved ? 'saved' : ''}`}
                        onClick={handleBookmark}
                        title={isLoggedIn ? (localSaved ? 'Remove bookmark' : 'Save property') : 'Login to save'}
                    >
                        <FiBookmark size={17} fill={localSaved ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Content */}
                <div className="prop-content">
                    <div className="prop-price">{formatPrice(property.price, property.transactionType)}</div>
                    <div className="prop-title">{property.title}</div>
                    <div className="prop-meta-row">
                        <span className="prop-meta"><FiBriefcase size={13} /> {property.bhk}BHK</span>
                        <span className="prop-meta dot" />
                        <span className="prop-meta"><FiMaximize2 size={13} /> {property.area} sqft</span>
                        <span className="prop-meta dot" />
                        <span className="prop-meta"><FiDroplet size={13} /> {property.baths} Bath</span>
                    </div>
                    <div className="prop-location">📍 {property.locality}, {property.city}</div>

                    {property.tags?.length > 0 && (
                        <div className="prop-tags">
                            {property.tags.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                    )}

                    <div className="prop-footer">
                        <div className="prop-rating">
                            <FiStar size={13} fill="#f5a623" color="#f5a623" />
                            <span>{property.rating}</span>
                        </div>
                        <span className="prop-type">{property.type}</span>
                    </div>
                </div>
            </div>

            {showModal && <LoginModal initialMode="login" onClose={() => setShowModal(false)} />}

            <style>{`
        .prop-card { overflow: hidden; cursor: pointer; }
        .prop-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .prop-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .prop-card:hover .prop-img { transform: scale(1.05); }
        .prop-overlay-tags {
          position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap;
        }
        .badge-blue { background: rgba(52,152,219,0.2); color: #3498db; }
        .bookmark-btn {
          position: absolute; top: 12px; right: 12px;
          background: rgba(10,10,15,0.7); backdrop-filter: blur(4px);
          border: 1px solid var(--border); border-radius: 8px; padding: 7px;
          color: var(--text-secondary); transition: all var(--transition);
          display: flex; align-items: center; justify-content: center;
        }
        .bookmark-btn:hover { color: var(--accent); border-color: var(--accent); }
        .bookmark-btn.saved { color: var(--accent); border-color: var(--accent); background: var(--accent-glow); }
        .prop-content { padding: 16px; }
        .prop-price { font-size: 1.25rem; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
        .prop-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; line-height: 1.4; }
        .prop-meta-row { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 8px; }
        .prop-meta { display: flex; align-items: center; gap: 3px; }
        .prop-meta.dot { width: 3px; height: 3px; background: var(--text-muted); border-radius: 50%; }
        .prop-location { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
        .prop-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
        .prop-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border); }
        .prop-rating { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; color: var(--gold); }
        .prop-type { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
        </>
    )
}
