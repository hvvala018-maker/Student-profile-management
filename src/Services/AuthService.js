import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    return { Authorization: `Bearer ${token}` };
};

// 1. Signup Function
export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};

// 2. Login Function
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
    }
    return response.data;
};

// Logout - clear stored session
export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
};

// Validate token on app startup - returns true if valid, false if expired/invalid
export const validateToken = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return false;
    try {
        await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return true;
    } catch (err) {
        // Token expired or invalid - clear storage
        logout();
        return false;
    }
};

// 3. Get Profile Function
export const getProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return Promise.reject(new Error('NO_TOKEN'));
    }
    return await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 4. Get All Students (Teacher only)
export const getAllStudents = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return Promise.reject(new Error('NO_TOKEN'));
    }
    return await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 5. Get Teacher Stats
export const getTeacherStats = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return Promise.reject(new Error('NO_TOKEN'));
    }
    return await axios.get(`${API_URL}/teacher/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 6. Update Student by Teacher
export const updateStudentByTeacher = async (studentId, data) => {
    const token = localStorage.getItem('userToken');
    return await axios.put(`${API_URL}/students/${studentId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 7. Delete Student
export const deleteStudent = async (studentId) => {
    const token = localStorage.getItem('userToken');
    return await axios.delete(`${API_URL}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 8. Get User Role
export const getUserRole = () => {
    return localStorage.getItem('userRole');
};

// 9. Send Notification (Teacher only)
export const sendNotification = async (title, message, studentIds = []) => {
    const token = localStorage.getItem('userToken');
    return await axios.post(`${API_URL}/notifications/send`, 
        { title, message, studentIds },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// 10. Get Notifications (Student)
export const getNotifications = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return Promise.reject(new Error('NO_TOKEN'));
    return await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 11. Mark Notification as Read
export const markNotificationRead = async (notifId) => {
    const token = localStorage.getItem('userToken');
    return await axios.put(`${API_URL}/notifications/${notifId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 12. Get Unread Count
export const getUnreadCount = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return { data: { unreadCount: 0 } };
    return await axios.get(`${API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 13. Get All Teachers
export const getAllTeachers = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return Promise.reject(new Error('NO_TOKEN'));
    return await axios.get(`${API_URL}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 14. Get Teacher by ID
export const getTeacherById = async (teacherId) => {
    const token = localStorage.getItem('userToken');
    return await axios.get(`${API_URL}/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 15. Update Profile
export const updateProfile = async (data) => {
    const token = localStorage.getItem('userToken');
    return await axios.put(`${API_URL}/update`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// ============ MATERIAL FUNCTIONS ============

// 16. Add Material (Teacher only) - Supports file upload
export const addMaterial = async (materialData, file = null) => {
    const token = localStorage.getItem('userToken');
    
    // Use FormData if file is present
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(materialData).forEach(key => {
            if (materialData[key] !== null && materialData[key] !== '') {
                formData.append(key, materialData[key]);
            }
        });
        
        return await axios.post(`${API_URL}/materials`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    
    // Regular JSON request without file
    return await axios.post(`${API_URL}/materials`, materialData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 17. Get All Materials
export const getAllMaterials = async (filters = {}) => {
    const token = localStorage.getItem('userToken');
    const params = new URLSearchParams(filters).toString();
    return await axios.get(`${API_URL}/materials${params ? `?${params}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 18. Get My Materials (Teacher)
export const getMyMaterials = async () => {
    const token = localStorage.getItem('userToken');
    return await axios.get(`${API_URL}/materials/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 19. Delete Material
export const deleteMaterial = async (materialId) => {
    const token = localStorage.getItem('userToken');
    return await axios.delete(`${API_URL}/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// 20. Update Material
export const updateMaterial = async (materialId, data) => {
    const token = localStorage.getItem('userToken');
    return await axios.put(`${API_URL}/materials/${materialId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};