const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-registration';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('✅ Connected to MongoDB');
});

// Student Schema
const studentSchema = new mongoose.Schema({
    admitId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: ''
    },
    testCenter: {
        type: String,
        required: true
    },
    result: {
        type: String,
        default: 'Pending'
    },
    score: {
        type: String,
        default: 'Not Available'
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Routes

// Register student
app.post('/api/students/register', async (req, res) => {
    try {
        const { name, father, grade, contact, school, photoUrl, center } = req.body;

        // Validation
        if (!name || !father || !grade || !contact || !school || !center) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Generate admit ID
        const admitId = `AZM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Create new student
        const newStudent = new Student({
            admitId,
            name,
            fatherName: father,
            grade,
            contact,
            school,
            photoUrl: photoUrl || '',
            testCenter: center
        });

        // Save to database
        const savedStudent = await newStudent.save();

        res.json({
            success: true,
            data: {
                admitId: savedStudent.admitId,
                studentId: savedStudent._id
            },
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate admit ID generated. Please try again.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Get student by admit ID
app.get('/api/students/:admitId', async (req, res) => {
    try {
        const { admitId } = req.params;

        const student = await Student.findOne({ admitId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found with this admit ID'
            });
        }

        res.json({
            success: true,
            data: {
                name: student.name,
                father: student.fatherName,
                grade: student.grade,
                contact: student.contact,
                school: student.school,
                photoUrl: student.photoUrl,
                center: student.testCenter,
                admitId: student.admitId,
                result: student.result,
                score: student.score,
                createdAt: student.createdAt
            }
        });

    } catch (error) {
        console.error('Fetch student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching student data'
        });
    }
});

// Update student result (for admin)
app.put('/api/students/:admitId/result', async (req, res) => {
    try {
        const { admitId } = req.params;
        const { result, score } = req.body;

        const updatedStudent = await Student.findOneAndUpdate(
            { admitId },
            { result, score },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Result updated successfully',
            data: updatedStudent
        });

    } catch (error) {
        console.error('Update result error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating result'
        });
    }
});

// Get all students (for admin)
app.get('/api/admin/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: students,
            count: students.length
        });

    } catch (error) {
        console.error('Fetch all students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching students'
        });
    }
});
// Find student by phone number
// Find student by phone number - IMPROVED VERSION
app.get('/api/students/phone/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        
        // Clean the phone number for search
        const cleanPhone = phone.replace(/\D/g, '');
        
        console.log('Searching for phone:', cleanPhone); // Debug log

        // Search with partial matching to handle different formats
        const student = await Student.findOne({ 
            contact: { $regex: cleanPhone, $options: 'i' } 
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'No student found with this phone number'
            });
        }

        res.json({
            success: true,
            data: {
                admitId: student.admitId,
                name: student.name,
                grade: student.grade
            }
        });

    } catch (error) {
        console.error('Find student by phone error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while finding student'
        });
    }
});
// Admin Panel Routes - Add to server.js

// Get all students with pagination
app.get('/api/admin/students', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { admitId: { $regex: search, $options: 'i' } },
                { school: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const students = await Student.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Student.countDocuments(query);

        res.json({
            success: true,
            data: students,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalStudents: total
            }
        });

    } catch (error) {
        console.error('Fetch students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching students'
        });
    }
});

// Update student
app.put('/api/admin/students/:admitId', async (req, res) => {
    try {
        const { admitId } = req.params;
        const updateData = req.body;

        const updatedStudent = await Student.findOneAndUpdate(
            { admitId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating student'
        });
    }
});

// Delete student
app.delete('/api/admin/students/:admitId', async (req, res) => {
    try {
        const { admitId } = req.params;

        const deletedStudent = await Student.findOneAndDelete({ admitId });

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting student'
        });
    }
});
// Delete student (for admin)
app.delete('/api/admin/students/:admitId', async (req, res) => {
    try {
        const { admitId } = req.params;

        const deletedStudent = await Student.findOneAndDelete({ admitId });

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting student'
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🗄️  MongoDB URI: ${MONGODB_URI}`);
});