
var app=angular.module("ImageHub", []);

app.controller("MainCtrl", function($scope,$http) {
$scope.uservalue=window.uservalue;
 $http.get('/apiuser/pictures')
        .success(function(data) {
            $scope.pictures = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

 $http.get('/api/pictures')
        .success(function(data) {
            $scope.picturesall = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

$http.get('/apiuser/theme')
        .success(function(data) {
            $scope.themes = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

$http.get('/apiuser/gifts')
        .success(function(data) {
            $scope.gifts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


       /* $scope.giftsclaimed=function(){
            $http.get('/apiuser/gifts')
        .success(function(data) {
            $scope.gifts = data;
            $scope.tempgifts=[];
            for (var i = $scope.gifts.length - 1; i >= 0; i--) {
               
                        if($scope.gifts[i]._id==$scope.uservalue)
                        {
                             $scope.tempgifts.push($scope.gifts[i].path);

                        }
                };
            };
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);


        })
        
        }
*/

 $scope.deletePicture = function(id) {
        $http.delete('/api/pictures/' + id)
            .success(function(data) {
                $scope.pictures = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
  
 
});
