import React, { useEffect, useState } from 'react';
import { getProfile, getNotifications, getUnreadCount } from '../Services/AuthService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await getProfile();
                setProfile(profileRes.data);
                
                // Fetch notifications
                try {
                    const notifRes = await getNotifications();
                    setRecentNotifications(notifRes.data.slice(0, 3)); // Get latest 3
                    const unreadRes = await getUnreadCount();
                    setUnreadCount(unreadRes.data.unreadCount);
                } catch (e) {
                    console.log('Notifications not available');
                }
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to view your dashboard.');
                } else {
                    setError('Unable to load profile.');
                }
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

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

    if (!profile) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <div className="avatar">
                    {profile.name?.charAt(0).toUpperCase() || '👤'}
                </div>
                <div className="user-info">
                    <h1>Welcome back, {profile.name}! 👋</h1>
                    <p>📧 {profile.email}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple">📚</div>
                    <div className="stat-info">
                        <h3>Course</h3>
                        <p>{profile.academicDetails?.course || 'Not Set'}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">📊</div>
                    <div className="stat-info">
                        <h3>Current CGPA</h3>
                        <p>{profile.academicDetails?.cgpa || 'N/A'}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">📅</div>
                    <div className="stat-info">
                        <h3>Semester</h3>
                        <p>{profile.academicDetails?.semester ? Math.abs(profile.academicDetails.semester) : 'N/A'}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pink">🔔</div>
                    <div className="stat-info">
                        <h3>Notifications</h3>
                        <p>{unreadCount > 0 ? `${unreadCount} New` : 'All Read'}</p>
                    </div>
                </div>
            </div>

            {/* Recent Notifications Section */}
            {recentNotifications.length > 0 && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3>📬 Recent Notifications</h3>
                        <Link to="/notifications" className="view-all-link">View All →</Link>
                    </div>
                    <div className="recent-notifications">
                        {recentNotifications.map(notif => (
                            <div key={notif._id} className={`mini-notification ${!notif.read ? 'unread' : ''}`}>
                                <div className="mini-notif-icon">{notif.read ? '📭' : '📩'}</div>
                                <div className="mini-notif-content">
                                    <span className="mini-notif-title">{notif.title}</span>
                                    <span className="mini-notif-time">{formatDate(notif.date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="quick-links">
                <h3>⚡ Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/edit" className="action-btn action-primary">
                        ✏️ Edit Profile
                    </Link>
                    <Link to="/academic" className="action-btn action-success">
                        📚 Academic Details
                    </Link>
                    <Link to="/teachers" className="action-btn action-warning">
                        👨‍🏫 View Teachers
                    </Link>
                    <Link to="/notifications" className="action-btn action-info">
                        🔔 Notifications
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;