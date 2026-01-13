import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <FiShoppingBag className="empty-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const shippingCost = cart.totalAmount > 10000 ? 0 : 500;
    const tax = cart.totalAmount * 0.1;
    const total = cart.totalAmount + shippingCost + tax;

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.product._id} className="cart-item">
                                <img
                                    src={item.product.images?.[0] || '/placeholder.jpg'}
                                    alt={item.product.name}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <Link to={`/products/${item.product._id}`} className="item-name">
                                        {item.product.name}
                                    </Link>
                                    <span className="item-category">{item.product.category?.name}</span>
                                    <span className="item-price">{formatPrice(item.price)}</span>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                <div className="item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.product._id)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}

                        <div className="cart-actions">
                            <button className="btn btn-secondary" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <Link to="/products" className="btn btn-outline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                            <span>{formatPrice(cart.totalAmount)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax (10%)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>

                        {cart.totalAmount < 10000 && (
                            <div className="free-shipping-notice">
                                Add {formatPrice(10000 - cart.totalAmount)} more for free shipping!
                            </div>
                        )}

                        <div className="summary-divider" />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg checkout-btn"
                            onClick={() => {
                                if (user) {
                                    navigate('/checkout');
                                } else {
                                    navigate('/login', { state: { from: '/checkout' } });
                                }
                            }}
                        >
                            Proceed to Checkout
                        </button>

                        <div className="secure-checkout">
                            🔒 Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
