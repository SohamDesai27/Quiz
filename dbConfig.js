var mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = require('q').Promise;

var self = module.exports = {};

self.initDB = function () {
    // use dev database as default to avoid messing up with production database
    mongoose.connection.close();
    const db = process.env.DATABASE || config.DEV_DATABASE;
    if (db === config.TEST_DATABASE) {
        // we are in test!
        self.initTestDB(function () {});
    } else {
        mongoose.connect(db); // connect to the database
    }
};

/**
 * Helper method to init the test database and clear it before each test connection is made
 * @param callback
 */
self.initTestDB = function (callback) {
    // We have a connection
    if (mongoose.connection.readyState) {
        mongoose.connection.close(() => {
            mongoose.connect(config.TEST_DATABASE);
            mongoose.connection.once('connected', () => {
                mongoose.connection.db.dropDatabase(() => {
                    callback();
                });
            });
        });
    } else {
        mongoose.connect(config.TEST_DATABASE);
        mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase(() => {
                callback();
            });
        });
    }
};


