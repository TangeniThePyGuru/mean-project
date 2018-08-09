/**
 * Created by tshikomba on 8/9/2018.
 */
const mongoose = require('mongoose');

// define fields and type of data
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);

