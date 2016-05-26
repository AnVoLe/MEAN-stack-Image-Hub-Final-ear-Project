var app = angular.module('myProject', []);


app.controller('registCtrl', [
'$scope',
function($scope){
$scope.user={
	fname:"",
  	username:"",
  	password:"",
  	email:"",
  	dob:"",
  	mob:"",
  	gender:""
  };
}

]);
