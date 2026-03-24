import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudent, getUserRole } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const role = getUserRole();
                if (role !== 'teacher') {
                    navigate('/dashboard');
                    return;
                }
                const res = await getAllStudents();
                setStudents(res.data);
                setLoading(false);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to access this page.');
                } else {
                    setError('Unable to load students.');
                }
                setLoading(false);
            }
        };
        fetchStudents();
    }, [navigate]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteStudent(id);
                setStudents(students.filter(s => s._id !== id));
            } catch (err) {
                alert('Failed to delete student');
            }
        }
    };

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.academicDetails?.course || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading students...</p>
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
                <h1>👥 Manage Students</h1>
                <p>View and manage all student records</p>
            </div>

            <div className="search-bar">
                <input 
                    type="text"
                    className="form-input"
                    placeholder="🔍 Search by name, email, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="students-stats">
                <span className="badge badge-primary">Total: {students.length}</span>
                <span className="badge badge-success">Showing: {filteredStudents.length}</span>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Students Found</h3>
                    <p>No students match your search criteria.</p>
                </div>
            ) : (
                <div className="students-grid">
                    {filteredStudents.map(student => (
                        <div key={student._id} className="student-card">
                            <div className="student-avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                                <h3>{student.name}</h3>
                                <p className="student-email">{student.email}</p>
                                <div className="student-details">
                                    <span className="badge badge-primary">
                                        {student.academicDetails?.course || 'No Course'}
                                    </span>
                                    <span className="badge badge-success">
                                        Sem {Math.abs(student.academicDetails?.semester) || 'N/A'}
                                    </span>
                                    <span className="badge badge-warning">
                                        CGPA: {student.academicDetails?.cgpa || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="student-actions">
                                <Link to={`/teacher/student/${student._id}`} className="btn-icon btn-view" title="View Details">
                                    👁️
                                </Link>
                                <button onClick={() => handleDelete(student._id, student.name)} className="btn-icon btn-delete" title="Delete">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{marginTop: '25px'}}>
                <Link to="/teacher/dashboard" className="btn btn-primary">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ManageStudents;
