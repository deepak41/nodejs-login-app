global.express = require('express');
global.nconf = require('nconf');
global.logger = require('winston');
global.request = require('request');
global.path = require('path');
global.randomstring = require("randomstring");
global.auth = require("../auth");
var http = require("http");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var app;

var start = function(callback) {
	'use strict';

	app = express();

	app.use(morgan('common'));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({
		type: '*/*'
	}));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		next();
	});

	// Intializing routes
	require('../../app/routes/index')(app);
	logger.info('[SERVER] Routes have been initialized');
	
	// Error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			error: "true",
			message: err.message,
			data: (app.get('env') === 'development' ? err : null)
		});
	});

	// Connect to mongodb
	mongoose.connect(nconf.get('database'), {useMongoClient: true}, function(err) {
		if(err) {
			err.message  = "[SERVER] Failed to connect to the DB"
			return callback(err)
		}
	  	logger.info('[SERVER] Successfully connected to the DB ' + nconf.get('database'));

	  	// Start server
	  	http.createServer(app).listen(nconf.get('NODE_PORT'), () => {
			logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + nconf.get('NODE_PORT'));
		});

	});
};

module.exports = start;
