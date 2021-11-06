var jwt = require("jsonwebtoken");
var User = require("../app/models/users");


exports.createToken = function(user) {
	var payload = {
		user_id: user.user_id,
		name: user.name
	};
	var token = jwt.sign(
		{payload: payload}, 
		nconf.get('secret-key'),
		{expiresIn: 60*60},
	);
	return token;
};


exports.authenticate = function(req, res, next) {
	var token = req.headers.authorization;
	try {
		var decoded = jwt.verify(token, nconf.get('secret-key'));
	} catch (err) {
		return next({
			status: 401,
			message: "Authorisation token is invalid or expired!"
		})
	}
	res.locals.user_info = decoded.payload;
	next();
};
