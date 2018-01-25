angular.module('meanhotel').controller('HotelController',HotelController);

function HotelController($route,$routeParams,hotelDataFactory){
	var vm = this;
	var id = $routeParams.id;
	vm.isSubmitted = false;
	//gets called the moment the view is rendered
	hotelDataFactory.hotelDisplay(id).then(function(response){
		console.log(response);
		vm.hotel = response.data;
		vm.stars = _getStarRating(response.data.stars);		
	});

	function _getStarRating(input){
		a = new Array(input);
		for(i = 0;i<a.length;i++){ a[i] = "*";}
			return(a);
	}

	vm.addReview = function(){

		var postData = {
			name: vm.reviewer,
			rating: vm.rating,
			review: vm.review
		};

		if(vm.reviewForm.$valid){
			hotelDataFactory.postReview(id,postData).then(function(response){
				if(response.status === 201){
					$route.reload();
				}
			}).catch(function(error){
				console.log(error);				
			});		
		}else{
			vm.isSubmitted = true;
		}

	
	}
	
}