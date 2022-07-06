const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inputFileSchema = new Schema({
    // Input of the program
    path: {
        type: String,
        index: true,
    },
    reference: {
        type: String,
        index: true
    },
    username: {
        type: String,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        index: true
    }
});

module.exports = mongoose.model('InputFile', inputFileSchema);