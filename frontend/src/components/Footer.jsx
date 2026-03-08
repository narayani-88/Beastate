import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiHome, FiTrendingUp, FiMapPin, FiTool, FiPercent, FiZap } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <div className="footer-logo-icon">B</div>
                        <span>Beastate</span>
                    </div>
                    <p>India's smartest real estate discovery platform. Find, track, and invest in properties without the broker drama.</p>
                    <div className="footer-socials">
                        <a href="#" className="social-btn"><FiTwitter size={16} /></a>
                        <a href="#" className="social-btn"><FiInstagram size={16} /></a>
                        <a href="#" className="social-btn"><FiLinkedin size={16} /></a>
                        <a href="#" className="social-btn"><FiGithub size={16} /></a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <h4>Discover</h4>
                    <Link to="/properties"><FiHome size={13} /> Properties</Link>
                    <Link to="/analytics"><FiTrendingUp size={13} /> Analytics</Link>
                    <Link to="/locality"><FiMapPin size={13} /> Localities</Link>
                    <Link to="/auctions"><FiTool size={13} /> Auctions</Link>
                    <Link to="/rental-yields"><FiPercent size={13} /> Rental Yields</Link>
                    <Link to="/discover"><FiZap size={13} /> Swipe Discovery</Link>
                </div>

                <div className="footer-links-group">
                    <h4>Company</h4>
                    <a href="#">About Beastate</a>
                    <a href="#">Careers</a>
                    <a href="#">Blog</a>
                    <a href="#">Press</a>
                    <a href="#">Contact Us</a>
                </div>

                <div className="footer-links-group">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                    <a href="#">Cookie Policy</a>
                    <a href="#">RERA Compliance</a>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <span>© {new Date().getFullYear()} Beastate. All rights reserved.</span>
                    <span>Made with ❤️ in India</span>
                </div>
            </div>

            <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: 60px 0 0;
          margin-top: 0;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 48px;
        }
        .footer-logo { display: flex; align-items: center; gap: 10px; font-size: 1.15rem; font-weight: 800; margin-bottom: 12px; }
        .footer-logo-icon { width: 32px; height: 32px; background: var(--accent); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .footer-brand p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; max-width: 280px; margin-bottom: 20px; }
        .footer-socials { display: flex; gap: 8px; }
        .social-btn { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all var(--transition); }
        .social-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
        .footer-links-group { display: flex; flex-direction: column; gap: 10px; }
        .footer-links-group h4 { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-primary); margin-bottom: 4px; }
        .footer-links-group a { font-size: 0.875rem; color: var(--text-muted); transition: color var(--transition); display: flex; align-items: center; gap: 6px; }
        .footer-links-group a:hover { color: var(--text-primary); }
        .footer-bottom { border-top: 1px solid var(--border); padding: 18px 0; }
        .footer-bottom .container { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); }
        @media (max-width: 900px) { .footer-inner { grid-template-columns: 1fr 1fr; } .footer-brand { grid-column: 1 / -1; } }
        @media (max-width: 480px) { .footer-inner { grid-template-columns: 1fr; } }
      `}</style>
        </footer>
    )
}
