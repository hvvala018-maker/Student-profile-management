import React, { useEffect, useState } from 'react';
import { getAllMaterials } from '../Services/AuthService';
import { Link } from 'react-router-dom';

const ViewMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    
    // Filters
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        subject: ''
    });

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await getAllMaterials();
                setMaterials(res.data);
                setFilteredMaterials(res.data);
            } catch (err) {
                if (err.message === 'NO_TOKEN') {
                    setError('Please login to view materials.');
                } else {
                    setError('Failed to load materials.');
                }
            }
            setLoading(false);
        };
        fetchMaterials();
    }, []);

    useEffect(() => {
        let filtered = [...materials];
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(m => 
                m.title.toLowerCase().includes(searchLower) ||
                m.subject.toLowerCase().includes(searchLower) ||
                m.teacherName?.toLowerCase().includes(searchLower) ||
                m.description?.toLowerCase().includes(searchLower)
            );
        }
        
        if (filters.type) {
            filtered = filtered.filter(m => m.type === filters.type);
        }
        
        if (filters.subject) {
            filtered = filtered.filter(m => 
                m.subject.toLowerCase().includes(filters.subject.toLowerCase())
            );
        }
        
        setFilteredMaterials(filtered);
    }, [filters, materials]);

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

    const getTypeColor = (type) => {
        const colors = {
            notes: 'badge-primary',
            assignment: 'badge-warning',
            video: 'badge-danger',
            link: 'badge-info',
            pdf: 'badge-success',
            image: 'badge-purple',
            other: 'badge-secondary'
        };
        return colors[type] || 'badge-secondary';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileUrl = (fileUrl) => {
        if (!fileUrl) return '';
        // If it's a relative path, prepend the server URL
        if (fileUrl.startsWith('/')) {
            return `http://localhost:5000${fileUrl}`;
        }
        return fileUrl;
    };

    const renderFilePreview = (material) => {
        if (!material.fileUrl) return null;
        
        const fileUrl = getFileUrl(material.fileUrl);
        
        if (material.fileType?.startsWith('image/')) {
            return (
                <div className="material-file-preview">
                    <img src={fileUrl} alt={material.title} />
                    <div className="file-actions">
                        <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="download-btn"
                        >
                            🔍 Open Full Size
                        </a>
                        <a 
                            href={fileUrl} 
                            download={material.fileName}
                            className="download-btn"
                        >
                            📥 Download Image
                        </a>
                    </div>
                </div>
            );
        }
        
        if (material.fileType?.startsWith('video/')) {
            return (
                <div className="material-file-preview">
                    <video controls>
                        <source src={fileUrl} type={material.fileType} />
                        Your browser does not support the video tag.
                    </video>
                    <div className="file-actions">
                        <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="download-btn"
                        >
                            🎬 Open in New Tab
                        </a>
                        <a 
                            href={fileUrl} 
                            download={material.fileName}
                            className="download-btn"
                        >
                            📥 Download Video
                        </a>
                    </div>
                </div>
            );
        }
        
        if (material.fileType === 'application/pdf') {
            return (
                <div className="material-file-preview">
                    <div className="pdf-preview">
                        <span className="pdf-icon">📄</span>
                        <span>{material.fileName}</span>
                        <div className="file-actions">
                            <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="download-btn"
                            >
                                🔍 View PDF
                            </a>
                            <a 
                                href={fileUrl} 
                                download={material.fileName}
                                className="download-btn"
                            >
                                📥 Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
        
        // For other file types
        return (
            <div className="material-file-preview">
                <div className="pdf-preview">
                    <span className="pdf-icon">📁</span>
                    <span>{material.fileName}</span>
                    <div className="file-actions">
                        <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="download-btn"
                        >
                            🔍 Open File
                        </a>
                        <a 
                            href={fileUrl} 
                            download={material.fileName}
                            className="download-btn"
                        >
                            📥 Download File
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const uniqueSubjects = [...new Set(materials.map(m => m.subject))];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '20px'}}>Loading materials...</p>
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
                <h1>📚 Study Materials</h1>
                <p>Access study materials shared by your teachers</p>
            </div>

            {/* Search and Filters */}
            <div className="materials-filters">
                <div className="search-box">
                    <input 
                        type="text"
                        className="form-input"
                        placeholder="🔍 Search materials..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>
                <div className="filter-group">
                    <select 
                        className="form-input"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option value="">All Types</option>
                        <option value="notes">📝 Notes</option>
                        <option value="assignment">📋 Assignment</option>
                        <option value="video">🎬 Video</option>
                        <option value="link">🔗 Link</option>
                        <option value="pdf">📄 PDF</option>
                        <option value="image">🖼️ Image</option>
                        <option value="other">📁 Other</option>
                    </select>
                    <select 
                        className="form-input"
                        value={filters.subject}
                        onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    >
                        <option value="">All Subjects</option>
                        {uniqueSubjects.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="materials-stats">
                <span className="badge badge-primary">Total: {filteredMaterials.length} materials</span>
            </div>

            {filteredMaterials.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Materials Found</h3>
                    <p>
                        {materials.length === 0 
                            ? "No study materials have been shared yet." 
                            : "Try adjusting your search or filters."}
                    </p>
                </div>
            ) : (
                <div className="materials-grid">
                    {filteredMaterials.map(material => (
                        <div 
                            key={material._id} 
                            className="material-card"
                            onClick={() => setSelectedMaterial(
                                selectedMaterial?._id === material._id ? null : material
                            )}
                        >
                            <div className="material-card-header">
                                <span className="material-type-icon">{getTypeIcon(material.type)}</span>
                                <span className={`badge ${getTypeColor(material.type)}`}>
                                    {material.type}
                                </span>
                            </div>
                            <h3 className="material-title">{material.title}</h3>
                            <div className="material-subject">
                                <span className="badge badge-outline">{material.subject}</span>
                            </div>
                            {material.description && (
                                <p className="material-description">{material.description}</p>
                            )}
                            <div className="material-footer">
                                <span className="teacher-info">
                                    👨‍🏫 {material.teacherName || 'Unknown'}
                                </span>
                                <span className="material-date">
                                    {formatDate(material.createdAt)}
                                </span>
                            </div>
                            
                            {/* Expanded Content */}
                            {selectedMaterial?._id === material._id && (
                                <div className="material-expanded">
                                    <hr />
                                    
                                    {/* File Preview */}
                                    {material.fileUrl && (
                                        <div className="material-content-section">
                                            <h4>📎 Attached File {material.fileSize && <small>({formatFileSize(material.fileSize)})</small>}</h4>
                                            {renderFilePreview(material)}
                                        </div>
                                    )}
                                    
                                    {/* Text Content */}
                                    {material.content && (
                                        <div className="material-content-section">
                                            <h4>📖 Content</h4>
                                            <div className="material-content">
                                                {material.content?.startsWith('http') ? (
                                                    <a 
                                                        href={material.content} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="material-link"
                                                    >
                                                        🔗 Open Link
                                                    </a>
                                                ) : (
                                                    <pre className="content-text">{material.content}</pre>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {(material.course || material.semester) && (
                                        <div className="material-tags">
                                            {material.course && (
                                                <span className="badge">📚 {material.course}</span>
                                            )}
                                            {material.semester && (
                                                <span className="badge">📅 Sem {material.semester}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewMaterials;
