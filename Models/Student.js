const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    personalDetails: {
        phone: String,
        address: String,
        dob: Date
    },
    academicDetails: {
        course: String,
        semester: Number,
        cgpa: Number,
        universityRoll: String,
        passingYear: Number
    },
    // Teacher specific fields
    teacherDetails: {
        department: String,
        designation: String,
        subjects: [String],
        experience: Number,
        qualification: String,
        officeHours: String
    },
    // Notifications received by student
    notifications: [{
        title: String,
        message: String,
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        teacherName: String,
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);