import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';
import ProductGrid from '../components/products/ProductGrid';
import api from '../services/api';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '',
        search: searchParams.get('search') || '',
        featured: searchParams.get('featured') || '',
        page: parseInt(searchParams.get('page')) || 1
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

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
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.search) params.append('search', filters.search);
            if (filters.featured) params.append('featured', filters.featured);
            params.append('page', filters.page);
            params.append('limit', 12);

            const { data } = await api.get(`/products?${params}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: '',
            search: '',
            featured: '',
            page: 1
        });
        setSearchParams({});
    };

    const sortOptions = [
        { value: '', label: 'Default' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
        { value: 'popular', label: 'Most Popular' }
    ];

    const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.featured;

    return (
        <div className="products-page">
            <div className="container">
                {/* Header */}
                <div className="products-header">
                    <div className="header-left">
                        <h1>
                            {filters.search ? `Search: "${filters.search}"` :
                                filters.featured ? 'Featured Products' : 'All Products'}
                        </h1>
                        <span className="product-count">Showing {products.length} products</span>
                    </div>
                    <div className="header-right">
                        <div className="sort-dropdown">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="form-select"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <FiChevronDown className="dropdown-icon" />
                        </div>
                    </div>
                </div>

                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button
                                className="close-filters mobile-only"
                                onClick={() => setShowFilters(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <h4>Category</h4>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <label key={cat._id} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.category.split(',').includes(cat._id)}
                                            onChange={(e) => {
                                                const currentCategories = filters.category ? filters.category.split(',') : [];
                                                let newCategories;
                                                if (e.target.checked) {
                                                    newCategories = [...currentCategories, cat._id];
                                                } else {
                                                    newCategories = currentCategories.filter(id => id !== cat._id);
                                                }
                                                handleFilterChange('category', newCategories.join(','));
                                            }}
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="form-input"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Featured */}
                        <div className="filter-group">
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.featured === 'true'}
                                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                                />
                                <span>Featured Products Only</span>
                            </label>
                        </div>

                        {hasActiveFilters && (
                            <button className="btn btn-outline clear-filters" onClick={clearFilters}>
                                Clear All Filters
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className="products-main">
                        <ProductGrid products={products} loading={loading} />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary"
                                    disabled={filters.page <= 1}
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {filters.page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    disabled={filters.page >= totalPages}
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {showFilters && (
                <div className="filters-overlay" onClick={() => setShowFilters(false)} />
            )}
        </div>
    );
};

export default Products;
