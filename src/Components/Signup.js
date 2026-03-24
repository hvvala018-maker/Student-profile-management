import React, { useState } from 'react';
import { signup } from '../Services/AuthService';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [user, setUser] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'student',
        // Student fields
        course: '',
        semester: '',
        // Teacher fields
        department: '',
        designation: '',
        subjects: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Prepare data based on role
        let signupData = {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        };

        if (user.role === 'student') {
            signupData.academicDetails = {
                course: user.course,
                semester: parseInt(user.semester) || 1
            };
        } else {
            signupData.teacherDetails = {
                department: user.department,
                designation: user.designation,
                subjects: user.subjects.split(',').map(s => s.trim()).filter(s => s)
            };
        }

        try {
            await signup(signupData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card signup-card">
                <div className="auth-header">
                    <h2>Create Account 🎓</h2>
                    <p>Join the portal today</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-body">
                    {error && (
                        <div style={{background: '#ffe6e6', color: '#d63031', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <div className="role-selector">
                            <label className={`role-option ${user.role === 'student' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="student" 
                                    checked={user.role === 'student'}
                                    onChange={handleChange}
                                />
                                <span className="role-icon">🎓</span>
                                <span>Student</span>
                            </label>
                            <label className={`role-option ${user.role === 'teacher' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="teacher" 
                                    checked={user.role === 'teacher'}
                                    onChange={handleChange}
                                />
                                <span className="role-icon">👨‍🏫</span>
                                <span>Teacher</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={user.name}
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-input"
                            placeholder="Create a strong password"
                            value={user.password}
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    {/* Student Specific Fields */}
                    {user.role === 'student' && (
                        <div className="role-fields student-fields">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">📚 Course</label>
                                    <select 
                                        name="course"
                                        className="form-input"
                                        value={user.course}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="BCA">BCA</option>
                                        <option value="MCA">MCA</option>
                                        <option value="M.Tech">M.Tech</option>
                                        <option value="BBA">BBA</option>
                                        <option value="MBA">MBA</option>
                                        <option value="B.Sc">B.Sc</option>
                                        <option value="M.Sc">M.Sc</option>
                                        <option value="B.Com">B.Com</option>
                                        <option value="BA">BA</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📅 Semester</label>
                                    <select 
                                        name="semester"
                                        className="form-input"
                                        value={user.semester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Semester</option>
                                        {[1,2,3,4,5,6,7,8].map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Teacher Specific Fields */}
                    {user.role === 'teacher' && (
                        <div className="role-fields teacher-fields">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">🏢 Department</label>
                                    <select 
                                        name="department"
                                        className="form-input"
                                        value={user.department}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Management">Management</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">👔 Designation</label>
                                    <select 
                                        name="designation"
                                        className="form-input"
                                        value={user.designation}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="Professor">Professor</option>
                                        <option value="Associate Professor">Associate Professor</option>
                                        <option value="Assistant Professor">Assistant Professor</option>
                                        <option value="Lecturer">Lecturer</option>
                                        <option value="HOD">HOD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">📖 Subjects (comma separated)</label>
                                <input 
                                    type="text" 
                                    name="subjects"
                                    className="form-input"
                                    placeholder="e.g. Data Structures, Algorithms, DBMS"
                                    value={user.subjects}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating Account...' : '✨ Sign Up'}
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;