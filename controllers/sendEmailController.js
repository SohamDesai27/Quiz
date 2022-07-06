const Q = require('q');
const config = require('../config');
const EmailSender = require('emailjs');
const ResetPasswordController = require('./resetPasswordController');
const UserController = require('./userController');

//TODO => Get real credentials
const emailServer = EmailSender.server.connect({
    user: "username",
    password: "password",
    host: "smtp.your-email.com",
    ssl: true
});


const self = {};

self.makeEmailMessage = function (to, subject, message) {
    return {
        text: message,
        from: "no-reply@csquizz.edu",
        to: to,
        subject: subject
    };
};

self.resetPassword = function (username) {
    const deferred = Q.defer();
    UserController.findByEmail(username).then((user) => {
        return ResetPasswordController.save(user.email);
    }).then((resetPassword) => {
        const url = config.SERVER_URL + "/api/resetPassword?code=" + resetPassword.resetCode + "&email=" + resetPassword.username;
        const message = "To reset your password please click on the following url: " + url;
        const emailMessage = self.makeEmailMessage(resetPassword.username, "Quiz App: Reset password", message);
        emailServer.send(emailMessage, (err, response) => {
            console.log(err || response);
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(response);
        });
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

self.activateUser = function (activation) {
    const deferred = Q.defer();
    const url = config.SERVER_URL + "/api/activate?code=" + activation.code + "&email=" + activation.username;
    const message = "To activate your account please click on the following url: " + url;
    const emailMessage = self.makeEmailMessage(activation.email, "Quiz App: Activate account", message);
    emailServer.send(emailMessage, (err, response) => {
        console.log(err || response);
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(response);
    });
    return deferred.promise;
};

module.exports = self;
