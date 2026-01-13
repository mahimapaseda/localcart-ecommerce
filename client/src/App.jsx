import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDeals from './pages/admin/AdminDeals';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <Toaster position="top-center" reverseOrder={false} />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="products" element={<Products />} />
                                <Route path="products/:id" element={<ProductDetail />} />
                                <Route path="cart" element={<Cart />} />
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="wishlist" element={<Wishlist />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="categories" element={<AdminCategories />} />
                                <Route path="deals" element={<AdminDeals />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="settings" element={<AdminSettings />} />
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
