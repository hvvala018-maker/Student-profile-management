import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../Services/AuthService';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotifications();
                setNotifications(res.data);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to view notifications.');
                } else {
                    setError('Failed to load notifications.');
                }
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const handleMarkRead = async (notifId) => {
        try {
            await markNotificationRead(notifId);
            setNotifications(prev => 
                prev.map(n => n._id === notifId ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 60) return `${mins} min ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading notifications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">🔒</div>
                <h2>Access Required</h2>
                <p className="error-message">{error}</p>
                <Link to="/login" className="btn btn-primary" style={{marginTop: '20px'}}>
                    Go to Login
                </Link>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🔔 Notifications</h1>
                <p>Messages and announcements from your teachers</p>
            </div>

            <div className="notification-stats">
                <span className="badge badge-primary">Total: {notifications.length}</span>
                {unreadCount > 0 && (
                    <span className="badge badge-warning">Unread: {unreadCount}</span>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Notifications</h3>
                    <p>You don't have any notifications yet.</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notif => (
                        <div 
                            key={notif._id} 
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => !notif.read && handleMarkRead(notif._id)}
                        >
                            <div className="notification-icon">
                                {notif.read ? '📬' : '📩'}
                            </div>
                            <div className="notification-content">
                                <div className="notification-header">
                                    <h3 className="notification-title">{notif.title}</h3>
                                    <span className="notification-time">{formatDate(notif.date)}</span>
                                </div>
                                <p className="notification-message">{notif.message}</p>
                                <div className="notification-footer">
                                    <span className="notification-sender">
                                        👨‍🏫 {notif.teacherName || 'Teacher'}
                                    </span>
                                    {!notif.read && (
                                        <span className="unread-badge">New</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{marginTop: '25px'}}>
                <Link to="/dashboard" className="btn btn-primary">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Notifications;
