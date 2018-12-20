var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// create a schema

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: {unique: true} },
  password: { type : String,required: true },
  admin: { type: Boolean, required: true },
  companyName: {type: String, required: true, max: 100},
  last_update: { type : Date, default : Date.now }


});
/*
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});*/


//UserSchema.plugin(passportLocalMongoose);
User = mongoose.model("User",UserSchema);
module.exports = User;
  
 
















