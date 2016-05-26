
var app=angular.module("ImageHub", []);

app.controller("MainCtrl", function($scope,$window,$http) {
$scope.title = "ThemeLine";
$http.get('/api/pictures')
        .success(function(data) {
            $scope.pictures = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
	
  $http.get('/api/theme')
        .success(function(data) {
            $scope.theme = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

   
   $scope.plusOne=function(id){
    
    $http.get('/vote/pictures/'+id)
        .success(function(data) {
          if(data==true)
          {

            $window.alert("You have already upvoted this picture");
          }

           
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  };
$scope.minusOne=function(id){
    
    $http.get('/downvote/pictures/'+id)
        .success(function(data) {
          if(flag==true)
          {
            $window.alert("You have already downvoted this picture!");
          }           
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  };
  $scope.addcomment=function (index) {
   var com=$window.prompt('Please enter your comment');
   $scope.pictures[index].comments.push({value:com});
   
 };

/*
$scope.addcomment = function(id){    
  $scope.comments=
    $scope.comments.push();
    // Writing it to the server
    //    
    var dataObj = {
        value : $scope.comment
    };  
    var res = $http.post('/comment/pictures/'+id, dataObj);
    res.success(function(data, status, headers, config) {
      $scope.pictures = data;
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    }); 


        $scope.addcomment = function (id) {
           

            $http.post('/comments/pictures/'+id,$scope.comment)
            .success(function (data, status, headers) {
                $scope.pictures = data;
            })
            .error(function (data, status, header, config) {
                $scope.ServerResponse =  htmlDecode("Data: " + data +
                    "\n\n\n\nstatus: " + status +
                    "\n\n\n\nheaders: " + header +
                    "\n\n\n\nconfig: " + config);
            });
        };
    $scope.edit = function (id) {
      $http.get('/edit/pictures'+id)
      .success(function(data) {
          $scope.pictures = data;
          console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
     */ 

});

