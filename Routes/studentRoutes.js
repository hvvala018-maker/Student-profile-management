const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/StudentController');
const auth = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// Public Routes
router.post('/signup', studentController.register);
router.post('/login', studentController.login);

// Protected Routes (auth middleware use ho raha hai)
router.get('/me', auth, studentController.getProfile);
router.put('/update', auth, studentController.updateProfile);

// Teacher Routes
router.get('/students', auth, studentController.getAllStudents);
router.get('/students/:id', auth, studentController.getStudentById);
router.put('/students/:id', auth, studentController.updateStudentByTeacher);
router.delete('/students/:id', auth, studentController.deleteStudent);
router.get('/teacher/stats', auth, studentController.getTeacherStats);

// Notification Routes
router.post('/notifications/send', auth, studentController.sendNotification);
router.get('/notifications', auth, studentController.getNotifications);
router.put('/notifications/:notifId/read', auth, studentController.markNotificationRead);
router.get('/notifications/unread-count', auth, studentController.getUnreadCount);

// Teachers list (for students)
router.get('/teachers', auth, studentController.getAllTeachers);
router.get('/teachers/:id', auth, studentController.getTeacherById);

// Material Routes (with file upload support)
router.post('/materials', auth, upload.single('file'), studentController.addMaterial);
router.get('/materials', auth, studentController.getAllMaterials);
router.get('/materials/my', auth, studentController.getMyMaterials);
router.put('/materials/:id', auth, studentController.updateMaterial);
router.delete('/materials/:id', auth, studentController.deleteMaterial);

module.exports = router;