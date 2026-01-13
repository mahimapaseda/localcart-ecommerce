import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    // Load cart from localStorage for guest users or from API for authenticated users
    useEffect(() => {
        const syncCart = async () => {
            const savedCart = localStorage.getItem('localcart-cart');

            if (isAuthenticated) {
                if (savedCart) {
                    // If we have a saved guest cart and just logged in, merge it
                    try {
                        const parsedCart = JSON.parse(savedCart);
                        if (parsedCart.items && parsedCart.items.length > 0) {
                            await api.post('/cart/merge', { items: parsedCart.items });
                            // Clear local cart after successful merge
                            localStorage.removeItem('localcart-cart');
                        }
                    } catch (error) {
                        console.error('Error merging cart:', error);
                    }
                }
                fetchCart();
            } else {
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            }
        };

        syncCart();
    }, [isAuthenticated]);

    // Save cart to localStorage for guest users
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('localcart-cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.post('/cart', {
                    productId: product._id,
                    quantity
                });
                setCart(data);
                toast.success('Added to cart');
                return { success: true };
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to add to cart';
                toast.error(message);
                return {
                    success: false,
                    error: message
                };
            }
        } else {
            // Guest cart
            setCart(prev => {
                const existingIndex = prev.items.findIndex(
                    item => item.product._id === product._id
                );

                let newItems;
                if (existingIndex > -1) {
                    newItems = [...prev.items];
                    newItems[existingIndex].quantity += quantity;
                } else {
                    newItems = [...prev.items, { product, quantity, price: product.price }];
                }

                const totalAmount = newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );

                return { items: newItems, totalAmount };
            });
            toast.success('Added to cart');
            return { success: true };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.put(`/cart/${productId}`, { quantity });
                setCart(data);
            } catch (error) {
                console.error('Error updating cart:', error);
            }
        } else {
            setCart(prev => {
                let newItems;
                if (quantity <= 0) {
                    newItems = prev.items.filter(item => item.product._id !== productId);
                } else {
                    newItems = prev.items.map(item =>
                        item.product._id === productId
                            ? { ...item, quantity }
                            : item
                    );
                }

                const totalAmount = newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );

                return { items: newItems, totalAmount };
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.delete(`/cart/${productId}`);
                setCart(data);
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        } else {
            setCart(prev => {
                const newItems = prev.items.filter(item => item.product._id !== productId);
                const totalAmount = newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );
                return { items: newItems, totalAmount };
            });
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await api.delete('/cart');
                setCart({ items: [], totalAmount: 0 });
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    };

    const getCartCount = () => {
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        refreshCart: fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
