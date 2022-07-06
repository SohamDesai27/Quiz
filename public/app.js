/**
 * Created by mgabilhe on 1/23/17.
 */


'use strict';
/* global app: true */

(function () {

    var app = angular.module('CS4570', [
        'ngRoute',
        'ngCookies',
        'ui.materialize',
        'ui.codemirror',
        'ngFileUpload'
    ]);

    window._base_url = "http://localhost:3000/api/";

    app.config(function ($httpProvider, $routeProvider, $locationProvider) {
        // Intercepts Http request to add a Token to the headers
        $httpProvider.interceptors.push('authInterceptor');
        // Increases the timeout in case someone is having a slow connection while uploading
        $httpProvider.defaults.timeout = 5000;
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeController',
                controllerAs: 'ctrl'
            })
            .when('/account', {
                templateUrl: 'views/account/account.html',
                controller: 'MyAccountController',
                controllerAs: 'ctrl'
            })
            .when('/course/:id', {
                templateUrl: 'views/account/course.html',
                controller: 'CourseController',
                controllerAs: 'ctrl'
            })
            .when('/course/student/:id', {
                templateUrl: 'views/account/student_course.html',
                controller: 'StudentCourseController',
                controllerAs: 'ctrl'
            })
            .when('/course/:courseId/quizz/:id', {
                templateUrl: 'views/quizz/quizz.html',
                controller: 'QuizzController',
                controllerAs: 'ctrl'
            })
            .when('/my_questions', {
                templateUrl: 'views/my_questions/my_questions.html',
                controller: 'MyQuestionsController',
                controllerAs: 'ctrl'
            })
            .when('/sign_in', {
                templateUrl: 'views/sign_in/sign_in.html',
                controller: 'SignInController',
                controllerAs: 'ctrl'
            })
            .when('/sign_up', {
                templateUrl: 'views/sign_up/sign_up.html',
                controller: 'SignUpController',
                controllerAs: 'ctrl'
            })
            .when('/upload', {
                templateUrl: 'views/upload/upload.html',
                controller: 'ProblemUploadController',
                controllerAs: 'ctrl'
            })
            .when('/user_submission', {
                templateUrl: 'views/submissions/submissions.html',
                controller: 'SubmissionsController',
                controllerAs: 'ctrl'
            })
            .when('/questionPreview/:id', {
                templateUrl: 'views/question_preview/question.html',
                controller: 'QuestionPreviewEditController',
                controllerAs: 'ctrl'
            })
            .when('/editQuestion/:id', {
                templateUrl: 'views/question_preview/question.html',
                controller: 'QuestionPreviewEditController',
                controllerAs: 'ctrl'
            })
            .when('/newQuestion', {
                templateUrl: 'views/question_preview/question.html',
                controller: 'QuestionPreviewEditController',
                controllerAs: 'ctrl'
            })
            .when('/question/:id', {
                templateUrl: 'views/question/question.html',
                controller: 'QuestionController',
                controllerAs: 'ctrl'
            })
            .when('/submissions/:id', {
                templateUrl: 'views/submissions/submissionView.html',
                controller: 'SubmissionViewController',
                controllerAs: 'ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

    app.factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = $cookies.get("token");
                if (token) {
                    config.headers.Authorization = 'Token ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                    $cookies.remove("token");
                    $location.path('/');
                }
                return response || $q.when(response);
            }
        };
    });

    app.filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }]);
})();
