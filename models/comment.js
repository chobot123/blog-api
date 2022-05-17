var mongoose = require('mongoose');
const { DateTime } = require('luxon');
var Schema = mongoose.Schema;

/**
 * Creates a Mongoose Schema for the data structure of the docuemnt model for COMMENTS in the Database
 * @param {String} username Username designated by the user
 * @param {String} text The text body message designated by the user
 * @param {Schema} post The post document the comment is attached to
 * @param {Date} timestamp The current date when the comment is created
 */

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
                required: true,
          },
    
    timestamp: {
                type: Date,
                default: Date.now(),
                required: true,  
               }
});

// CommentSchema
// .virtual('date')
// .get(function(){
//       return DateTime.fromJSDate(this.timestamp).toFormat('yyyy-mm-dd @ hh:mm');
// })    

module.exports = mongoose.model("Comment", CommentSchema);