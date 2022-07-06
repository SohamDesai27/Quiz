'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('quizzService', quizzService);
    quizzService.$inject = ['$window', '$http'];

    function quizzService($window, $http) {
        var self = {};

        self.success = function (response) {
            return response.data;
        };

        self.failure = function (error) {
            console.log(error.data);
            return error;
        };

        self.getQuizz = function (id) {
            return $http.get($window._base_url + 'quizz/' + id)
                    .then(self.success)
                    .catch(self.failure);
        };

        self.getQuizzesForInstructor = function (email) {
            return $http.get($window._base_url + 'quizzes/' + email)
                .then(self.success)
                .catch(self.failure);
        };

        self.getQuizzesForInstructorWithCourseId = function (email, courseId) {
            return $http.get($window._base_url + 'quizzes/' + email + "?courseId=" + courseId)
                .then(self.success)
                .catch(self.failure);
        };

        self.updateQuizz = function(quizz) {
            return $http.put($window._base_url + 'quizz/' + quizz._id, quizz)
                .then(self.success)
                .catch(self.failure);
        };

        self.deleteQuizz = function (quizz) {
            return $http.delete($window._base_url + 'quizzes/' + quizz._id)
                .then(self.success)
                .catch(self.failure);
        };

        self.addQuizz = function(quizz) {
            return $http.post($window._base_url + 'quizzes/', quizz)
                .then(self.success)
                .catch(self.failure);
        };

        return self;
    }

})();