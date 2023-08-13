var app = angular.module("myApp", ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) { 
	$stateProvider
		.state('Register', {
            url: '/register',
			templateUrl: 'reg.html',
			controller: 'RegisterController'
		})
		.state('LogIn', {
            url: '/log-in',
			templateUrl: 'login.html',
			controller: 'LogInController'
		})
		.state('Admin', {
            url: '/admin',
			templateUrl: 'admin.html',
			controller: 'AdminController'
		})
		.state('Products', {
			url: '/products',
			templateUrl: 'products.html',
			controller: 'ProductsController'
			  })
		.state('Cart', {
		   url: '/wishlist',
		   templateUrl: 'cart.html',
		   controller: 'CartController'
		  });

		$urlRouterProvider.otherwise('/products');
}]);

app.controller('RegisterController',function($scope,$http,$window,$state){
//$scope.input = [];
	$scope.registerform = function(){
        console.log('UserName :', $scope.username)
		console.log('Password :', $scope.password)
		console.log('Confirm password :', $scope.confpassword)
		console.log('Email :', $scope.email)
	}

	$scope.validatePassword = function(){
		$scope.passwordMismatch = $scope.password !== $scope.confpassword;
	  }


	 $scope.Register = function(){

		LoadingService.startLoading();

		var pass = $scope.password;
		var confpass = $scope.confpassword;

		var regdata = {
            name: $scope.username,
            email : $scope.email,
            password : $scope.password,
            confirmpassword : $scope.confpassword
		};
		console.log(regdata);

		if(pass == confpass){
			
			$http.post('https://10.21.80.156:8000/register/', regdata)
          .then(function(response){
            
            console.log(response.data)
			$state.go('LogIn');
		  })
		  .catch(function(error){
			$window.alert(error);
		  })
		  .finally(function() {
			LoadingService.stopLoading();
		  });
		}
		else{
			$window.alert('Incorrect Password');
			LoadingService.stopLoading();
		}

	 } 
});

app.controller('LogInController',['$scope', '$http','$state', function($scope, $http, $state, $cookies) {
	//var loggedinuser = sessionStorage.getItem('loggedinuser');

/*	console.log(loggedinuser);
	if(loggedinuser){
		if(loggedinuser === 'admin'){
			$state.go('Cart');
		}
	   else{
		$state.go('Products');
	  }
	}*/

	$scope.logout = function(){

		LoadingService.startLoading();

		$state.go('LogIn');
	}

	$scope.loginform = function() {
		console.log('Email', $scope.username);
		console.log('Password', $scope.password);
	}
 //   $scope.user=[];

	$scope.login = function(){

		var data = {
			username : $scope.username,
			password : $scope.password
		};
	
     console.log(data);
		$http.post('https://10.21.80.156:8000/login/', data)
		.then(function(response){
			console.log(response);

		var usertype = response.data.message;
		
		

			if(usertype === 'admin'){
				$state.go('Admin');
			}
		   else{
			$state.go('Products');
		  }
		   // console.log(taskno);
		   
		   
		})
		.catch(function(error){
		console.log(error);
	  })
	/*  .finally(function() {
		LoadingService.stopLoading();
	  });*/

	 
  //  $scope.user.email = "";
	//$scope.user.password="";
	}
	
  }]);

  app.controller('ProductsController',['$scope', '$http','$state', function($scope, $http, $state){
	$scope.cart = function(){
    $state.go('Cart');		
	}
  }])
   

  
  
  
  app.controller('AdminController', ['$scope', '$http', function($scope, $http) {
	  $scope.newProduct = {};
	  $scope.products = [];
	  
	  
	  
	$scope.addSection = function() {
		var file = $scope.newProduct.images;
		//  var imageUrls = [];	
		if(file){
			var formdata = new FormData();
			formdata.append('image', file);
			formdata.append('categoryid', $scope.newProduct.id);
			formdata.append('category', $scope.newProduct.name);
			formdata.append('details', $scope.newProduct.details);
			//formdata.append('')
			
			$http.post('https://10.21.80.156:8000/category/', formdata, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.then(function(response) {
				// Product added successfully
				$scope.products.push(response.data);

				console.log(response)
				$scope.newProduct.imageUrl = response.data.imageUrl;
				
			  $scope.newProduct = {};
			})
			.catch(function(error) {
				console.log('Error adding product:', error);
			});
			
		}
		
	};
	//$scope.comssldld.("sidd").false = true;
	
	
/*	
	$scope.deleteProduct = function(product) {
		var index = $scope.products.indexOf(product);
		if (index !== -1) {
		$scope.products.splice(index, 1);
	}
};
  
$scope.showUpdateForm = function(product) {
	product.showUpdateForm = true;
	product.updatedName = product.name;
	product.updatedDetails = product.details;
};

$scope.updateProduct = function(product) {
	product.name = product.updatedName;
	product.details = product.updatedDetails;
	product.showUpdateForm = false;
};*/

}]);

app.directive('fileUpload', function() {
   return {
     restrict: 'A',
     require: 'ngModel',
     link: function(scope, element, attrs, ngModel) {
        element.bind('change', function(event) {
	     var file = event.target.files[0];
	     scope.$apply(function() {
	       ngModel.$setViewValue(file);
	     });
       });
     }
   };
})

/* app.directive('fileUpload', function(LoadingService) {
	return {
	  restrict: 'A',
	  require: 'ngModel',
	  link: function(scope, element, attrs, ngModel) {
		element.bind('change', function(event) {
		  var file = event.target.files[0];
		  LoadingService.startLoading(); // Start loading when file is being uploaded
  
		  scope.$apply(function() {
			ngModel.$setViewValue(file);
		  });
  
		  // Replace this with your actual file upload logic
		  // For example, using $http.post or another library
		  // Simulating a delay for demonstration purposes
		  setTimeout(function() {
			LoadingService.stopLoading(); // Stop loading when file upload is complete
			scope.$apply();
		  }, 2000); // Adjust the time as needed
		});
	  }
	};
  });
  */