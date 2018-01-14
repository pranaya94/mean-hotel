var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		min : 0,
		max : 5,
		required : true
	},
	review : {
		type : String,
		required : true
	},
	createdOn : {
		type : Date,
		"default" : Date.now
	}
});

var roomSchema = new mongoose.Schema({
	type : String,
	number : Number,
	description : String,
	photos : [String],
	price : Number
});

var hotelSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	stars : {
		type : Number,
		min : 0,
		max : 5,
		"default" : 0
	},

	services : [String], //array of strings
	description : String,
	photos : [String],
	currency : String,
	reviews : [reviewSchema],
	rooms : [roomSchema],
	location : {
		address : String,
		coordinates : {
		type : [Number], //always store long lat
		index : '2dsphere'
		}
	}
},{usePushEach : true});

mongoose.model('Hotel',hotelSchema,'hotels');
