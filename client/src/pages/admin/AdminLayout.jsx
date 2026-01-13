import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    FiGrid,
    FiPackage,
    FiShoppingCart,
    FiUsers,
    FiTag,
    FiSettings,
    FiMenu,
    FiX,
    FiLogOut,
    FiHome
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const menuItems = [
        { path: '/admin', icon: <FiGrid />, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/categories', icon: <FiTag />, label: 'Categories' },
        { path: '/admin/deals', icon: <span>🔥</span>, label: "Today's Deals" },
        { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAdmin) return null;

    return (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/admin" className="sidebar-logo">
                        <span className="logo-icon">🛒</span>
                        {sidebarOpen && <span className="logo-text">Local Cart</span>}
                    </Link>
                    <button
                        className="toggle-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="nav-item">
                        <span className="nav-icon"><FiHome /></span>
                        {sidebarOpen && <span className="nav-label">View Store</span>}
                    </Link>
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <span className="nav-icon"><FiLogOut /></span>
                        {sidebarOpen && <span className="nav-label">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button
                            className="mobile-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <FiMenu />
                        </button>
                        <h1 className="page-title">Admin Panel</h1>
                    </div>
                    <div className="header-right">
                        <button
                            className="theme-btn"
                            onClick={toggleTheme}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <div className="admin-user">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay mobile-only"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
