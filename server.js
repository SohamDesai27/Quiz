const fs = require('fs');
const compression = require('compression');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const dbConfig = require('./dbConfig');
const app = express();
const routes = express.Router();
const passport = require('passport');

const PORT = process.env.PORT || 3000;

// [Question auth] Bring in the data model
require('./models/user');
// [Question auth] Bring in the Passport config after model is defined
require('./models/passport');

dbConfig.initDB();
// use morgan to log requests to the console
app.use(morgan('dev'));

// define the static paths for the public directory
app.use('/', express.static(path.join(__dirname, 'public')));

// Define the body parser to accept JSON and url encoded items
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

process.env.UPLOAD_PATH = config.UPLOADS_PATH;

// Set the specific port
app.set('port', PORT);

// Compress middleware
app.use(compression({filter: shouldCompress}));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}
// [Question auth] Initialize Passport local authentication middleware
app.use(passport.initialize());

// Add all the routes inside the routes folder
require('./routes')(routes);
// apply the routes to our application with the prefix /api
app.use('/api', routes);

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = app; // for testing