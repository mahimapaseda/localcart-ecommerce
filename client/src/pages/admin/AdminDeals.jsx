import { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX, FiPercent, FiClock } from 'react-icons/fi';
import { formatPrice } from '../../utils/currency';
import api from '../../services/api';
import './AdminDeals.css';

const AdminDeals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, deals, no-deals

    const [dealModal, setDealModal] = useState({ isOpen: false, product: null });
    const [dealPrice, setDealPrice] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?limit=100');
            setProducts(res.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDealModal = (product) => {
        setDealModal({ isOpen: true, product });
        setDealPrice(product.price);
    };

    const handleCloseDealModal = () => {
        setDealModal({ isOpen: false, product: null });
        setDealPrice('');
    };

    const handleSaveDeal = async () => {
        if (!dealPrice || isNaN(dealPrice) || Number(dealPrice) >= dealModal.product.price) {
            alert('Please enter a valid deal price lower than the current price.');
            return;
        }

        try {
            // If product already has a comparePrice (was previously on deal or manually set), keep it valid.
            // Otherwise, the current price becomes the comparePrice (original price).
            const originalPrice = dealModal.product.comparePrice > dealModal.product.price
                ? dealModal.product.comparePrice
                : dealModal.product.price;

            const updates = {
                price: Number(dealPrice),
                comparePrice: originalPrice
            };

            await updateProduct(dealModal.product._id, updates);
            handleCloseDealModal();
        } catch (error) {
            console.error('Error saving deal:', error);
        }
    };

    const handleRemoveDeal = async (product) => {
        try {
            // Restore original price (comparePrice) and clear comparePrice
            const updates = {
                price: product.comparePrice,
                comparePrice: 0
            };

            await updateProduct(product._id, updates);
        } catch (error) {
            console.error('Error removing deal:', error);
        }
    };

    const updateProduct = async (productId, updates) => {
        try {
            await api.put(`/products/${productId}`, updates);
            setProducts(prev => prev.map(p =>
                p._id === productId
                    ? { ...p, ...updates }
                    : p
            ));
        } catch (error) {
            throw error;
        }
    };

    const calculateDiscount = (price, comparePrice) => {
        if (!comparePrice || comparePrice <= price) return 0;
        return Math.round(((comparePrice - price) / comparePrice) * 100);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasDeal = product.comparePrice && product.comparePrice > product.price;

        if (filter === 'deals') return matchesSearch && hasDeal;
        if (filter === 'no-deals') return matchesSearch && !hasDeal;
        return matchesSearch;
    });

    const dealsCount = products.filter(p => p.comparePrice && p.comparePrice > p.price).length;

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-deals">
            <div className="deals-header">
                <div className="header-info">
                    <h1>🔥 Today's Deals</h1>
                    <p>Manage products that appear in the Today's Deals section</p>
                </div>
                <div className="deals-stats">
                    <div className="stat-pill active">
                        <FiPercent />
                        <span>{dealsCount} Active Deals</span>
                    </div>
                    <div className="stat-pill">
                        <FiClock />
                        <span>Ends in 23:59:59</span>
                    </div>
                </div>
            </div>

            <div className="deals-controls">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All Products ({products.length})
                    </button>
                    <button
                        className={filter === 'deals' ? 'active' : ''}
                        onClick={() => setFilter('deals')}
                    >
                        On Deal ({dealsCount})
                    </button>
                    <button
                        className={filter === 'no-deals' ? 'active' : ''}
                        onClick={() => setFilter('no-deals')}
                    >
                        No Deal ({products.length - dealsCount})
                    </button>
                </div>
            </div>

            <div className="deals-grid">
                {filteredProducts.map(product => {
                    const hasDeal = Boolean(product.comparePrice && product.comparePrice > product.price);
                    const discount = calculateDiscount(product.price, product.comparePrice);

                    return (
                        <div key={product._id} className={`deal-card ${hasDeal ? 'active-deal' : ''}`}>
                            <div className="deal-image">
                                <img
                                    src={product.images?.[0] || '/placeholder.jpg'}
                                    alt={product.name}
                                />
                                {hasDeal && (
                                    <div className="deal-badges">
                                        <span className="discount-badge">-{discount}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="deal-content">
                                <div className="deal-header">
                                    <p className="brand">{product.brand}</p>
                                    <h3>{product.name}</h3>
                                </div>

                                <div className="deal-pricing">
                                    <div className="price-stack">
                                        <span className="current-price">{formatPrice(product.price)}</span>
                                        {hasDeal ? (
                                            <span className="original-price">{formatPrice(product.comparePrice)}</span>
                                        ) : (
                                            <span className="price-label">Regular Price</span>
                                        )}
                                    </div>
                                </div>

                                <div className="deal-actions">
                                    {hasDeal ? (
                                        <>
                                            <button
                                                className="btn-action edit"
                                                onClick={() => handleOpenDealModal(product)}
                                                title="Edit Deal Price"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-action remove"
                                                onClick={() => handleRemoveDeal(product)}
                                                title="End Deal"
                                            >
                                                End Deal
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn-action start"
                                            onClick={() => handleOpenDealModal(product)}
                                        >
                                            Start Deal
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="empty-state">
                    <span>🔍</span>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            )}

            {/* Deal Modal */}
            {dealModal.isOpen && (
                <div className="modal-overlay">
                    <div className="deal-modal">
                        <div className="modal-header">
                            <h3>Set Deal Price</h3>
                            <button className="close-btn" onClick={handleCloseDealModal}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="product-summary">
                                <img src={dealModal.product.images?.[0]} alt="" />
                                <div>
                                    <h4>{dealModal.product.name}</h4>
                                    <p>Original Price: {formatPrice(dealModal.product.price)}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deal Price</label>
                                <div className="price-input-group">
                                    <span>Rs.</span>
                                    <input
                                        type="number"
                                        value={dealPrice}
                                        onChange={(e) => setDealPrice(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <p className="helper-text">
                                    Must be lower than {formatPrice(dealModal.product.price)}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseDealModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveDeal}>Confirm Deal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDeals;
