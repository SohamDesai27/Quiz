'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('MyAccountController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'courseService', 'quizzService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, courseService, quizzService) {
            var self = this;
            if (!$cookies.get("token")) {
                $location.path("/sign_in");
                return;
            }
            $rootScope.currentPage = "account";
            $scope.seasons = ["Spring", "Summer", "Fall", "Winter"];

            self.course = {};
            self.quizz = {};
            self.courseCode = "";
            self.user = JSON.parse(encodeService.decode64($cookies.get('user')));
            console.log(self.user);
            self.isInstructor = self.user.isInstructor;

            var getInstructorCourses = function () {
                courseService.getCoursesForInstructor(self.user.email)
                    .then(function (result) {
                        self.courses = result;
                    });
            };

            self.editCourse = function (course) {
                self.course = course;
            };

            self.newQuizz = function (course) {
                self.quizz.courseId = course._id;
            };

            self.addCourse = function () {
                self.course.instructor = self.user.email;
                courseService.addCourse(self.course)
                    .then(function (result) {
                        self.course = {};
                    });
            };

            self.enrollStudent = function () {
                if (self.courseCode != "") {
                    var body = {
                        code: self.courseCode,
                        username: self.user.email
                    };
                    courseService.enrollStudent(body)
                        .then(function (result) {
                            if (result.success) {
                                Materialize.toast("Successfully enrolled in course.", 4000);
                            } else {
                                Materialize.toast(result.message, 4000);
                            }
                        });
                }
            };

            self.addQuizz = function () {
                self.quizz.instructor = self.user.email;
                quizzService.addQuizz(self.quizz)
                    .then(function (result) {
                        self.quizz = {};
                        Materialize.toast("Successfully added Quizz.", 4000);
                    });
            };

            self.viewCourse = function (course) {
                if (self.isInstructor) {
                    $location.path("course/" + course._id);
                } else {
                    $location.path("course/student/" + course._id);
                }
            };

            if (self.isInstructor) {
                getInstructorCourses();
            } else {
                self.courses = self.user.enrolledCourses;
            }


        }]);
})();