'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('SignInController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService) {
            var self = this;
            if ($cookies.get("token")) {
                $location.path("/home");
                return;
            }

            $scope.user = {};
            $scope.recover = {};


            $scope.recoverPassword = function() {
                $scope.recover.username = $scope.recoveryEmail;
                $http.post($window._base_url + 'forgot_password', $scope.user.email)
                    .then(function(result){
                        var data = result.data;
                        var toastContent = "Please check your email to reset your password."

                        Materialize.toast(toastContent, 5000);
                    })
                    .catch(function(err){
                        Materialize.toast("Please try again", 5000);
                        console.log(err);
                    });
            };

            self.signIn = function () {
                // 5 is about the min length of an email address
                if ($scope.user.email.length > 4) {
                    $http.post($window._base_url + "sign_in", $scope.user)
                        .then(function (result) {
                            var data = result.data;
                            var user = data.data;
                            var expireDate = new Date();
                            expireDate.setDate(expireDate.getDate() + 7);
                            $cookies.put('token', data.token, {'expires': expireDate});
                            $cookies.put("user", encodeService.encode64(JSON.stringify(user)));
                            $window.location.reload();
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            };
        }]);
})();