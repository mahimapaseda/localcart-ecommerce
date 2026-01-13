import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('localcart-user');
        const token = localStorage.getItem('localcart-token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            setUser(data);
            localStorage.setItem('localcart-user', JSON.stringify(data));
            localStorage.setItem('localcart-token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });

            setUser(data);
            localStorage.setItem('localcart-user', JSON.stringify(data));
            localStorage.setItem('localcart-token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('localcart-user');
        localStorage.removeItem('localcart-token');
        delete api.defaults.headers.common['Authorization'];
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        localStorage.setItem('localcart-user', JSON.stringify({ ...user, ...userData }));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
