const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title là bắt buộc'],
        trim: true,
        maxLength: [200, 'Title không được vượt quá 200 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Description là bắt buộc'],
        maxLength: [1000, 'Description không được vượt quá 1000 ký tự']
    },
    price: {
        type: Number,
        required: [true, 'Price là bắt buộc'],
        min: [0, 'Price không được âm']
    },
    instructor: {
        type: String,
        required: [true, 'Instructor là bắt buộc'],
        trim: true
    },
    thumbnail: {
        type: String,
        default: '/uploads/default-thumbnail.jpg'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    category: {
        type: String,
        trim: true
    },
    studentsCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
        timestamps: true
});

//Thêm text index cho title và description để hỗ trợ search full-text
courseSchema.index({ title: 'text', description: 'text' });
// Thêm index cho price để tối ưu query filter/sort
courseSchema.index({ price: 1 });
// Thêm index cho instructor để tối ưu query
courseSchema.index({ instructor: 1 });

courseSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;