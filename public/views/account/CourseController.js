'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('CourseController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'courseService', 'quizzService', '$routeParams',
            function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, courseService, quizzService, $routeParams) {
                var self = this;
                if (!$cookies.get("token")) {
                    $location.path("/sign_in");
                    return;
                }

                $rootScope.currentPage = "account";
                self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

                self.quizz = {};
                self.courseId = $routeParams.id;
                self.course = {};

                self.deleteQuizz = function () {

                };

                self.viewQuizz = function (quizz) {
                    $location.path("/course/"+ self.courseId + " /quizz/" + quizz._id);
                };

                self.addQuizz = function () {
                    self.quizz.instructor = self.user.email;
                    self.quizz.courseId = self.courseId;
                    quizzService.addQuizz(self.quizz)
                        .then(function (result) {
                            console.log(result);
                            self.quizzes.push(result);
                            self.quizz = {};
                            Materialize.toast("Successfully added Quizz.", 4000);
                        });
                };


                quizzService.getQuizzesForInstructorWithCourseId(self.user.email, self.courseId)
                    .then(function (result) {
                        console.log(result);
                        self.quizzes = result;
                    })
                    .catch(function (err) {
                        Materialize.toast('Error retrieving Quizzes. Try again later.', 4000)
                    });

                courseService.getCourse(self.courseId)
                    .then(function (result) {
                        console.log(result);
                        self.course = result;
                    })
                    .catch(function (error) {
                        Materialize.toast('Error retrieving course information. Try again later.', 4000)
                    });
            }]);
})();