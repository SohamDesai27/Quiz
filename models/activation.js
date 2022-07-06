const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activationSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true,
        index: true
    }
});

module.exports = mongoose.model('Activation', activationSchema);