const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Generates a 8 character code with alphanumeric values
 * @return {string} the random code
 */
const generateCode = function () {
    var code = Math.random().toString(36).substr(2, 8);
    return code.toUpperCase();
};

/**
 * A instructor can have multiple courses.
 * Courses will be automatically disabled after the ending date.
 * While a instructor can change the ending date.... It is recomended to create
 * a new one each semester.
 * @type {"mongoose".Schema}
 */
const courseSchema = new Schema({
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
    season: {
        type: String,
        required: true,
        index: true
    },
    // Example: CS1113
    class: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
        default: generateCode(),
        index: true
    },
    startDate: {
        type: Date,
        default: new Date(),
        index: true
    },
    endDate: {
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

module.exports = mongoose.model('Course', courseSchema);