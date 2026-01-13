import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiMenu,
    FiX,
    FiSun,
    FiMoon,
    FiLogOut,
    FiGrid,
    FiHeart
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <FiShoppingCart />
                    </div>
                    <span className="logo-text">
                        The Local <span className="logo-highlight">Cart</span>
                    </span>
                </Link>

                {/* Desktop Search */}
                <form className="navbar-search desktop-only" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">Search</button>
                </form>

                {/* Nav Actions */}
                <div className="navbar-actions">
                    {/* Mobile Search Toggle */}
                    <button
                        className="nav-icon-btn mobile-only"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Toggle search"
                    >
                        <FiSearch />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        className="nav-icon-btn theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <FiMoon /> : <FiSun />}
                    </button>

                    {/* Cart */}
                    <Link to="/cart" className="nav-icon-btn cart-btn">
                        <FiShoppingCart />
                        {getCartCount() > 0 && (
                            <span className="cart-count">{getCartCount()}</span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button
                                className="nav-icon-btn user-btn"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                ) : (
                                    <FiUser />
                                )}
                            </button>

                            {isDropdownOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <span className="dropdown-name">{user.name}</span>
                                        <span className="dropdown-email">{user.email}</span>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <FiUser /> Profile
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <FiGrid /> My Orders
                                    </Link>
                                    <Link to="/wishlist" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <FiHeart /> Wishlist
                                    </Link>
                                    {isAdmin && (
                                        <>
                                            <div className="dropdown-divider" />
                                            <Link to="/admin" className="dropdown-item admin-link" onClick={() => setIsDropdownOpen(false)}>
                                                <FiGrid /> Admin Panel
                                            </Link>
                                        </>
                                    )}
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="nav-icon-btn mobile-only menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Search */}
            {isSearchOpen && (
                <div className="mobile-search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input"
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary">
                            <FiSearch />
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="mobile-menu">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                    <Link to="/products?category=electronics" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
                    <Link to="/products?category=fashion" onClick={() => setIsMenuOpen(false)}>Fashion</Link>
                    <Link to="/products?category=home-living" onClick={() => setIsMenuOpen(false)}>Home & Living</Link>
                    {!isAuthenticated && (
                        <>
                            <div className="mobile-menu-divider" />
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Navbar;
