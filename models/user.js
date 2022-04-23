var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    username: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 16,
              },

    password: {
                type: String,
                minLength: 8,
                required: true,
              },
});

UserSchema
.virtual('url')
.get(function(){
    return '/user/' + this._id;
})

module.exports = mongoose.model('User', UserSchema);