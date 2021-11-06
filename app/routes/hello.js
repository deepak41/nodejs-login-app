module.exports = function(router) {
	'use strict';

	// hello route, url: /api/hello
	router.route('/')
		.get(auth.authenticate, function(req, res, next) {
			res.json({
				error: "false",
				message: "Hello World!",
				data: null
			})	
		});
}
