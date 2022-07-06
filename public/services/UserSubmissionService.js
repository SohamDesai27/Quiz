'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('userSubmissionService', userSubmissionService);
    userSubmissionService.$inject = ['$window', '$http'];

    function userSubmissionService($window, $http) {
        var self = {};

        self.success = function (response) {
            return response.data;
        };

        self.failure = function (error) {
            console.log(error.data);
            return error;
        };

        self.evaluate = function (submission) {
            return $http.post($window._base_url + 'user_submission/', submission)
                .then(self.success)
                .catch(self.failure);
        };

        self.getEvaluations = function (username){
            return $http.get($window._base_url +'user_submissions?username=' + username)
                .then(self.success)
                .catch(self.failure);
        };

        self.getEvaluationById = function (id){
            return $http.get($window._base_url +'user_submission/' + id)
                .then(self.success)
                .catch(self.failure);
        };

        return self;
    }

})();