angular.module('noBoundaries.controllers').controller('navBarController',['$scope','storageService', function($scope,storageService){
	console.log("navBarController init");
	$scope.userOnline = false;
	$scope.sessionData = storageService.getLocalData();
	if (($scope.sessionData.userID != null)||($scope.sessionData.userID != ''))
		$scope.userOnline = true;
    console.log($scope.sessionData);
}]);