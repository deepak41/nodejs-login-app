var User = require("../models/users");


module.exports = function(router) {
	'use strict';

	// for registering a new user, url /api/users/
	router.route('/')
		.post(function(req, res, next) {
			var user_id = '' + new Date().getFullYear() + randomstring.generate({length: 3, charset: 'numeric'});
			var newUser = {
				user_id: user_id,
				email: req.body.email,
				password: req.body.password,
				name: req.body.name
			};
			newUser = JSON.parse(JSON.stringify(newUser));
			User.create(newUser, (err, doc) => {
				if(err && err.code == 11000) return next({
	                status: 409,
	                message: "Email is already registered!",
	                email: newUser.email
	            });
				if(err) return next(err);
				return res.json({
					error: "false",
					message: "User registered successfully!",
					data: doc
				})
			})
		});


	// for getting users, url /api/users/
	router.route('/')
		.get(function(req, res, next) {
			var query = {};
			if(req.body.email) {
				query = {name: req.body.email};
			}
			User.find(query, (err, doc) => {
				if(err) return next(err);
				return res.json({
					error: "false",
					message: "Users found successfully!",
					data: doc
				})
			});
		});
};
