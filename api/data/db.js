var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl); //no callback, we list

mongoose.connection.on('connected',function(){
	console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected',function(){
	console.log('Mongoose disconnected');
});

mongoose.connection.on('error',function(err){
	console.log('Mongoose connection error: ' + err);
});	

process.on('SIGINT',function(){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through app termination (SIGINT)');
		process.exit(0);
	});
}); 

// BRING IN SCHEMAS AND MODELS
require('./hotels.model.js');
require('./users.model.js');
