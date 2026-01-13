import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import api from '../services/api';
import './Orders.css';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/my');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock />;
            case 'processing': return <FiPackage />;
            case 'shipped': return <FiTruck />;
            case 'delivered': return <FiCheck />;
            default: return <FiPackage />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'badge-warning';
            case 'processing': return 'badge-info';
            case 'shipped': return 'badge-primary';
            case 'delivered': return 'badge-success';
            case 'cancelled': return 'badge-error';
            default: return 'badge-primary';
        }
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="loader"><div className="spinner"></div></div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <FiPackage className="empty-icon" />
                        <h2>No orders yet</h2>
                        <p>You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-layout">
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className={`order-card ${selectedOrder?._id === order._id ? 'active' : ''}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="order-header">
                                        <span className="order-number">Order #{order.orderNumber}</span>
                                        <span className={`badge ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)} {order.status}
                                        </span>
                                    </div>
                                    <div className="order-meta">
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span>{order.items?.length} items</span>
                                        <span className="order-total">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="order-items-preview">
                                        {order.items?.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="item-preview">
                                                <img
                                                    src={item.image || '/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="item-image-sm"
                                                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                                />
                                                <span className="item-name">{item.name}</span>
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <span className="more-items">+{order.items.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedOrder && (
                            <div className="order-detail">
                                <div className="detail-header">
                                    <h2>Order #{selectedOrder.orderNumber}</h2>
                                    <span className={`badge ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <h3>Items</h3>
                                    <div className="order-items">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="order-item">
                                                <div className="item-main">
                                                    <img
                                                        src={item.image || '/placeholder.jpg'}
                                                        alt={item.name}
                                                        className="item-image-md"
                                                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                                    />
                                                    <div className="item-info">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-qty">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>Shipping Address</h3>
                                    <p>{selectedOrder.shippingAddress?.fullName}</p>
                                    <p>{selectedOrder.shippingAddress?.street}</p>
                                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                                    <p>{selectedOrder.shippingAddress?.country}</p>
                                </div>

                                <div className="detail-section totals">
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
                )}
            </div>
        </div>
    );
};

export default Orders;
