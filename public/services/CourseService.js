'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('courseService', courseService);
    courseService.$inject = ['$window', '$http'];

    function courseService($window, $http) {
        var self = {};

        self.success = function (response) {
            return response.data;
        };

        self.failure = function (error) {
            console.log(error.data);
            return error;
        };

        self.getCourse = function (id) {
            return $http.get($window._base_url + 'courses/single/' + id)
                    .then(self.success)
                    .catch(self.failure);
        };

        self.getCoursesForInstructor = function (email) {
            return $http.get($window._base_url + 'courses/' + email)
                .then(self.success)
                .catch(self.failure);
        };

        self.updateCourse = function(course) {
            return $http.put($window._base_url + 'courses/' + course._id, course)
                .then(self.success)
                .catch(self.failure);
        };

        self.deleteCourse = function (course) {
            return $http.delete($window._base_url + 'courses/' + course._id)
                .then(self.success)
                .catch(self.failure);
        };

        self.addCourse = function(course) {
            return $http.post($window._base_url + 'courses/', course)
                .then(self.success)
                .catch(self.failure);
        };

        self.enrollStudent = function(enrollBody) {
            return $http.post($window._base_url + 'enroll/', enrollBody)
                .then(self.success)
                .catch(self.failure);
        };

        return self;
    }

})();