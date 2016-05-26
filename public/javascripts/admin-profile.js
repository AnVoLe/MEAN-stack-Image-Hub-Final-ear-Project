
var app=angular.module("ImageHub", []);

app.controller("MainCtrl", function($scope,$http) {

 $http.get('/apisd/giftsid')
        .success(function(data) {
            $scope.gifts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


 $scope.deleteVoucher = function(id) {
        $http.delete('/apis/voucher' + id)
            .success(function(data) {
                $scope.gifts = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
  
 
});
