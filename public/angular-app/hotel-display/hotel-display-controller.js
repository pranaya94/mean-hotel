angular.module('meanhotel').controller('HotelController',HotelController);

function HotelController($routeParams,hotelDataFactory){
	var vm = this;
	var id = $routeParams.id;
	hotelDataFactory.hotelDisplay(id).then(function(response){
		vm.hotel = response;
		vm.stars = _getStarRating(response.stars);
	});

	function _getStarRating(input){
		a = new Array(input);
		for(i = 0;i<a.length;i++){ a[i] = "*";}
			return(a);
	}
}