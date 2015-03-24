app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/',{templateUrl: '/partials/main.html', controller : 'mainController as homeCtrl'});
	$routeProvider.when('/home',{templateUrl: '/partials/home.html', controller : 'homeController as homeCtrl'});
   	$routeProvider.when('/register',{templateUrl: '/partials/register.html', controller : 'registerController as registerCtrl'});
	$routeProvider.when('/login',{templateUrl: '/partials/login.html', controller : 'loginController as loginCtrl'});
	$routeProvider.when('/events',{templateUrl: '/partials/events.html', controller : 'eventsController as eventsCtrl'});
	$routeProvider.when('/about',{templateUrl: '/partials/about.html', controller : 'aboutController as contactCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
