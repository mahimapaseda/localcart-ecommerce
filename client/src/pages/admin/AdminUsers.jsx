import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiShield, FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users?page=${page}&limit=15&search=${search}`);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await api.put(`/users/${userId}`, { role });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="admin-users">
            <div className="page-header">
                <div>
                    <h1>Users</h1>
                    <span className="user-count">{users.length} users</span>
                </div>
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="users-table">
                {loading ? (
                    <div className="loader"><div className="spinner"></div></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <FiUser />
                                            </div>
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-email">
                                            <FiMail className="icon" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="role-select"
                                            disabled={user.email === 'admin@localcart.com'}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="join-date">
                                            <FiCalendar className="icon" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        {user.email !== 'admin@localcart.com' && (
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {user.email === 'admin@localcart.com' && (
                                            <span className="protected-badge">
                                                <FiShield /> Protected
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="empty">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
