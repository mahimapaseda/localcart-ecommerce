import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPackage,
    FiShoppingCart,
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiArrowRight
} from 'react-icons/fi';
import { formatPrice } from '../../utils/currency';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        newUsersThisMonth: 0
    });
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [orderStats, users, products] = await Promise.all([
                api.get('/orders/stats'),
                api.get('/users/stats'),
                api.get('/products?limit=1')
            ]);

            setStats(orderStats.data);
            setUserStats(users.data);
            setProductCount(products.data.total);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: <FiDollarSign />,
            label: 'Total Revenue',
            value: formatPrice(stats.totalRevenue || 0),
            color: 'success'
        },
        {
            icon: <FiShoppingCart />,
            label: 'Total Orders',
            value: stats.totalOrders,
            color: 'primary'
        },
        {
            icon: <FiPackage />,
            label: 'Products',
            value: productCount,
            color: 'warning'
        },
        {
            icon: <FiUsers />,
            label: 'Customers',
            value: userStats.totalUsers,
            color: 'info'
        }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'badge-warning',
            processing: 'badge-info',
            shipped: 'badge-primary',
            delivered: 'badge-success',
            cancelled: 'badge-error'
        };
        return `badge ${styles[status] || 'badge-primary'}`;
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <FiTrendingUp className="stat-trend" />
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="quick-stat">
                    <span className="quick-value">{stats.pendingOrders}</span>
                    <span className="quick-label">Pending Orders</span>
                </div>
                <div className="quick-stat">
                    <span className="quick-value">{stats.processingOrders}</span>
                    <span className="quick-label">Processing</span>
                </div>
                <div className="quick-stat">
                    <span className="quick-value">{stats.deliveredOrders}</span>
                    <span className="quick-label">Delivered</span>
                </div>
                <div className="quick-stat">
                    <span className="quick-value">{userStats.newUsersThisMonth}</span>
                    <span className="quick-label">New Users (This Month)</span>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Orders</h2>
                    <Link to="/admin/orders" className="view-all">
                        View All <FiArrowRight />
                    </Link>
                </div>

                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders?.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <Link to={`/admin/orders/${order._id}`}>
                                                {order.orderNumber}
                                            </Link>
                                        </td>
                                        <td>{order.user?.name || 'Guest'}</td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td className="total">{formatPrice(order.totalAmount)}</td>
                                        <td>
                                            <span className={getStatusBadge(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-table">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/products/new" className="action-card">
                        <FiPackage />
                        <span>Add Product</span>
                    </Link>
                    <Link to="/admin/categories/new" className="action-card">
                        <FiPackage />
                        <span>Add Category</span>
                    </Link>
                    <Link to="/admin/orders" className="action-card">
                        <FiShoppingCart />
                        <span>Manage Orders</span>
                    </Link>
                    <Link to="/admin/users" className="action-card">
                        <FiUsers />
                        <span>View Users</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
