import { Link } from 'react-router-dom';
import {
    FiShoppingCart,
    FiFacebook,
    FiInstagram,
    FiLinkedin,
    FiYoutube,
    FiMail,
    FiPhone,
    FiMapPin
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="logo-icon">
                                <FiShoppingCart />
                            </div>
                            <span>The Local Cart</span>
                        </Link>
                        <p className="footer-description">
                            Your trusted online shopping destination. Quality products,
                            competitive prices, and excellent customer service.
                        </p>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/mahima.paseda?rdid=aKV8kpXVfvaRwecn&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Cybqo7KWn%2F#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
                            <a href="https://www.linkedin.com/in/mahimapaseda" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
                            <a href="https://www.instagram.com/mahi_pase_2002?igsh=MW5seDNvaTUyaWo1cg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
                            <a href="https://www.youtube.com/@mahimapaseda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/products?featured=true">Featured</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-column">
                        <h4 className="footer-title">Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/products?category=electronics">Electronics</Link></li>
                            <li><Link to="/products?category=fashion">Fashion</Link></li>
                            <li><Link to="/products?category=home-living">Home & Living</Link></li>
                            <li><Link to="/products?category=sports-outdoors">Sports & Outdoors</Link></li>
                            <li><Link to="/products?category=health-beauty">Health & Beauty</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-column">
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <FiMapPin />
                                <span>123 Shopping Street, City 10001</span>
                            </li>
                            <li>
                                <FiPhone />
                                <span>+94 770114407</span>
                            </li>
                            <li>
                                <FiMail />
                                <span>support@localcart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        &copy; 2026 The Local Cart. All rights reserved. Developed by{' '}
                        <a href="https://mahimapaseda.vercel.app/" target="_blank" rel="noopener noreferrer" className="developer-link">
                            Mahima Paseda Kusumsiri
                        </a>
                    </p>
                    <div className="footer-legal">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/refund">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
