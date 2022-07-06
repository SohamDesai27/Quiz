/**
 * Created by mgabilhe on 4/3/17.
 */

(function() {
    var app = angular.module('CS4570');

    app.directive('appFooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/footer/footer.html',
            controller: function($scope, $http, $window, $location, $rootScope, $cookies, encodeService, userService) {
                var self = this;
                self.today = new Date();
            },
            controllerAs: 'footerCtrl'
        };
    });
})();

