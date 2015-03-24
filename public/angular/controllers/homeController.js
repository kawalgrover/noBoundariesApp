angular.module('noBoundaries.controllers').controller('homeController',['$scope','storageService','publicService','$window', function($scope,storageService,publicService,$window){
    console.log("homeController init");
    $scope.sessions = [];
    publicService.myUser().then(function(promise){
    	console.log(promise.data);
    	storageService.add('userID',promise.data._id);
    	$scope.user = promise.data;
    	$scope.userOnline = true;
    	$scope.sessions = $scope.user.sessions;
    });
}]);