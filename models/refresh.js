var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var refreshSchema = new Schema({
    token: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Refresh', refreshSchema);