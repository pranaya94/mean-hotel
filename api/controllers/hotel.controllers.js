var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.hotelsGetAll = function(req,res){
	var offset = 0;
	var count = 5;
	var maxCount = 10;
	console.log("requested by : " + req.user);
	var runGeoQuery = function(req,res){

		var lng = parseFloat(req.query.lng);
		var lat = parseFloat(req.query.lat);

		if(isNaN(lng) || isNaN(lat)){
			res
				.status(400)
				.json({
					message : "Coordinates must be numbers"
				});
				return;
		}
		// a geoJSON point
		var point = {
			type : "Point",
			coordinates : [lng,lat]
		};

		var geoOptions = {
			spherical : true,
			maxDistance : 2000,
			num : 5
		};

		Hotel
			.geoNear(point,geoOptions,function(err,results,stats){
				if(err){
					console.log("Error getting hotel from location")
					res
						.status(400)
						.json(err);
						return;
				}
				console.log('Geo results',results);
				console.log('Geo stats',stats);
				res
					.status(200)	
					.json(results);
			});
	};

	if(req.query && req.query.lat && req.query.lng){
		runGeoQuery(req,res);
		return;
	}
	if(req.query && req.query.offset){
		offset = parseInt(req.query.offset,10);
	}
	if(req.query && req.query.count){
		count = parseInt(req.query.count,10);
	}

	if(isNaN(offset)||isNaN(count)){
		res
			.status(400)
			.json({
				message : "count and offset should be numbers"
			})
		return;
	}
	if(count>maxCount){
			res
					.status(400)
					.json({
						message : "Count Limit of " + maxCount + " exceeded"
					});
				return;
		}

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err,hotels){
			if(err){				
				console.log("Error finding hotels");
				res
						.status(500) //internal server error
						.json(err);
			} else{
			console.log("Found hotels", hotels.length);
			res
			   .json(hotels);
			 }
		});
};

module.exports.hotelsGetOne = function(req, res){

	var hotelId = req.params.hotelId;
	console.log("Get hotel: " + hotelId);
	Hotel
		// .findOne({_id : hotelId})
		.findById(hotelId)
		.exec(function(err,thisHotel){
				
				var response = {
					status : 200,
					message : thisHotel
				}
				if(err){
					response.status = 400;
					response.message = err;					
				}
				else if(!thisHotel){
					response.status = 404;
					response.message = {
						message : "Hotel not found"
							};
					}else{
					response.status = 200;
					response.message = thisHotel;
					}
				res
				   .status(response.status)
				   .json(response.message);
			
		});
	
};

var _splitArray = function(input){
	var output;
	if(input && input.length>0){
		output = input.split(";");
	}else {
		output = [];
	}
	return output;
}
module.exports.hotelsAddOne = function(req,res){
	Hotel
		.create({
			name : req.body.name,
			description : req.body.description,
			stars : parseInt(req.body.stars,10),
			services : _splitArray(req.body.services),
			photos : _splitArray(req.body.photos),
			currency : req.body.currency,
			location : {
				address : req.body.address,
				coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
			}
		},function(err,doc){
			if(err){
				console.log("Error creating hotel");
				res
					.status(400)
					.json(err);
				}else {
					res
						.status(201)
						.json(doc);
				}
			}
		);
};

module.exports.hotelUpdateOne = function(req,res){
		var hotelId = req.params.hotelId;
		Hotel
			.findById(hotelId)
			.select("-reviews -rooms")
			.exec(function(err,doc){
				var response = {
					status : 200,
					message : []
				}
				if(err){
					response.status = 500;
					response.message = err;
				}else if(!doc){
					respons.status = 404;
					response.message = {
						message : "hotel not found"
					};
				}
				if(response.status!==200){
				res
					.status(response.status)
					.json(response.message);
				}else{
					doc.name = req.body.name,
					doc.description = req.body.description,
					doc.stars = parseInt(req.body.stars,10),
					doc.services = _splitArray(req.body.services),
					doc.photos = _splitArray(req.body.photos),
					doc.currency = req.body.currency,
					doc.location = {
						address : req.body.address,
						coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
						}
					
					doc.save(function(err,hotelUpdated){
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

module.exports.hotelDeleteOne = function(req,res){
var hotelId = req.params.hotelId;

Hotel
	.findByIdAndRemove(hotelId)
	.exec(function(err,hotel){
			if(err){
				console.log("error deleting hotel");
				res
					.status(404)
					.json(err);
			}else{
				console.log("hotel deleted");
				res
					.status(204)
					.json();
			}
	});
};