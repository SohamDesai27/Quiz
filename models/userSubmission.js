const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSubmissionSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    results: [ Boolean ],
    score: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        index: true,
        default: new Date()
    }
});

module.exports = mongoose.model('UserSubmission', userSubmissionSchema);