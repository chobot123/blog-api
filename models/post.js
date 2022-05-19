var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Creates a Mongoose Schema for the data structure of the document model for POSTS in the Database 
 * @param {String} title Title of the post designated by the user
 * @param {Date} timestamp The current date when the post is created
 * @param {Schema} user The user who created the post
 * @param {String} text The text body of the post
 * @param {Boolean} published Designates if the post is published or not
 */

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

module.exports = mongoose.model("Post", PostSchema);