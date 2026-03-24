import React, { useEffect, useState } from 'react';
import { getUserRole } from '../Services/AuthService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ViewStudent = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const role = getUserRole();
                if (role !== 'teacher') {
                    navigate('/dashboard');
                    return;
                }
                const token = localStorage.getItem('userToken');
                const res = await axios.get(`http://localhost:5000/api/students/students/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(res.data);
                setLoading(false);
            } catch (err) {
                setError('Unable to load student details.');
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading student details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h2>Error</h2>
                <p className="error-message">{error}</p>
                <Link to="/teacher/students" className="btn btn-primary" style={{marginTop: '20px'}}>
                    Back to Students
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="student-profile-header">
                <div className="large-avatar">
                    {student?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1>{student?.name}</h1>
                    <p className="student-email">{student?.email}</p>
                </div>
            </div>

            <div className="details-grid">
                <div className="details-card">
                    <div className="details-header">
                        <h2>👤 Personal Details</h2>
                    </div>
                    <div className="details-body">
                        <div className="detail-row">
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{student?.personalDetails?.phone || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Address</span>
                            <span className="detail-value">{student?.personalDetails?.address || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Date of Birth</span>
                            <span className="detail-value">
                                {student?.personalDetails?.dob 
                                    ? new Date(student.personalDetails.dob).toLocaleDateString() 
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="details-card">
                    <div className="details-header">
                        <h2>📚 Academic Details</h2>
                    </div>
                    <div className="details-body">
                        <div className="detail-row">
                            <span className="detail-label">Course</span>
                            <span className="detail-value">{student?.academicDetails?.course || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Semester</span>
                            <span className="detail-value">
                                <span className="badge badge-primary">
                                    {student?.academicDetails?.semester ? `Semester ${Math.abs(student.academicDetails.semester)}` : 'N/A'}
                                </span>
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">CGPA</span>
                            <span className="detail-value">
                                <span className="badge badge-success">{student?.academicDetails?.cgpa || 'N/A'}</span>
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">University Roll</span>
                            <span className="detail-value">{student?.academicDetails?.universityRoll || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Passing Year</span>
                            <span className="detail-value">{student?.academicDetails?.passingYear || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: '25px', display: 'flex', gap: '15px'}}>
                <Link to="/teacher/students" className="btn btn-primary">
                    ← Back to Students
                </Link>
                <Link to="/teacher/dashboard" className="btn btn-success">
                    🏠 Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ViewStudent;
