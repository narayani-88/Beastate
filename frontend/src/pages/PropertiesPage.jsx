import { useState, useMemo } from 'react'
import PropertyCard from '../components/PropertyCard'
import { PROPERTIES, CITIES } from '../data/mockData'
import { FiFilter, FiX, FiSliders } from 'react-icons/fi'

export default function PropertiesPage() {
    const [filters, setFilters] = useState({
        type: 'All', city: 'Bangalore', bhk: 'All', minPrice: '', maxPrice: '', sort: 'trending'
    })
    const [filtersOpen, setFiltersOpen] = useState(false)

    const filtered = useMemo(() => {
        let list = [...PROPERTIES]
        if (filters.type !== 'All') list = list.filter(p => p.transactionType === filters.type)
        if (filters.bhk !== 'All') list = list.filter(p => p.bhk === parseInt(filters.bhk))
        if (filters.minPrice) list = list.filter(p => p.price >= parseInt(filters.minPrice))
        if (filters.maxPrice) list = list.filter(p => p.price <= parseInt(filters.maxPrice))
        if (filters.sort === 'trending') list.sort((a, b) => b.trending - a.trending)
        else if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
        else if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
        else if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
        return list
    }, [filters])

    const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }))

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <div className="container">
                    <div className="props-header">
                        <div>
                            <h1 className="section-title">Properties</h1>
                            <p className="section-sub">{filtered.length} properties found in {filters.city}</p>
                        </div>
                        <button className="btn btn-outline filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
                            <FiSliders size={16} /> Filters
                        </button>
                    </div>

                    {/* Filter Bar */}
                    {filtersOpen && (
                        <div className="filter-bar card">
                            <div className="filter-row">
                                <FilterChips label="Type" options={['All', 'Buy', 'Rent', 'Commercial']} value={filters.type} onChange={v => setFilter('type', v)} />
                                <FilterChips label="BHK" options={['All', '1', '2', '3', '4', '5']} value={filters.bhk} onChange={v => setFilter('bhk', v)} />
                                <div className="filter-group">
                                    <span className="filter-label">Sort By</span>
                                    <select className="filter-select" value={filters.sort} onChange={e => setFilter('sort', e.target.value)}>
                                        <option value="trending">Trending</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid-properties" style={{ marginTop: 24 }}>
                        {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
                    </div>

                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <p>No properties match your filters.</p>
                            <button className="btn btn-outline" onClick={() => setFilters({ type: 'All', city: 'Bangalore', bhk: 'All', minPrice: '', maxPrice: '', sort: 'trending' })}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .props-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; }
        .filter-toggle { display: flex; align-items: center; gap: 7px; }
        .filter-bar { padding: 20px 24px; margin-bottom: 8px; }
        .filter-row { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
        .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-chip { padding: 5px 13px; border-radius: 20px; font-size: 0.82rem; border: 1px solid var(--border); color: var(--text-secondary); transition: all var(--transition); font-family: inherit; }
        .filter-chip.active, .filter-chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
        .filter-select { background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; color: var(--text-primary); font-family: inherit; font-size: 0.85rem; outline: none; cursor: pointer; }
        .filter-select option { background: var(--bg-card); }
        .empty-state { text-align: center; padding: 80px 0; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 16px; }
      `}</style>
        </div>
    )
}

function FilterChips({ label, options, value, onChange }) {
    return (
        <div className="filter-group">
            <span className="filter-label">{label}</span>
            <div className="filter-chips">
                {options.map(o => (
                    <button key={o} className={`filter-chip ${value === o ? 'active' : ''}`} onClick={() => onChange(o)}>{o}</button>
                ))}
            </div>
        </div>
    )
}
