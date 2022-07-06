/**
 * Created by mgabilhe on 4/3/17.
 */

(function() {
    var app = angular.module('CS4570');

    app.directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/navbar/navbar.html',
            controller: function($scope, $http, $window, $location, $rootScope, $cookies, encodeService, userService) {
                var self = this;
                self.today = new Date();
                self.signedIn = $cookies.get('token');
                var cookieUser = $cookies.get('user');
                if (cookieUser) {
                    self.user = JSON.parse(encodeService.decode64(cookieUser));
                }

                // if a user is signed in we update the current user data
                if (self.user) {
                    userService.getUser(self.user._id)
                        .then(function (result) {
                            self.isInstructor = result.isInstructor;
                            $cookies.put("user", encodeService.encode64(JSON.stringify(result)));
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }

                self.logout = function() {
                    var object = $cookies.getAll();
                    for (var cookie in object) {
                        if (object.hasOwnProperty(cookie)) {
                            $cookies.remove(cookie);
                        }
                    }
                    $window.location.reload();
                };
            },
            controllerAs: 'navBarCtrl'
        };
    });
})();

