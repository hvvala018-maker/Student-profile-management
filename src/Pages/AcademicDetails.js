import React, { useEffect, useState } from 'react';
import { getProfile } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

const AcademicDetails = () => {
    const [academicData, setAcademicData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcademicInfo = async () => {
            // Check if user is teacher - redirect to teacher dashboard
            const role = localStorage.getItem('userRole');
            if (role === 'teacher') {
                navigate('/teacher/dashboard');
                return;
            }

            try {
                const res = await getProfile();
                setAcademicData(res.data.academicDetails || {});
                setLoading(false);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to view academic details.');
                } else {
                    setError('Unable to load academic details.');
                }
                setLoading(false);
            }
        };
        fetchAcademicInfo();
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading academic records...</p>
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
            <div className="details-card">
                <div className="details-header">
                    <h2>📚 Academic Performance</h2>
                </div>
                <div className="details-body">
                    <div className="detail-row">
                        <span className="detail-label">Course / Degree</span>
                        <span className="detail-value">{academicData.course || 'Not Provided'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Current Semester</span>
                        <span className="detail-value">
                            <span className="badge badge-primary">
                                {academicData.semester ? `Semester ${Math.abs(academicData.semester)}` : 'N/A'}
                            </span>
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Current CGPA</span>
                        <span className="detail-value">
                            <span className="badge badge-success">
                                {academicData.cgpa || 'N/A'}
                            </span>
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">University Roll No.</span>
                        <span className="detail-value">{academicData.universityRoll || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Expected Passing Year</span>
                        <span className="detail-value">{academicData.passingYear || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div style={{marginTop: '25px', display: 'flex', gap: '15px'}}>
                <Link to="/edit" className="btn btn-primary">
                    ✏️ Edit Details
                </Link>
                <Link to="/dashboard" className="btn btn-success">
                    🏠 Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default AcademicDetails;