var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
	user_id: {
		type: String,
		unique: [true, 'User ID Already Exists'],
		required: [true, 'User ID Field Is Required']
	},
	email: {
		type: String,
		unique: [true, 'Email Already Exists'],
		required: [true, 'Email Field Is Required']
	},
	password: {
		type: String,
		required: [true, 'Password Field Is Required']
	},
	name: {
		type: String,
		required: [true, 'Name Field Is Required']
	}
}, {timestamps: true});

UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.password) return next()
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if(err) return next(err);
			bcrypt.hash(user.password, salt, (err, hash) => {
				if(err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		return next("document not found");
	}
});

UserSchema.methods.comparePassword = function(passw, cb) {
	bcrypt.compare(passw, this.password, (err, isMatch) => {
		cb(err, isMatch);
	});
};

UserSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj._id
	delete obj.__v
	delete obj.password
	return obj
};


const User = mongoose.model('users', UserSchema, 'users');
module.exports = User;
