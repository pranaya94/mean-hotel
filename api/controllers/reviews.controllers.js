var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req,res){
var hotelId = req.params.hotelId;
console.log("Getting reviews for hotel : ",hotelId);
Hotel
     .findById(hotelId) 
     .select('reviews')    
     .exec(function(err,doc){
     	var result = {
     		status : 200,
     		message : doc
     	}
     	if(err){
     		result.status = 400;
     		result.message = "Error finding hotel";
     	}else if(!doc){
     		result.status = 404;
     		result.message = "Hotel not found";     		
     	}
     	else if(!doc.reviews){
     		result.status = 200;
     		result.message = []
     	}
     	res
     	   .status(result.status)
     	   .json(result.message);     	   
     });
};

module.exports.reviewsGetOne = function(req,res){
var hotelId = req.params.hotelId;
var reviewId = req.params.reviewId;
console.log("Getteing review : ",reviewId," for hotel : ",hotelId);
Hotel
	.findById(hotelId)
	.select('reviews')	
	.exec(function(err,doc){
		var result = {
			status : 200,
			message : doc
		}
		if(err){
			result.status = 400;
			result.message = "Review Route : Error finding hotel reviews";
		}
		else if(!doc){
			result.status = 404,
			result.message = "Review Route : Hotel not found in database"
		}
		else{
		var review = doc.reviews.id(reviewId);
			if(!review){
				result.status = 404;
				result.message = "Review Route : Review not found";
			}
		}

		// var reviewText = review.review;	
		res
			.status(result.status)
			.json(result.message);
	});
};

var _insertReview = function(req,res,hotel){	
	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating,10),
		review : req.body.review
	});

	hotel.save(function(err,hotelUpdated){
		if(err){
			console.log("error in pushing comment");
			res
				.status(500)	
				.json(err);
		}
		else{
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);				
		}
	});
};

module.exports.reviewsAddOne = function(req,res){	
	var hotelId = req.params.hotelId;
	
	Hotel
		.findById(hotelId)
		.exec(function(err,doc){
			var response = {
				status : 200,
				message : []
			}
			if(err){
				response.status = 500;
				response.message = "Review Add Error : Error finding hotel";
				res
				.status(response.status)
				.json(response.message)

			}else if(!doc){
				response.status = 404;
				response.message = "Review Add Error : Hotel not found in database";
				res
				.status(response.status)
				.json(response.message)
			}
			else{						
				_insertReview(req,res,doc);				
			}			
		});
}

_updateReview = function(req,res,doc){
	
	doc
		.findById(req.params.reviewId)
		.exec(function(err,review){
			if(err){
				res
					.status(500)
					.json(err);
			}else if(!reviews){
				res
					.status(404)
					.json({
						message : "review id not found"
					});
			}else{
				review.name = req.body.name;
				review.rating = parseInt(req.body.rating);
				review.review = req.body.review;

				review.save(function(err,reviewUpdated){
					if(err){
						console.log("error aya");
						res
							.status(500)
							.json(err);
					}else{
						console.log("updated review" + reviewId);
						res
							.status(204)
							.json();
					}
				});
			}
		});
};

module.exports.reviewsUpdateOne = function(req,res){
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err,doc){
			var response = {
				status : 200,
				message : []
				};

			if(err){
				response.status = 500;
				message = {
					message : "Review update : Error finding hotel"
							};											
			}else if(!doc){
				response.status = 404;
				message = {
					message : "Review update : Hotel not found"
				};
			}

			if(response.status!==200){
				res
					.status(response.status)
					.message(response.message);
			}else{				
				thisReview = doc.reviews.id(reviewId);
				thisReview.name = req.body.name;
				thisReview.rating = parseInt(req.body.rating);
				thisReview.review = req.body.review;

				doc.save(function(err,updatedDoc){
					if(err){
						res
							.status(500)
							.json(err);
					}else{
						res
							.status(204)
							.json();
					}
				});
			}
			
		});
};

module.exports.reviewsDeleteOne = function(req,res){
var reviewId = req.params.reviewId;
var hotelId = req.params.hotelId;
Hotel
	.findById(hotelId)
	.exec(function(err,hotel){
		response = {
			status : 200,
			message : []
		};

		if(err){
			response.status = 500;
			response.message = err;
			}else if(!hotel){
				response.status = 404;
				response.message = {
					message : "hotel not found"
				};
			}
		if(response.status!==200){
			res
				.status(response.status)
				.message(response.message);
		}else{
			hotel.reviews.id(reviewId).remove();
			hotel.save(function(err,hotelUpdated){
				if(err){
					res
						.status(500)
						.json(err);
				}else{
					res
						.status(204)
						.json();
				}
			});
		}				
	});
};