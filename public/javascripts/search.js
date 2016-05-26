var app=angular.module("ImageHub", []);

app.controller("MainCtrl", function($scope,$window,$http) {
$scope.title = "Search";
$scope.value="";
$scope.searchtext="";

$(document).ready(function(e){
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var concept = $(this).text();
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
	});
});





$scope.search_fn=function(value)
{
	
	
		$http.get('/search/user')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
		});	

	$http.get('/search/pictures')
        .success(function(data) {
            $scope.pictures = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
		});	
	};


});