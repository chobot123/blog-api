var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Creates a Mongoose Schema for the data structure of the document model for the REFRESH TOKENS in the Database 
 * @param {String} token The refresh token 
 */

var refreshSchema = new Schema({
    token: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Refresh', refreshSchema);