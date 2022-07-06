'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('userService', userService);
    userService.$inject = ['$window', '$http'];

    function userService($window, $http) {
        var self = {};

        self.success = function (response) {
            return response.data;
        };

        self.failure = function (error) {
            console.log(error.data);
            return error;
        };

        self.getUser = function (id) {
            return $http.get($window._base_url + 'users/' + id)
                .then(self.success)
                .catch(self.failure);
        };

        self.updateUser = function(user) {
            return $http.put($window._base_url + 'users/' + user._id, user)
                .then(self.success)
                .catch(self.failure);
        };

        self.saveUser = function(user) {
            return $http.post($window._base_url + 'sign_up/', user)
                .then(self.success)
                .catch(self.failure);
        };

        self.forgotPassword = function(user) {
            return $http.post($window._base_url + 'forgot_password/', user)
                .then(self.success)
                .catch(self.failure);
        };

        return self;
    }

})();