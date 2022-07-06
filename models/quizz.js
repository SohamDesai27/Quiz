const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizzSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: String,
    instructor: {
        type: String,
        required: true,
        index: true
    },
    // the course to which this Quizz belongs to
    courseId: {
        type: String,
        required: true,
        index: true
    },
    points: {
        type: Number,
        required: true,
        index: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: "Question",
        index: true
    }],
    startDate: {
        type: Date,
        default: new Date(),
        index: true
    },
    dueDate: {
        type: Date,
        default: new Date(),
        index: true
    },
    updatedAt: {
        type: Date,
        default: new Date(),
        index: true
    }
});

module.exports = mongoose.model('Quizz', quizzSchema);