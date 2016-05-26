
var app=angular.module("ImageHub", []);

app.controller("MainCtrl", function($scope,$window,$http) {
$scope.title = "GIFTS";
$http.get('/apisd/giftsid')
        .success(function(data) {
            $scope.gifts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

$scope.creditloss=function(id){
    
    $http.get('/credits/loss/'+id)
        .success(function(data) {
            if(data==false)
            {
                $window.alert("You do not have enough credits to claim this reward");
            }
            else
            {
                $window.alert("Reward has been sent to you as an attachment in your email! ");
            }
            console.log("Mail sent");
           
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  };
   

   
  
 
});
