var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Creates a Mongoose Schema for the data structure of the document model for USERS in the Database 
 * @param {String} username The username designated by the user
 * @param {String} password The password designated by the user
 */

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

// UserSchema
// .virtual('url')
// .get(function(){
//     return '/user/' + this._id;
// })

module.exports = mongoose.model('User', UserSchema);