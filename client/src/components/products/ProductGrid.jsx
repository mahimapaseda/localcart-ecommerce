import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="product-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="product-skeleton">
                        <div className="skeleton skeleton-image"></div>
                        <div className="skeleton-info">
                            <div className="skeleton skeleton-text short"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text medium"></div>
                            <div className="skeleton skeleton-text short"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="empty-products">
                <div className="empty-icon">🛍️</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
