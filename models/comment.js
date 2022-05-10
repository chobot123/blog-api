var mongoose = require('mongoose');
const { DateTime } = require('luxon');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

    username: {
               type: String,
               minLength: 3,
               required: true,
          },
    
    text: {
                type: String,
                minLength: 1,
                required: true,
          },

    post: {
                type: Schema.Types.ObjectId, 
                ref: 'Post',
          },
    
    timestamp: {
                type: Date,
                default: Date.now(),
                required: true,  
               }
});

CommentSchema
.virtual('date')
.get(function(){
      return DateTime.fromJSDate(this.timestamp).toFormat('yyyy-mm-dd @ hh:mm');
})

module.exports = mongoose.model("Comment", CommentSchema);