import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX } from 'react-icons/fi';
import { formatPrice } from '../../utils/currency';
import api from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        brand: '',
        stock: '',
        isFeatured: false,
        images: []
    });
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, categoryFilter, page]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);
            params.append('page', page);
            params.append('limit', 10);

            const { data } = await api.get(`/products?${params}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageUrl.trim()]
            }));
            setImageUrl('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                comparePrice: product.comparePrice || '',
                category: product.category?._id || '',
                brand: product.brand || '',
                stock: product.stock,
                isFeatured: product.isFeatured,
                images: product.images || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                comparePrice: '',
                category: '',
                brand: '',
                stock: '',
                isFeatured: false,
                images: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                comparePrice: formData.comparePrice ? Number(formData.comparePrice) : 0,
                stock: Number(formData.stock)
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, payload);
            } else {
                await api.post('/products', payload);
            }

            closeModal();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="admin-products">
            <div className="page-header">
                <h1>Products</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FiPlus /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="form-select-wrapper">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="products-table">
                {loading ? (
                    <div className="loader"><div className="spinner"></div></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-image">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" />
                                            ) : (
                                                <FiImage />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="product-name">{product.name}</span>
                                    </td>
                                    <td>{product.category?.name || '-'}</td>
                                    <td className="price">{formatPrice(product.price)}</td>
                                    <td>
                                        <span className={`stock ${product.stock < 10 ? 'low' : ''}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        {product.isFeatured ? (
                                            <span className="badge badge-success">Yes</span>
                                        ) : (
                                            <span className="badge badge-secondary">No</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button
                                                className="action-btn edit"
                                                onClick={() => openModal(product)}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="empty">No products found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-secondary"
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-secondary"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Compare Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.comparePrice}
                                            onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-input form-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Brand</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Product Images</label>
                                    <div className="url-input-group">
                                        <input
                                            type="url"
                                            className="form-input"
                                            placeholder="Enter image URL (https://...)"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                        />
                                        <button type="button" className="btn btn-secondary" onClick={handleAddImage}>
                                            <FiPlus /> Add
                                        </button>
                                    </div>
                                    <div className="images-preview-grid">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="image-preview-card">
                                                <img src={url} alt={`Product ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        />
                                        <span>Featured Product</span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update' : 'Create'} Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
