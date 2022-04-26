var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({

    title: {
                type: String,
                minLength: 1,
                required: true,
           },
    
    timestamp: {
                type: Date,
                default: Date.now(),
                required: true,
               },

    user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
          },
    
    text: {
                type: String,
                maxLength: 5000,
                required: true,
          },
    
    published: {
                type: Boolean, 
                default: false, 
                required: true
               },
})

PostSchema
.virtual('date')
.get(function() {
    return DateTime.fromJSDate(this.timestamp).toFormat('DDDD @ tt');
})

PostSchema
.virtual('url')
.get(function(){
    return '/post/' + this._id;
})

module.exports = mongoose.model("Post", PostSchema);