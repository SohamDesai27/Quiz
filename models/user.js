const config = require('../config');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    // Whether this user is a instructor or not
    isInstructor: {
        type: Boolean,
        default: false,
        index: true
    },
    // CWID of the student
    cwid: {
        type: String,
        index: true
    },
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        index: true
    }],
    // Email used by the user as a username
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function (v) {
                return isValidEmail(v);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    // Users need to validate their email address before becoming active
    active: {
        type: Boolean,
        default: false,
        index: true
    },
    // Hashed version of the user password
    hashPassword: String,
    // This user's salt to be used when encrypting the password
    salt: String
});

/**
 * Hashes a password from a salt and plain text password
 * @param salt
 *      random characters to be used on salting the password
 * @param password
 *      the plain text password to be used
 */
const hash = function (salt, password) {
    var bufferSalt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, bufferSalt, 1000, 64, 'sha1').toString('base64');
};

/**
 * Sets the hashPassword of the user
 * It uses crypto to perform a 64bit encryption of the plain text password
 * @param password
 *      The plain text password to be used
 */
userSchema.methods.setPassword = function (password) {
    // Generates a random salt of 16 bytes
    this.salt = crypto.randomBytes(16).toString('base64');
    this.hashPassword = hash(this.salt, password);
};

/**
 * Function to validate if a email is valid or not.
 * Always check before setting the user email
 * @param email
 *      The email to be tested
 * @returns {boolean}
 *      Whether this email is valid or not
 */
userSchema.methods.isValidEmail = function (email) {
    return isValidEmail(email);
};

const isValidEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

/**
 * Verifies is the hashed input password of the user compared to the stored valid password
 * @param password the plain text password
 * @returns {boolean} whether this is a valid password or not
 */
userSchema.methods.validPassword = function (password) {
    const hashed = hash(this.salt, password);
    return this.hashPassword === hashed;
};

/**
 * Generates a token to be sent to the client app
 * @returns {*} a signed token to be used and validate this user
 */
userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    // Expires in a week
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, config.HASH_KEY);
};

/**
 * We use this to remove elements we don't want to send to the user
 */
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.__v;
        delete ret.hashPassword;
        delete ret.salt;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);