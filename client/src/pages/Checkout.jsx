import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiTruck, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka'
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        selectedCard: null
    });

    const handleCardChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'number') {
            value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
        }
        if (e.target.name === 'expiry') {
            value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
        }
        if (e.target.name === 'cvc') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }
        setCardDetails({ ...cardDetails, [e.target.name]: value });
    };

    const location = useLocation();
    const isBuyNow = location.state?.buyNow;

    if (!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: '/checkout' } } });
        return null;
    }

    if (cart.items.length === 0 && !orderComplete && !isBuyNow) {
        navigate('/cart');
        return null;
    }

    if (cart.items.length === 0 && isBuyNow) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    const shippingCost = cart.totalAmount > 10000 ? 0 : 500;
    const total = cart.totalAmount + shippingCost;

    const handleAddressChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'card' && !cardDetails.selectedCard) {
            if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
                alert('Please fill in all card details');
                return;
            }
        }

        setLoading(true);

        try {
            // Simulate card processing delay
            if (paymentMethod === 'card') {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const { data } = await api.post('/orders', {
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                shippingAddress,
                paymentMethod,
                paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending'
            });

            setOrderNumber(data.orderNumber);
            setOrderComplete(true);
            clearCart();
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">
                            <FiCheck />
                        </div>
                        <h1>Order Placed Successfully!</h1>
                        <p>Thank you for your order. Your order number is:</p>
                        <div className="order-number">{orderNumber}</div>
                        <p className="order-text">
                            We've sent a confirmation email with order details.
                            You can track your order in your account.
                        </p>
                        <div className="success-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                                View Orders
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-icon"><FiTruck /></div>
                        <span>Shipping</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-icon"><FiCreditCard /></div>
                        <span>Payment</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-icon"><FiCheck /></div>
                        <span>Confirm</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    {/* Form */}
                    <div className="checkout-form">
                        {step === 1 && (
                            <form onSubmit={handleShippingSubmit}>
                                <h2><FiMapPin /> Shipping Address</h2>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-input"
                                            value={shippingAddress.fullName}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input"
                                            value={shippingAddress.phone}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        className="form-input"
                                        placeholder="123 Main Street, Apt 4B"
                                        value={shippingAddress.street}
                                        onChange={handleAddressChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-input"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="form-input"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            className="form-input"
                                            value={shippingAddress.zipCode}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="form-input"
                                            value={shippingAddress.country}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Continue to Payment
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handlePaymentSubmit}>
                                <h2><FiCreditCard /> Payment Method</h2>

                                <div className="payment-options">
                                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                        />
                                        <div className="option-content">
                                            <span className="option-title">Cash on Delivery</span>
                                            <span className="option-desc">Pay when you receive</span>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                        />
                                        <div className="option-content">
                                            <span className="option-title">Credit/Debit Card</span>
                                            <span className="option-desc">Visa, Mastercard, etc.</span>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="card-details-form">
                                        <div className="saved-cards">
                                            <label className="form-label">Saved Cards</label>
                                            <div
                                                className={`saved-card-item ${cardDetails.selectedCard === 'card1' ? 'selected' : ''}`}
                                                onClick={() => setCardDetails({ ...cardDetails, selectedCard: 'card1' })}
                                            >
                                                <div className="card-icon"><FiCreditCard /></div>
                                                <div className="card-info">
                                                    <div>
                                                        <div className="card-last4">•••• •••• •••• 4242</div>
                                                        <div className="card-expiry">Expires 12/26</div>
                                                    </div>
                                                    {cardDetails.selectedCard === 'card1' && <FiCheck className="text-primary" />}
                                                </div>
                                            </div>
                                            <div
                                                className={`saved-card-item ${cardDetails.selectedCard === 'card2' ? 'selected' : ''}`}
                                                onClick={() => setCardDetails({ ...cardDetails, selectedCard: 'card2' })}
                                            >
                                                <div className="card-icon"><FiCreditCard /></div>
                                                <div className="card-info">
                                                    <div>
                                                        <div className="card-last4">•••• •••• •••• 8888</div>
                                                        <div className="card-expiry">Expires 09/25</div>
                                                    </div>
                                                    {cardDetails.selectedCard === 'card2' && <FiCheck className="text-primary" />}
                                                </div>
                                            </div>

                                            {cardDetails.selectedCard && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline mt-2"
                                                    onClick={() => setCardDetails({ ...cardDetails, selectedCard: null })}
                                                >
                                                    Use a new card
                                                </button>
                                            )}
                                        </div>

                                        {!cardDetails.selectedCard && (
                                            <>
                                                <div className="summary-divider"></div>

                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Card Number</label>
                                                        <input
                                                            type="text"
                                                            name="number"
                                                            className="form-input"
                                                            placeholder="0000 0000 0000 0000"
                                                            value={cardDetails.number}
                                                            onChange={handleCardChange}
                                                            maxLength="19"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Name on Card</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="form-input"
                                                            placeholder="John Doe"
                                                            value={cardDetails.name}
                                                            onChange={handleCardChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            name="expiry"
                                                            className="form-input"
                                                            placeholder="MM/YY"
                                                            value={cardDetails.expiry}
                                                            onChange={handleCardChange}
                                                            maxLength="5"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">CVC</label>
                                                        <input
                                                            type="text"
                                                            name="cvc"
                                                            className="form-input"
                                                            placeholder="123"
                                                            value={cardDetails.cvc}
                                                            onChange={handleCardChange}
                                                            maxLength="3"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="summary-item">
                                    <img src={item.product.images?.[0] || '/placeholder.jpg'} alt="" />
                                    <div className="item-info">
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(cart.totalAmount)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>{formatPrice(0)}</span>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
