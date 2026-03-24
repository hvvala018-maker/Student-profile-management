import React, { useEffect, useState } from 'react';
import { sendNotification, getAllStudents, getUserRole } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

const SendNotification = () => {
    const [formData, setFormData] = useState({ title: '', message: '' });
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [sendToAll, setSendToAll] = useState(true);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const role = getUserRole();
            if (role !== 'teacher') {
                navigate('/dashboard');
                return;
            }
            try {
                const res = await getAllStudents();
                setStudents(res.data);
            } catch (err) {
                setError('Failed to load students');
            }
            setLoading(false);
        };
        init();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            setError('Please fill all fields');
            return;
        }

        setSending(true);
        setError('');
        setSuccess('');

        try {
            const studentIds = sendToAll ? [] : selectedStudents;
            const res = await sendNotification(formData.title, formData.message, studentIds);
            setSuccess(res.data.msg);
            setFormData({ title: '', message: '' });
            setSelectedStudents([]);
        } catch (err) {
            setError('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📢 Send Notification</h1>
                <p>Send announcements and messages to students</p>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-section">
                    <h3>📝 Message Details</h3>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input 
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="e.g., Exam Schedule Update"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea 
                            name="message"
                            className="form-input form-textarea"
                            placeholder="Write your message here..."
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>👥 Recipients</h3>
                    <div className="recipient-toggle">
                        <label className={`toggle-option ${sendToAll ? 'active' : ''}`}>
                            <input 
                                type="radio"
                                checked={sendToAll}
                                onChange={() => setSendToAll(true)}
                            />
                            <span>📢 Send to All Students</span>
                        </label>
                        <label className={`toggle-option ${!sendToAll ? 'active' : ''}`}>
                            <input 
                                type="radio"
                                checked={!sendToAll}
                                onChange={() => setSendToAll(false)}
                            />
                            <span>👤 Select Specific Students</span>
                        </label>
                    </div>

                    {!sendToAll && (
                        <div className="student-select-grid">
                            {students.length === 0 ? (
                                <p className="no-students">No students found</p>
                            ) : (
                                students.map(student => (
                                    <label 
                                        key={student._id} 
                                        className={`student-select-item ${selectedStudents.includes(student._id) ? 'selected' : ''}`}
                                    >
                                        <input 
                                            type="checkbox"
                                            checked={selectedStudents.includes(student._id)}
                                            onChange={() => handleStudentSelect(student._id)}
                                        />
                                        <div className="student-select-avatar">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="student-select-info">
                                            <span className="student-select-name">{student.name}</span>
                                            <span className="student-select-course">
                                                {student.academicDetails?.course || 'No Course'}
                                            </span>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                    
                    {!sendToAll && selectedStudents.length > 0 && (
                        <p className="selected-count">
                            Selected: {selectedStudents.length} student(s)
                        </p>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={sending}>
                        {sending ? 'Sending...' : '📤 Send Notification'}
                    </button>
                    <Link to="/teacher/dashboard" className="btn btn-secondary">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SendNotification;
