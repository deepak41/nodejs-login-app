var User = require("../models/users");

module.exports = function(router) {

    // For user login, url /api/sessions
    router.route('/')
       .post(function (req, res, next) {
            User.findOne({email: req.body.email}, (err, user) => {                
                if(!user) return next({
                    status: 401,
                    message: "Invalid Credentials!"
                });
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if(!err && isMatch) {
                        var token = auth.createToken(user);
                        res.json({
                            error: "false",
                            message: "Login is successful!",
                            data: {token: token}
                        });
                    } 
                    else {
                        next({
                            status: 401,
                            message: "Invalid Credentials!"
                        })
                    }
                });
            });
        });
}
