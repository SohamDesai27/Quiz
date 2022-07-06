'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('questionService', questionService);
    questionService.$inject = ['$window', '$http'];

    function questionService($window, $http) {
        var self = {};

        self.success = function (response) {
            return response.data;
        };

        self.failure = function (error) {
            console.log(error.data);
            return error;
        };

        self.getQuestion = function (id) {
            return $http.get($window._base_url + 'questions/' + id)
                .then(self.success)
                .catch(self.failure);
        };

        self.getEditQuestion = function (id) {
            return $http.get($window._base_url + 'edit_questions/' + id)
                    .then(self.success)
                    .catch(self.failure);
        };

        self.getInstructorQuestions = function (email) {
            return $http.get($window._base_url + 'questions/?username=' + email)
                .then(self.success)
                .catch(self.failure);
        };

        self.updateQuestion = function(question) {
            return $http.put($window._base_url + 'questions/' + question._id, question)
                .then(self.success)
                .catch(self.failure);
        };

        self.deleteQuestion = function (question) {
            return $http.delete($window._base_url + 'questions/' + question._id)
                .then(self.success)
                .catch(self.failure);
        };

        self.uploadQuestion = function(question) {
            return $http.post($window._base_url + 'questions', question)
                .then(self.success)
                .catch(self.failure);
        };

        self.getAllQuestions = function() {
            return $http.get($window._base_url + 'questions/')
                .then(self.success)
                .catch(self.failure);
        };

        return self;
    }

})();