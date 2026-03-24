const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    subject: { type: String, required: true },
    type: { type: String, enum: ['notes', 'assignment', 'video', 'link', 'pdf', 'image', 'other'], default: 'notes' },
    content: String, // For text content or external links
    // File related fields
    fileUrl: String, // URL path to access the file
    fileName: String, // Original file name
    fileType: String, // MIME type
    fileSize: Number, // File size in bytes
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacherName: String,
    department: String,
    semester: Number, // Target semester (optional)
    course: String, // Target course (optional)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);
