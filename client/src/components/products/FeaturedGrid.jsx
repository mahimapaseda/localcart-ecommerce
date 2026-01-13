import FeaturedProductCard from './FeaturedProductCard';
import './FeaturedGrid.css';

const FeaturedGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="featured-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="featured-skeleton">
                        <div className="skeleton featured-skeleton-image"></div>
                        <div className="featured-skeleton-info">
                            <div className="skeleton featured-skeleton-text"></div>
                            <div className="skeleton featured-skeleton-text short"></div>
                            <div className="skeleton featured-skeleton-price"></div>
                            <div className="skeleton featured-skeleton-text short"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="featured-empty">
                <div className="featured-empty-icon">🛍️</div>
                <h3>No featured products</h3>
                <p>Check back soon for featured items</p>
            </div>
        );
    }

    return (
        <div className="featured-grid">
            {products.map(product => (
                <FeaturedProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default FeaturedGrid;
