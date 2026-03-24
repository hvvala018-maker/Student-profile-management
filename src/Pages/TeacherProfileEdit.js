import React, { useEffect, useState } from 'react';
import { getProfile, getUserRole } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherProfileEdit = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        personalDetails: { phone: '', address: '' },
        teacherDetails: { department: '', designation: '', experience: '', subjects: '', qualification: '', officeHours: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const role = getUserRole();
                if (role !== 'teacher') {
                    navigate('/edit');
                    return;
                }
                const res = await getProfile();
                const data = res.data;
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    personalDetails: {
                        phone: data.personalDetails?.phone || '',
                        address: data.personalDetails?.address || ''
                    },
                    teacherDetails: {
                        department: data.teacherDetails?.department || '',
                        designation: data.teacherDetails?.designation || '',
                        experience: data.teacherDetails?.experience || '',
                        subjects: data.teacherDetails?.subjects?.join(', ') || '',
                        qualification: data.teacherDetails?.qualification || '',
                        officeHours: data.teacherDetails?.officeHours || ''
                    }
                });
                setLoading(false);
            } catch (err) {
                setError('Unable to load profile.');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('userToken');
            const dataToSend = {
                name: formData.name,
                personalDetails: formData.personalDetails,
                teacherDetails: {
                    ...formData.teacherDetails,
                    experience: Number(formData.teacherDetails.experience) || 0,
                    subjects: formData.teacherDetails.subjects.split(',').map(s => s.trim()).filter(s => s)
                }
            };
            
            await axios.put('http://localhost:5000/api/students/update', dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile.');
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

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ Edit Teacher Profile</h1>
                <p>Update your personal and professional information</p>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-section">
                    <h3>👤 Basic Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (Read Only)</label>
                            <input 
                                type="email" 
                                className="form-input"
                                value={formData.email}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>📞 Contact Details</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input 
                                type="tel" 
                                name="phone"
                                className="form-input"
                                value={formData.personalDetails.phone}
                                onChange={(e) => handleChange(e, 'personalDetails')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input 
                                type="text" 
                                name="address"
                                className="form-input"
                                value={formData.personalDetails.address}
                                onChange={(e) => handleChange(e, 'personalDetails')}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>🏫 Professional Details</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input 
                                type="text" 
                                name="department"
                                className="form-input"
                                placeholder="e.g., Computer Science"
                                value={formData.teacherDetails.department}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Designation</label>
                            <input 
                                type="text" 
                                name="designation"
                                className="form-input"
                                placeholder="e.g., Assistant Professor"
                                value={formData.teacherDetails.designation}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Experience (Years)</label>
                            <input 
                                type="number" 
                                name="experience"
                                className="form-input"
                                min="0"
                                value={formData.teacherDetails.experience}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Qualification</label>
                            <input 
                                type="text" 
                                name="qualification"
                                className="form-input"
                                placeholder="e.g., M.Tech, PhD"
                                value={formData.teacherDetails.qualification}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Subjects (comma separated)</label>
                            <input 
                                type="text" 
                                name="subjects"
                                className="form-input"
                                placeholder="e.g., Data Structures, Algorithms, DBMS"
                                value={formData.teacherDetails.subjects}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Office Hours</label>
                            <input 
                                type="text" 
                                name="officeHours"
                                className="form-input"
                                placeholder="e.g., Mon-Fri 10AM-12PM"
                                value={formData.teacherDetails.officeHours}
                                onChange={(e) => handleChange(e, 'teacherDetails')}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <Link to="/teacher/dashboard" className="btn btn-secondary">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default TeacherProfileEdit;
