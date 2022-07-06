
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentQuizzSchema = new Schema({
    student: {
        //type: String,
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    quizz: {
        //type: String,
        type: Schema.Types.ObjectId,
        ref: "Quizz",
        required: true,
        index: true
    },
    submissions: [{
        //type: String,
        type: Schema.Types.ObjectId,
        ref: "UserSubmission"
    }],
    // Sum of all submissions
    score: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('StudentQuizz', studentQuizzSchema);