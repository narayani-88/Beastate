import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LocalityPage from './pages/LocalityPage'
import AuctionsPage from './pages/AuctionsPage'
import RentalYieldsPage from './pages/RentalYieldsPage'
import DiscoverPage from './pages/DiscoverPage'
import SavedPage from './pages/SavedPage'

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/locality" element={<LocalityPage />} />
                <Route path="/auctions" element={<AuctionsPage />} />
                <Route path="/rental-yields" element={<RentalYieldsPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/create-listing" element={<CreateListingPlaceholder />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    )
}

function CreateListingPlaceholder() {
    return (
        <div className="page-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16, textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '3rem' }}>🏗️</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Listing</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
                    This feature is coming soon! The backend for property listings is being built. Stay tuned.
                </p>
            </div>
        </div>
    )
}

function NotFound() {
    return (
        <div className="page-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16, textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '4rem' }}>404</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page not found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>Go Home</a>
            </div>
        </div>
    )
}
