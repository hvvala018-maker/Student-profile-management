import React, { useEffect, useState } from 'react';
import { getAllTeachers } from '../Services/AuthService';
import { Link } from 'react-router-dom';

const ViewTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await getAllTeachers();
                setTeachers(res.data);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to view teachers.');
                } else {
                    setError('Failed to load teachers.');
                }
            }
            setLoading(false);
        };
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.teacherDetails?.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.teacherDetails?.subjects || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading teachers...</p>
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
            <div className="page-header">
                <h1>👨‍🏫 Our Teachers</h1>
                <p>View all teachers and their subjects</p>
            </div>

            <div className="search-bar">
                <input 
                    type="text"
                    className="form-input"
                    placeholder="🔍 Search by name, department, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="teachers-stats">
                <span className="badge badge-primary">Total Teachers: {teachers.length}</span>
            </div>

            {filteredTeachers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👨‍🏫</div>
                    <h3>No Teachers Found</h3>
                    <p>No teachers match your search.</p>
                </div>
            ) : (
                <div className="teachers-grid">
                    {filteredTeachers.map(teacher => (
                        <div 
                            key={teacher._id} 
                            className="teacher-card"
                            onClick={() => setSelectedTeacher(selectedTeacher?._id === teacher._id ? null : teacher)}
                        >
                            <div className="teacher-card-header">
                                <div className="teacher-avatar">
                                    {teacher.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="teacher-basic-info">
                                    <h3>{teacher.name}</h3>
                                    <p className="teacher-designation">
                                        {teacher.teacherDetails?.designation || 'Teacher'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="teacher-card-body">
                                <div className="teacher-info-row">
                                    <span className="info-label">🏫 Department</span>
                                    <span className="info-value">
                                        {teacher.teacherDetails?.department || 'Not Set'}
                                    </span>
                                </div>
                                <div className="teacher-info-row">
                                    <span className="info-label">📧 Email</span>
                                    <span className="info-value">{teacher.email}</span>
                                </div>
                                <div className="teacher-info-row">
                                    <span className="info-label">📞 Phone</span>
                                    <span className="info-value">
                                        {teacher.personalDetails?.phone || 'Not Available'}
                                    </span>
                                </div>
                                <div className="teacher-info-row">
                                    <span className="info-label">🎓 Experience</span>
                                    <span className="info-value">
                                        {teacher.teacherDetails?.experience 
                                            ? `${teacher.teacherDetails.experience} Years` 
                                            : 'Not Set'}
                                    </span>
                                </div>
                                {teacher.teacherDetails?.qualification && (
                                    <div className="teacher-info-row">
                                        <span className="info-label">📜 Qualification</span>
                                        <span className="info-value">
                                            {teacher.teacherDetails.qualification}
                                        </span>
                                    </div>
                                )}
                                {teacher.teacherDetails?.officeHours && (
                                    <div className="teacher-info-row">
                                        <span className="info-label">🕐 Office Hours</span>
                                        <span className="info-value">
                                            {teacher.teacherDetails.officeHours}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {teacher.teacherDetails?.subjects && teacher.teacherDetails.subjects.length > 0 && (
                                <div className="teacher-subjects">
                                    <span className="subjects-label">📚 Subjects:</span>
                                    <div className="subjects-tags">
                                        {teacher.teacherDetails.subjects.map((subject, idx) => (
                                            <span key={idx} className="subject-tag">{subject}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
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

export default ViewTeachers;
