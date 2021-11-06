var jwt = require("jsonwebtoken");
var User = require("../app/models/users");


exports.createToken = function(user) {
	var payload = {
		user_id: user.user_id,
		name: user.name
	};
	payload = JSON.stringify(payload);

	var objJson = {};
	objJson.payload = payload;
	objJson.signature = jwt.sign(
		{payload: payload}, 
		nconf.get('secret-key'),
		{expiresIn: 60*60}
	);

	var token = encodeBase64(objJson)
	return token;
};


exports.authenticate = function(req, res, next) {
	var token = decodeBase64(req.headers.authorization);
	try {
		var decoded = jwt.verify(token.signature, nconf.get('secret-key'));
	} catch (error) {
		return next({
			status: 401,
			message: "Authorisation token is invalid or expired!"
		})
	}
	if(decoded.payload != token.payload) {
		return next({
			status: 401,
			message: "Authorisation token is invalid or expired!"
		})
	}
	next();
};


var encodeBase64 = function(objJson) {
	var objJsonStr = JSON.stringify(objJson);
	var encoded = Buffer.from(objJsonStr).toString("base64");
	return encoded;
};


var decodeBase64 = function(str) {
	var obj = Buffer.from(str, 'base64').toString('ascii');
	obj = JSON.parse(obj);
	return obj;
};
