import React, { useEffect, useState } from 'react';
import { getProfile, getTeacherStats } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ totalStudents: 0, avgCgpa: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await getProfile();
                if (profileRes.data.role !== 'teacher') {
                    navigate('/dashboard');
                    return;
                }
                setProfile(profileRes.data);
                
                const statsRes = await getTeacherStats();
                setStats(statsRes.data);
                setLoading(false);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to access teacher dashboard.');
                } else {
                    setError('Unable to load dashboard.');
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading dashboard...</p>
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

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <div>
                    <h1>👨‍🏫 Teacher Dashboard</h1>
                    <p className="welcome-text">Welcome back, <strong>{profile?.name}</strong>!</p>
                </div>
                <div className="header-badge teacher-badge">
                    <span>👨‍🏫</span> Teacher
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-purple">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalStudents}</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div className="stat-card stat-blue">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>{stats.avgCgpa}</h3>
                        <p>Average CGPA</p>
                    </div>
                </div>
                <div className="stat-card stat-green">
                    <div className="stat-icon">🏫</div>
                    <div className="stat-info">
                        <h3>{profile?.teacherDetails?.department || 'N/A'}</h3>
                        <p>Department</p>
                    </div>
                </div>
                <div className="stat-card stat-orange">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>{profile?.teacherDetails?.subjects?.length || 0}</h3>
                        <p>Subjects</p>
                    </div>
                </div>
            </div>

            <div className="teacher-info-card">
                <h3>📋 Your Profile</h3>
                <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{profile?.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Designation</span>
                    <span className="detail-value">{profile?.teacherDetails?.designation || 'Not Set'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Qualification</span>
                    <span className="detail-value">{profile?.teacherDetails?.qualification || 'Not Set'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">{profile?.teacherDetails?.experience ? `${profile.teacherDetails.experience} Years` : 'Not Set'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Office Hours</span>
                    <span className="detail-value">{profile?.teacherDetails?.officeHours || 'Not Set'}</span>
                </div>
                {profile?.teacherDetails?.subjects?.length > 0 && (
                    <div className="detail-row">
                        <span className="detail-label">Subjects</span>
                        <div className="subjects-tags">
                            {profile.teacherDetails.subjects.map((sub, i) => (
                                <span key={i} className="subject-tag">{sub}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h3>⚡ Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/teacher/students" className="action-btn action-primary">
                        👥 Manage Students
                    </Link>
                    <Link to="/teacher/notify" className="action-btn action-warning">
                        📢 Send Notification
                    </Link>
                    <Link to="/teacher/edit" className="action-btn action-success">
                        ✏️ Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
