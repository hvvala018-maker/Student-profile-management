const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../Config/jwtSecret');

// 1. Signup
exports.register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ msg: 'Email already exists' });

        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
        const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, role: user.role });
    } catch (err) {
        console.error('❌ Signup Error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
};

// 2. Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 3. Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 4. Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            { $set: updatedData }, 
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 5. Get All Students (Teacher only)
exports.getAllStudents = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 6. Get Student by ID (Teacher only)
exports.getStudentById = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        const student = await User.findById(req.params.id).select('-password');
        if (!student || student.role !== 'student') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 7. Update Student (Teacher only)
exports.updateStudentByTeacher = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        const student = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 8. Delete Student (Teacher only)
exports.deleteStudent = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 9. Get Dashboard Stats (Teacher only)
exports.getTeacherStats = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        const totalStudents = await User.countDocuments({ role: 'student' });
        const students = await User.find({ role: 'student' });
        
        let avgCgpa = 0;
        let cgpaCount = 0;
        students.forEach(s => {
            if (s.academicDetails?.cgpa) {
                avgCgpa += s.academicDetails.cgpa;
                cgpaCount++;
            }
        });
        avgCgpa = cgpaCount > 0 ? (avgCgpa / cgpaCount).toFixed(2) : 0;
        
        res.json({ totalStudents, avgCgpa });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 10. Send Notification to Students (Teacher only)
exports.sendNotification = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        
        const { title, message, studentIds } = req.body;
        const teacher = await User.findById(req.user._id);
        
        const notification = {
            title,
            message,
            teacherId: req.user._id,
            teacherName: teacher.name,
            date: new Date(),
            read: false
        };
        
        // If studentIds provided, send to specific students, else send to all
        const query = studentIds && studentIds.length > 0 
            ? { _id: { $in: studentIds }, role: 'student' }
            : { role: 'student' };
        
        await User.updateMany(query, {
            $push: { notifications: notification }
        });
        
        const count = await User.countDocuments(query);
        res.json({ msg: `Notification sent to ${count} students`, count });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 11. Get All Teachers (For Students)
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' })
            .select('name email teacherDetails personalDetails');
        res.json(teachers);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 12. Get Notifications (For Students)
exports.getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const notifications = user.notifications || [];
        // Sort by date descending
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 13. Mark Notification as Read
exports.markNotificationRead = async (req, res) => {
    try {
        await User.updateOne(
            { _id: req.user._id, 'notifications._id': req.params.notifId },
            { $set: { 'notifications.$.read': true } }
        );
        res.json({ msg: 'Notification marked as read' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 14. Get Unread Notification Count
exports.getUnreadCount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const unreadCount = (user.notifications || []).filter(n => !n.read).length;
        res.json({ unreadCount });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 15. Get Teacher by ID (Public for students to view)
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id)
            .select('name email teacherDetails personalDetails');
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// ============ MATERIAL FUNCTIONS ============

const Material = require('../Models/Material');

// 16. Add Material (Teacher only)
exports.addMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        
        const teacher = await User.findById(req.user._id);
        
        const materialData = {
            title: req.body.title,
            description: req.body.description,
            subject: req.body.subject,
            type: req.body.type,
            content: req.body.content,
            course: req.body.course,
            semester: req.body.semester ? parseInt(req.body.semester) : null,
            teacherId: req.user._id,
            teacherName: teacher.name,
            department: teacher.teacherDetails?.department
        };
        
        // If file was uploaded
        if (req.file) {
            // Build the correct path - req.file.destination contains the full path, extract just the subdirectory
            const destParts = req.file.destination.replace(/\\/g, '/').split('/uploads');
            const subPath = destParts[destParts.length - 1] || '';
            materialData.fileUrl = `/uploads${subPath}/${req.file.filename}`;
            materialData.fileName = req.file.originalname;
            materialData.fileType = req.file.mimetype;
            materialData.fileSize = req.file.size;
            
            // Auto-detect type based on file
            if (req.file.mimetype.startsWith('image/')) {
                materialData.type = 'image';
            } else if (req.file.mimetype.startsWith('video/')) {
                materialData.type = 'video';
            } else if (req.file.mimetype === 'application/pdf') {
                materialData.type = 'pdf';
            }
        }
        
        const material = new Material(materialData);
        await material.save();
        res.status(201).json({ msg: 'Material added successfully', material });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// 17. Get All Materials (For Students)
exports.getAllMaterials = async (req, res) => {
    try {
        const { subject, type, teacher, course, semester } = req.query;
        let query = {};
        
        if (subject) query.subject = new RegExp(subject, 'i');
        if (type) query.type = type;
        if (teacher) query.teacherId = teacher;
        if (course) query.course = new RegExp(course, 'i');
        if (semester) query.semester = parseInt(semester);
        
        const materials = await Material.find(query)
            .sort({ createdAt: -1 })
            .populate('teacherId', 'name email');
        res.json(materials);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 18. Get My Materials (Teacher only)
exports.getMyMaterials = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        
        const materials = await Material.find({ teacherId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 19. Delete Material (Teacher only - own materials)
exports.deleteMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ msg: 'Material not found' });
        }
        
        // Check if teacher owns this material
        if (material.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to delete this material' });
        }
        
        await Material.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Material deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 20. Update Material (Teacher only - own materials)
exports.updateMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access denied. Teachers only.' });
        }
        
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ msg: 'Material not found' });
        }
        
        if (material.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to update this material' });
        }
        
        const updated = await Material.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};