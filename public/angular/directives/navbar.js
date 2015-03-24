angular.module('noBoundaries.directives').directive('navbar', function () {
    return {
        restrict: 'E',
        templateUrl: '/directives/navbar.html',
        scope: true,
        transclude : false,
        controller: 'navBarController as navBarCtrl'
    };
});