import React, { useState, useEffect } from 'react';
import { getProfile } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileEdit = () => {
    const [formData, setFormData] = useState({
        name: '',
        personalDetails: { phone: '', address: '' },
        academicDetails: { course: '', semester: '', cgpa: '', universityRoll: '', passingYear: '' }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile()
            .then(res => {
                setFormData({
                    ...res.data,
                    personalDetails: res.data.personalDetails || { phone: '', address: '' },
                    academicDetails: res.data.academicDetails || { course: '', semester: '', cgpa: '', universityRoll: '', passingYear: '' }
                });
                setLoading(false);
            })
            .catch(err => {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to edit your profile.');
                } else {
                    setError('Unable to load profile.');
                }
                setLoading(false);
            });
    }, []);

    const handleChange = (e, section) => {
        if (section) {
            setFormData({
                ...formData,
                [section]: { ...formData[section], [e.target.name]: e.target.value }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('userToken');
        try {
            await axios.put('http://localhost:5000/api/students/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (err) {
            alert('Update failed. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading profile...</p>
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
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="details-header">
                    <h2>✏️ Edit Your Profile</h2>
                </div>

                <div className="form-section">
                    <h3 className="section-title">👤 Personal Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-input" 
                                value={formData.name || ''} 
                                onChange={(e) => handleChange(e)} 
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                className="form-input" 
                                value={formData.personalDetails?.phone || ''} 
                                onChange={(e) => handleChange(e, 'personalDetails')} 
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                className="form-input" 
                                value={formData.personalDetails?.address || ''} 
                                onChange={(e) => handleChange(e, 'personalDetails')} 
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">📚 Academic Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Course / Degree</label>
                            <input 
                                type="text" 
                                name="course" 
                                className="form-input" 
                                value={formData.academicDetails?.course || ''} 
                                onChange={(e) => handleChange(e, 'academicDetails')} 
                                placeholder="e.g., B.Tech, BCA, MCA"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Current Semester</label>
                            <input 
                                type="number" 
                                name="semester" 
                                className="form-input" 
                                value={formData.academicDetails?.semester || ''} 
                                onChange={(e) => handleChange(e, 'academicDetails')} 
                                placeholder="e.g., 4"
                                min="1"
                                max="10"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Current CGPA</label>
                            <input 
                                type="text" 
                                name="cgpa" 
                                className="form-input" 
                                value={formData.academicDetails?.cgpa || ''} 
                                onChange={(e) => handleChange(e, 'academicDetails')} 
                                placeholder="e.g., 8.5"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">University Roll No.</label>
                            <input 
                                type="text" 
                                name="universityRoll" 
                                className="form-input" 
                                value={formData.academicDetails?.universityRoll || ''} 
                                onChange={(e) => handleChange(e, 'academicDetails')} 
                                placeholder="e.g., 123456789"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Expected Passing Year</label>
                            <input 
                                type="number" 
                                name="passingYear" 
                                className="form-input" 
                                value={formData.academicDetails?.passingYear || ''} 
                                onChange={(e) => handleChange(e, 'academicDetails')} 
                                placeholder="e.g., 2025"
                                min="2020"
                                max="2030"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section" style={{display: 'flex', gap: '15px', borderBottom: 'none'}}>
                    <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <Link to="/dashboard" className="btn btn-primary">
                        ❌ Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit;