angular.module('noBoundaries.controllers').controller('navBarController',['$scope','storageService', function($scope,storageService){
	console.log("navBarController init");
	$scope.sessionData = storageService.getLocalData();
    console.log($scope.sessionData);
}]);