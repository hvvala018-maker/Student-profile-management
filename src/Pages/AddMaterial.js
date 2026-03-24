import React, { useState, useEffect } from 'react';
import { addMaterial, getMyMaterials, deleteMaterial, getProfile } from '../Services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

const AddMaterial = () => {
    const [materials, setMaterials] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        type: 'notes',
        content: '',
        course: '',
        semester: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const role = localStorage.getItem('userRole');
            if (role !== 'teacher') {
                navigate('/dashboard');
                return;
            }
            
            try {
                const profileRes = await getProfile();
                setProfile(profileRes.data);
                
                const res = await getMyMaterials();
                setMaterials(res.data);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to access this page.');
                } else {
                    setError('Failed to load data.');
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                setError('File size must be less than 50MB');
                return;
            }
            setSelectedFile(file);
            setError('');
            
            // Auto-detect type based on file
            if (file.type.startsWith('image/')) {
                setFormData(prev => ({ ...prev, type: 'image' }));
            } else if (file.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, type: 'video' }));
            } else if (file.type === 'application/pdf') {
                setFormData(prev => ({ ...prev, type: 'pdf' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        setUploadProgress(0);
        
        // Validation
        if (!selectedFile && !formData.content) {
            setError('Please upload a file or provide content/link');
            setSubmitting(false);
            return;
        }
        
        try {
            const dataToSend = {
                title: formData.title,
                description: formData.description,
                subject: formData.subject,
                type: formData.type,
                content: formData.content,
                course: formData.course,
                semester: formData.semester
            };
            
            await addMaterial(dataToSend, selectedFile);
            setSuccess('Material added successfully!');
            setFormData({
                title: '',
                description: '',
                subject: '',
                type: 'notes',
                content: '',
                course: '',
                semester: ''
            });
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';
            
            // Refresh materials list
            const res = await getMyMaterials();
            setMaterials(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add material.');
        }
        setSubmitting(false);
        setUploadProgress(0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        
        try {
            await deleteMaterial(id);
            setMaterials(prev => prev.filter(m => m._id !== id));
            setSuccess('Material deleted successfully!');
        } catch (err) {
            setError('Failed to delete material.');
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            notes: '📝',
            assignment: '📋',
            video: '🎬',
            link: '🔗',
            pdf: '📄',
            image: '🖼️',
            other: '📁'
        };
        return icons[type] || '📁';
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading...</p>
            </div>
        );
    }

    if (error && !profile) {
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
                <h1>📚 Study Materials</h1>
                <p>Add and manage study materials for students</p>
            </div>

            {/* Add Material Form */}
            <div className="material-form-card">
                <h3>➕ Add New Material</h3>
                <form onSubmit={handleSubmit} className="material-form">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input 
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="e.g. Chapter 5 Notes"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject *</label>
                            <input 
                                type="text"
                                name="subject"
                                className="form-input"
                                placeholder="e.g. Data Structures"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select 
                                name="type"
                                className="form-input"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="notes">📝 Notes</option>
                                <option value="assignment">📋 Assignment</option>
                                <option value="video">🎬 Video</option>
                                <option value="link">🔗 External Link</option>
                                <option value="pdf">📄 PDF</option>
                                <option value="image">🖼️ Image</option>
                                <option value="other">📁 Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Course (Optional)</label>
                            <select 
                                name="course"
                                className="form-input"
                                value={formData.course}
                                onChange={handleChange}
                            >
                                <option value="">All Courses</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="BCA">BCA</option>
                                <option value="MCA">MCA</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="BBA">BBA</option>
                                <option value="MBA">MBA</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Semester (Optional)</label>
                            <select 
                                name="semester"
                                className="form-input"
                                value={formData.semester}
                                onChange={handleChange}
                            >
                                <option value="">All Semesters</option>
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            name="description"
                            className="form-textarea"
                            placeholder="Brief description of the material..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    {/* File Upload Section */}
                    <div className="form-group">
                        <label className="form-label">📎 Upload File (PDF, Video, Image)</label>
                        <div className="file-upload-area">
                            <input 
                                type="file"
                                id="file-upload"
                                className="file-input"
                                onChange={handleFileChange}
                                accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx"
                            />
                            <label htmlFor="file-upload" className="file-upload-label">
                                <div className="file-upload-icon">📁</div>
                                <span>Click to upload or drag and drop</span>
                                <span className="file-upload-hint">PDF, Video, Images (Max 50MB)</span>
                            </label>
                        </div>
                        {selectedFile && (
                            <div className="selected-file">
                                <span className="file-icon">{getTypeIcon(formData.type)}</span>
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">({formatFileSize(selectedFile.size)})</span>
                                <button 
                                    type="button" 
                                    className="file-remove"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        document.getElementById('file-upload').value = '';
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-divider">
                        <span>OR</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content / External Link</label>
                        <textarea 
                            name="content"
                            className="form-textarea"
                            placeholder="Paste text content, notes, or external links here..."
                            value={formData.content}
                            onChange={handleChange}
                            rows="5"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                        {submitting ? '📤 Uploading...' : '📤 Add Material'}
                    </button>
                </form>
            </div>

            {/* My Materials List */}
            <div className="my-materials-section">
                <h3>📂 My Materials ({materials.length})</h3>
                
                {materials.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h4>No Materials Yet</h4>
                        <p>Add your first study material above.</p>
                    </div>
                ) : (
                    <div className="materials-list">
                        {materials.map(material => (
                            <div key={material._id} className="material-item">
                                <div className="material-icon">{getTypeIcon(material.type)}</div>
                                <div className="material-info">
                                    <h4>{material.title}</h4>
                                    <div className="material-meta">
                                        <span className="badge badge-primary">{material.subject}</span>
                                        <span className="badge badge-secondary">{material.type}</span>
                                        {material.course && <span className="badge">{material.course}</span>}
                                        {material.semester && <span className="badge">Sem {material.semester}</span>}
                                        {material.fileName && (
                                            <span className="badge badge-success">📎 {material.fileName}</span>
                                        )}
                                    </div>
                                    <p className="material-date">
                                        Added on {formatDate(material.createdAt)}
                                        {material.fileSize && ` • ${formatFileSize(material.fileSize)}`}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(material._id)}
                                    className="btn-delete"
                                    title="Delete Material"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddMaterial;
