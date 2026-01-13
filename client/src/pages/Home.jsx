import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCreditCard, FiClock } from 'react-icons/fi';
import FeaturedGrid from '../components/products/FeaturedGrid';
import api from '../services/api';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [dealsProducts, setDealsProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const calculateTimeLeft = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const difference = midnight - now;

        if (difference > 0) {
            return {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products?featured=true&limit=8'),
                    api.get('/categories')
                ]);
                setFeaturedProducts(productsRes.data.products);
                // Filter products with discounts for Today's Deals
                const deals = productsRes.data.products.filter(p => p.comparePrice > p.price).slice(0, 4);
                setDealsProducts(deals);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Countdown timer effect
    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over Rs. 10,000' },
        { icon: <FiShield />, title: 'Secure Payment', desc: '100% protected' },
        { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated support' },
        { icon: <FiCreditCard />, title: 'Easy Returns', desc: '30-day return policy' }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <span className="hero-badge">🛒 New Arrivals</span>
                        <h1 className="hero-title">
                            Discover Premium
                            <span className="highlight"> Products</span>
                        </h1>
                        <p className="hero-description">
                            Shop the latest trends in electronics, fashion, and home essentials.
                            Quality products at unbeatable prices.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/products?featured=true" className="btn btn-outline btn-lg">
                                View Featured
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-value">10K+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">50K+</span>
                                <span className="stat-label">Customers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">4.9</span>
                                <span className="stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-card">
                            <img
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                                alt="Sale Headphone"
                                className="hero-card-image"
                            />
                            <div className="hero-card-content">
                                <span className="sale-badge">SALE</span>
                                <h3>Up to 50% Off</h3>
                                <p>On selected items</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <div className="feature-text">
                                    <h4>{feature.title}</h4>
                                    <p>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Today's Deals */}
            {dealsProducts.length > 0 && (
                <section className="deals-section">
                    <div className="container">
                        <div className="deals-header">
                            <div className="deals-title-wrapper">
                                <span className="deals-fire">🔥</span>
                                <h2 className="deals-title">Today's Deals</h2>
                                <span className="deals-badge">Limited Time</span>
                            </div>
                            <div className="deals-timer">
                                <FiClock className="timer-icon" />
                                <span className="timer-label">Ends in:</span>
                                <div className="timer-blocks">
                                    <div className="timer-block">
                                        <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="timer-unit">HRS</span>
                                    </div>
                                    <span className="timer-separator">:</span>
                                    <div className="timer-block">
                                        <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="timer-unit">MIN</span>
                                    </div>
                                    <span className="timer-separator">:</span>
                                    <div className="timer-block">
                                        <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="timer-unit">SEC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FeaturedGrid products={dealsProducts} loading={loading} />
                        <div className="deals-cta">
                            <Link to="/products" className="btn btn-deals">
                                View All Deals <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <Link to="/products" className="view-all">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {categories.slice(0, 6).map(category => (
                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                className="category-card"
                            >
                                <div className="category-icon">
                                    {category.name === 'Electronics' && '📱'}
                                    {category.name === 'Fashion' && '👗'}
                                    {category.name === 'Home & Living' && '🏠'}
                                    {category.name === 'Sports & Outdoors' && '⚽'}
                                    {category.name === 'Health & Beauty' && '💄'}
                                    {category.name === 'Books & Media' && '📚'}
                                </div>
                                <h3 className="category-name">{category.name}</h3>
                                <span className="category-arrow"><FiArrowRight /></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/products?featured=true" className="view-all">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <FeaturedGrid products={featuredProducts} loading={loading} />
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter">
                <div className="container">
                    <div className="newsletter-content">
                        <h2>Subscribe to Our Newsletter</h2>
                        <p>Get the latest updates on new products and upcoming sales</p>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="form-input"
                            />
                            <button type="submit" className="btn btn-primary">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
