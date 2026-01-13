import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiTruck, FiCheck, FiX, FiChevronDown, FiFilter, FiSearch } from 'react-icons/fi';
import { formatPrice } from '../../utils/currency';
import api from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [search, setSearch] = useState('');
    const filterRef = useRef(null);
    const orderStatusRef = useRef(null);
    const paymentStatusRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown === 'filter' && filterRef.current && !filterRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (activeDropdown === 'orderStatus' && orderStatusRef.current && !orderStatusRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (activeDropdown === 'paymentStatus' && paymentStatusRef.current && !paymentStatusRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [statusFilter, page, search]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);
            params.append('page', page);
            params.append('limit', 15);

            const { data } = await api.get(`/orders?${params}`);
            setOrders(data.orders);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}`, { status });
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { paymentStatus });
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, paymentStatus });
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

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

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="admin-orders">
            <div className="page-header">
                <h1>Orders</h1>
                <div className="header-actions">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <div className="status-filter" ref={filterRef}>
                        <button
                            className={`dropdown-trigger ${activeDropdown === 'filter' ? 'active' : ''}`}
                            onClick={() => setActiveDropdown(activeDropdown === 'filter' ? null : 'filter')}
                        >
                            <FiFilter className="filter-icon" />
                            <span>
                                {statusFilter
                                    ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                                    : 'All Status'}
                            </span>
                            <FiChevronDown className={`chevron-icon ${activeDropdown === 'filter' ? 'rotate' : ''}`} />
                        </button>

                        {activeDropdown === 'filter' && (
                            <div className="dropdown-menu">
                                <button
                                    className={`dropdown-item ${statusFilter === '' ? 'active' : ''}`}
                                    onClick={() => {
                                        setStatusFilter('');
                                        setActiveDropdown(null);
                                    }}
                                >
                                    All Status
                                </button>
                                {statusOptions.map(status => (
                                    <button
                                        key={status}
                                        className={`dropdown-item ${statusFilter === status ? 'active' : ''}`}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="orders-content">
                {/* Orders Table */}
                <div className="orders-table">
                    {loading ? (
                        <div className="loader"><div className="spinner"></div></div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order._id} className={selectedOrder?._id === order._id ? 'selected' : ''}>
                                        <td>
                                            <span className="order-number">{order.orderNumber}</span>
                                        </td>
                                        <td>
                                            <div className="customer-info">
                                                <span className="name">{order.user?.name || 'Guest'}</span>
                                                <span className="email">{order.user?.email}</span>
                                            </div>
                                        </td>
                                        <td>{order.items?.length} items</td>
                                        <td className="total">{formatPrice(order.totalAmount)}</td>
                                        <td>
                                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={getStatusBadge(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <FiEye />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button
                                                        className="action-btn process"
                                                        onClick={() => handleStatusUpdate(order._id, 'processing')}
                                                        title="Mark Processing"
                                                    >
                                                        <FiTruck />
                                                    </button>
                                                )}
                                                {order.status === 'processing' && (
                                                    <button
                                                        className="action-btn ship"
                                                        onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                                        title="Mark Shipped"
                                                    >
                                                        <FiTruck />
                                                    </button>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <button
                                                        className="action-btn deliver"
                                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                                        title="Mark Delivered"
                                                    >
                                                        <FiCheck />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="empty">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                Previous
                            </button>
                            <span>Page {page} of {totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Details Panel */}
                {selectedOrder && (
                    <div className="order-details">
                        <div className="details-header">
                            <h2>Order {selectedOrder.orderNumber}</h2>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="details-section">
                            <h3>Status</h3>
                            <div className="status-controls">
                                <div className="status-group" ref={orderStatusRef}>
                                    <label>Order Status</label>
                                    <div className="custom-select">
                                        <button
                                            className={`dropdown-trigger ${activeDropdown === 'orderStatus' ? 'active' : ''}`}
                                            onClick={() => setActiveDropdown(activeDropdown === 'orderStatus' ? null : 'orderStatus')}
                                        >
                                            <span>
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                            <FiChevronDown className={`chevron-icon ${activeDropdown === 'orderStatus' ? 'rotate' : ''}`} />
                                        </button>
                                        {activeDropdown === 'orderStatus' && (
                                            <div className="dropdown-menu">
                                                {statusOptions.map(status => (
                                                    <button
                                                        key={status}
                                                        className={`dropdown-item ${selectedOrder.status === status ? 'active' : ''}`}
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedOrder._id, status);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="status-group" ref={paymentStatusRef}>
                                    <label>Payment Status</label>
                                    <div className="custom-select">
                                        <button
                                            className={`dropdown-trigger ${activeDropdown === 'paymentStatus' ? 'active' : ''}`}
                                            onClick={() => setActiveDropdown(activeDropdown === 'paymentStatus' ? null : 'paymentStatus')}
                                        >
                                            <span>
                                                {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                                            </span>
                                            <FiChevronDown className={`chevron-icon ${activeDropdown === 'paymentStatus' ? 'rotate' : ''}`} />
                                        </button>
                                        {activeDropdown === 'paymentStatus' && (
                                            <div className="dropdown-menu">
                                                {['pending', 'paid', 'failed', 'refunded'].map(status => (
                                                    <button
                                                        key={status}
                                                        className={`dropdown-item ${selectedOrder.paymentStatus === status ? 'active' : ''}`}
                                                        onClick={() => {
                                                            handlePaymentStatusUpdate(selectedOrder._id, status);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Customer</h3>
                            <p>{selectedOrder.shippingAddress?.fullName}</p>
                            <p>{selectedOrder.shippingAddress?.phone}</p>
                            <p>{selectedOrder.user?.email}</p>
                        </div>

                        <div className="details-section">
                            <h3>Shipping Address</h3>
                            <p>{selectedOrder.shippingAddress?.street}</p>
                            <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                            <p>{selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}</p>
                        </div>

                        <div className="details-section">
                            <h3>Items</h3>
                            <div className="order-items">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="details-section totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(selectedOrder.itemsTotal)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span>{formatPrice(selectedOrder.shippingCost)}</span>
                            </div>
                            <div className="total-row">
                                <span>Tax</span>
                                <span>{formatPrice(selectedOrder.tax)}</span>
                            </div>
                            <div className="total-row final">
                                <span>Total</span>
                                <span>{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
