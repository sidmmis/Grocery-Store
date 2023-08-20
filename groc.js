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
		.state('Options', {
			url: '/optoins',
			templateUrl: 'option.html',
			controller: 'OptionController'
			  })
		.state('Admin', {
            url: '/admin',
			templateUrl: 'admin.html',
			controller: 'AdminController'
		})
		.state('ProductAdd', {
            url: '/productadd',
			templateUrl: 'productadd.html',
			controller: 'ProductAddController'
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

var data = [];	

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

	//	LoadingService.startLoading();

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
			
			$http.post('https://10.21.84.45:8000/register/', regdata)
          .then(function(response){
            
            console.log(response.data);

            Swal.fire({
	            position: 'top-end',
	            icon: 'success',
	            title: 'Your Data has been saved',
	            showConfirmButton: false,
	            timer: 1500
              })
			$state.go('LogIn');
		  })
		  .catch(function(error){
			$window.alert(error);
		  })
		}
		else{
			//$window.alert('Incorrect Password');
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Please enter correct password',
			//	footer: '<a href="">Why do I have this issue?</a>'
			  })
			//LoadingService.stopLoading();
		}

	 } 
});	

app.controller('LogInController',['$scope', '$http','$state', function($scope, $http, $state) {
	//var loggedinuser = sessionStorage.getItem('loggedinuser');


	$scope.logout = function(){

	//	LoadingService.startLoading();
	$http.post('https://10.21.84.45:8000/logout/',{
		headers: {'Content-Type': undefined},
		withCredentials: true
	})

	.then(function(response){
		console.log(response);
		Swal.fire({
			icon: 'success',
			title: 'Thanks...',
			text: 'You are logging out',
		  })
	})
	.catch(function(error){
		console.log(error);
	})
	
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
		$http.post('https://10.21.84.45:8000/login/', data , {
		headers: {'Content-Type': undefined},
		withCredentials: true

	})
		.then(function(response){
			console.log(response);

		var usertype = response.data.message;

			if(usertype === 'admin'){
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Successfully Logged In',
					showConfirmButton: false,
					timer: 1500
				  })
	
				$state.go('Options');
			}
		   
			else{
			Swal.fire({
	            position: 'top-end',
	            icon: 'success',
	            title: 'Successfully Logged In',
	            showConfirmButton: false,
	            timer: 1500
              })

			$state.go('Products');
		  }
		 
		})
		.catch(function(error){
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Please enter valid username and password',
		//	footer: '<a href="">Why do I have this issue?</a>'
		  })
		//alert("Not Found");
	  })
	}
	
  }]);


  app.controller('OptionController',['$scope', '$state', function($scope, $state){
	$scope.category = function(){
    $state.go('Admin');		
	}
	$scope.product = function(){
		$state.go('ProductAdd');
	}
  }])

  app.controller('ProductsController',['$scope', '$http','$state', function($scope, $http, $state){

    $scope.id = [];
	var id={};	
	$scope.product=[];
	$scope.newCategory=[];
	$scope.cart = [];
	
	$http.get('https://10.21.84.45:8000/showproduct/', {
		//transformRequest: angular.identity,
	   // headers: {'Content-Type': undefined},
		withCredentials: true 
	   })
	
		.then(function(response){
		   console.log(response);
		   //$scope.products.push(response.data);
	       
		   var results = response.data;
		   //console.log(results)
		  
		   $scope.products=results;
		   console.log($scope.products);
		    id = results;
		   
		  // console.log(id)
		})
		.catch(function(error){
		   console.log(error);
		})

    $scope.cartgo=function(product){
    
		console.log(product);

	    var data = {
			product_id : product
		}	
			
			$http.post('https://10.21.84.45:8000/addtocart/', data,{
				withCredentials: true 
		})
		.then(function(response){
			console.log(response);

			var msg = response.data;
			console.log(msg);
			if(msg.message === 'Added'){
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Successfully Added',
					showConfirmButton: false,
					timer: 1500
				  })
			}
			else{
				Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: 'Already Added',
					showConfirmButton: false,
					timer: 1500
				  })
			}
		 })
		 .catch(function(error){
			console.log(error);
		 })
		}
  }])

  
  app.controller('AdminController', ['$scope', '$http', function($scope, $http) {
	  $scope.newProduct = {};
	  $scope.products = [];
	  $scope.product = [];
	 // $scope.images = " ";

	 $http.get('https://10.21.84.45:8000/category/', {
	 //transformRequest: angular.identity,
	// headers: {'Content-Type': undefined},
	 withCredentials: true 
	})

	 .then(function(response){
		console.log(response);
		//$scope.products.push(response.data);
        var results = response.data;
		$scope.products=results;
		console.log($scope.products);
	 })
	 .catch(function(error){
		console.log(error);
	 })
	  
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
			console.log(formdata);
			
			$http.post('https://10.21.84.45:8000/category/', formdata, {
				transformRequest: angular.identity,
		    	headers: {'Content-Type': undefined},
				withCredentials: true
			})
			.then(function(response) {
				// Product added successfully
				$scope.products.push(response.data);

				console.log(response);				
			  $scope.newProduct = {};
			})
			.catch(function(error) {
				console.log('Error adding product:', error);
			});
			
		}
		
	};
	
	
	$scope.deleteProduct = function(product) {
	

  Swal.fire({
	title: 'Are you sure?',
	text: "You won't be able to revert this!",
	icon: 'warning',
	showCancelButton: true,
	confirmButtonColor: '#3085d6',
	cancelButtonColor: '#d33',
	confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
	if (result.isConfirmed) {
		var dlt = {
			categoryid : product.Categoryid
		}
		$http.delete('https:10.21.84.45:8000/category/', dlt ,{
			//headers: {'Content-Type': undefined},
			withCredentials: true
			})
			.then(function(response){
				console.log(response);
				console.log("Successfully deleted");
		})
			.catch(function(error){
			   console.log("not deleted",error);
		})
		var index = $scope.products.indexOf(product);
		if (index !== -1) {
		$scope.products.splice(index, 1);
	}
	  Swal.fire(
		'Deleted!',
		'Your file has been deleted.',
		'success'
	  )
	}
  })

	}
  
$scope.showUpdateForm = function(product) {
	product.showUpdateForm = true;
	console.log(product.Categoryid)

	//$scope.product.updateId = product.id;
	//product.updatedName = product.name;
	//product.updatedDetails = product.details;
 //   product.updateform = true;
};

$scope.updatedData = function(product) {

	var file = product.updimages;
	    
    console.log(product)
	var editinput = new FormData();
			//formdata.append('image', file);
			editinput.append('categoryid', product.Categoryid);
			editinput.append('categoryname', product.updName);
			editinput.append('about', product.updDetails);
			editinput.append('image', file)

			console.log(file);
			// var editinput = {
			// 	categoryid : $scope.product.updId,
			// 	categoryname : $scope.product.updName,
			// 	about : $scope.product.updDeatils
			// }
			console.log(editinput);

	$http.post('https:10.21.84.45:8000/updatecategory/', editinput,{
	//headers: {'Content-Type': undefined},
	withCredentials: true
	})
		.then(function(response){

		
	       product.showUpdateForm = false;
			console.log(response.data);
			product.Image=file;
			product.Categoryname = product.updName;
			product.about = product.updDetails;

    })
        .catch(function(error){
	       console.log(error);
    })
}

    $scope.addProduct = function(product){

	}
}]);



app.controller('ProductAddController',['$scope', '$state', '$http', function($scope, $state, $http){

	$scope.product=[];
	$scope.newCategory=[];
	
	$http.get('https://10.21.84.45:8000/product/', {
		//transformRequest: angular.identity,
	   // headers: {'Content-Type': undefined},
		withCredentials: true 
	   })
	
		.then(function(response){
		   console.log(response);
		   //$scope.products.push(response.data);
	   
		   var results = response.data;
		   //console.log(results)
		   $scope.products=results;
		   console.log($scope.products);
		})
		.catch(function(error){
		   console.log(error);
		})
		
	
	
		 $scope.addProduct = function(product){
	
		 var file = $scope.newCategory.images;
	
		   if(file){
			var formdata = new FormData();
	
			formdata.append('productid', $scope.newCategory.id);
			formdata.append('product', $scope.newCategory.name);
			formdata.append('details', $scope.newCategory.details);
			formdata.append('manufacture', $scope.newCategory.manu);
			//formdata.append('categoryexpiry', newCategory.exp);
			formdata.append('rate', $scope.newCategory.money);
			formdata.append('quantity', $scope.newCategory.quantity);
			formdata.append('image', file);
	
			console.log(formdata);
			$http.post('https:10.21.84.45:8000/product/', formdata, {
				transformRequest: angular.identity,
					headers: {'Content-Type': undefined},
					withCredentials: true
			})
			.then(function(response){
				console.log(response);
			})
			.catch(function(error){
				console.log(error);
			});
		 }
		}
		$scope.showUpdateForm = function(product) {
			product.showUpdateForm = true;
			console.log(product.Productid)
			//$scope.product.updateId = product.id;
			//product.updatedName = product.name;
			//product.updatedDetails = product.details;
		 //   product.updateform = true;
		};



		// Swal.fire({
		// 	title: 'Are you sure?',
		// 	html : '<input type="text" ng-model="product.updId" required>',
		// 	text: "You won't be able to revert this!",
		// 	icon: 'warning',
		// 	showCancelButton: true,
		// 	confirmButtonColor: '#3085d6',
		// 	cancelButtonColor: '#d33',
		// 	confirmButtonText: 'Yes, delete it!'
		//   }).then((result) => {
		// 	if (result.isConfirmed) {
		// 	  Swal.fire(
		// 		'Deleted!',
		// 		'Your file has been deleted.',
		// 		'success'
		// 	  )
		// 	}
		//   })

		
		$scope.updatedData = function(product) {
				
			console.log(product.Productid)
				
					var editinput = {
						productid: product.Productid,
			            product: product.updName,
			            details: product.updDetails,
						image : product.updimages,
			            manufacture: product.manu,
			            //formdata.append('categoryexpiry', newCategory.exp);
			            rate: product.rate
			          //  quantity: product.quantity,
					}
		
					console.log(editinput);
		
			$http.post('https:10.21.84.45:8000/updateproduct/', editinput,{
			//headers: {'Content-Type': undefined},
			withCredentials: true
			})
				.then(function(response){
				   product.showUpdateForm = false;
					console.log(response.data);

					product.Productname = product.updName;
					product.About = product.details;
					product.Image = product.updimages;
					product.Manufacturedate = product.updmanu;
					product.Rate = product.updrate;

		
			})
				.catch(function(error){
				   console.log(error);
			})
		  
			//product.updateData=false;
		}


		$scope.deleteProduct = function(product){
			
			var dlt = {
				productid : product.Productid
			}

			console.log(dlt);
			$http.delete('https:10.21.84.45:8000/product/',dlt, {
				headers: {'Content-Type': undefined},
				withCredentials : true
			})
			.then(function(response){
				console.log(response)
				var index = $scope.products.indexOf(product);
		if (index !== -1) {
		$scope.products.splice(index, 1);
	}
			})
			.catch(function(error){
				console.log(error)
			})
		}
  }]);


  app.controller('CartController',['$scope', '$state', '$http', function($scope, $state, $http){

	$scope.product=[];

	$http.get('https:10.21.84.45:8000/addtocart/', {
		//headers: {'Content-Type': undefined},
		withCredentials: true
	})
	.then(function(response){
		 console.log(response.data);
		 var results = response.data;
		 $scope.products=results;
		 console.log($scope.products);
 })
	 .catch(function(error){
		console.log(error);
 })

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

