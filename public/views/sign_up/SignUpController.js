'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('SignUpController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'userService', 'validationService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, userService, validationService) {
            var self = this;
            if ($cookies.get("token")) {
                $location.path("/home");
                return;
            }

            $scope.user = {};

            $scope.validConfirmPassword = function() {
                    return ($scope.user.password === $scope.user.confirmPassword);
            };

            $scope.emptyInput = function (input) {
                return (input);
            };



            self.createAccount = function () {

                if (!validationService.isValidEmail($scope.user.email)) {
                    Materialize.toast("Invalid Email", 5000, 'rounded');
                }
                else if(validationService.emptyInput($scope.user.firstName)){
                    Materialize.toast("First Name is empty", 5000, 'rounded');
                }
                else if(validationService.emptyInput($scope.user.lastName)){
                    Materialize.toast("Last Name is empty", 5000, 'rounded');
                }
                else{
                    if($scope.user.cwid === null || $scope.user.cwid === "" || $scope.user.cwid === undefined){
                        delete $scope.user.cwid;
                    }
                    sendUser();
                }
            };

            var sendUser = function () {
                console.log($scope.user);
                userService.saveUser($scope.user)
                    .then(function (result) {
                        if (result.success) {

                            var $toastContent = $('<span>Thank you! You have successfully created an account. ' +
                                'Please, sign in to continue.</span>');

                            Materialize.toast($toastContent, 5000, 'rounded');

                            $location.path("/home");
                        }
                        else {
                            Materialize.toast(result.statusText, 5000, 'rounded');
                            console.log(result);
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            };

        }]);
})();