import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import './AdminCategories.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="admin-categories">
            <div className="page-header">
                <h1>Categories</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FiPlus /> Add Category
                </button>
            </div>

            <div className="categories-table">
                {loading ? (
                    <div className="loader"><div className="spinner"></div></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? categories.map((category) => (
                                <tr key={category._id}>
                                    <td className="category-name">{category.name}</td>
                                    <td><code>{category.slug}</code></td>
                                    <td className="description">{category.description || '-'}</td>
                                    <td>
                                        <span className={`badge ${category.isActive ? 'badge-success' : 'badge-secondary'}`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="action-btn edit" onClick={() => openModal(category)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(category._id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="empty">No categories found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
