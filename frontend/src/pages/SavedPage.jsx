import { useState } from 'react'
import { FiBookmark, FiTrash2 } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import { PROPERTIES } from '../data/mockData'

export default function SavedPage() {
    const [saved, setSaved] = useState(PROPERTIES.filter(p => p.trending).slice(0, 3))

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <h1 className="section-title"><FiBookmark style={{ color: 'var(--accent)' }} /> Saved Properties</h1>
                    <p className="section-sub">{saved.length} properties saved</p>

                    {saved.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏠</div>
                            <p style={{ marginBottom: 20 }}>No saved properties yet. Browse properties and bookmark the ones you like!</p>
                        </div>
                    ) : (
                        <div className="grid-properties">
                            {saved.map(p => (
                                <PropertyCard key={p.id} property={p} saved />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
