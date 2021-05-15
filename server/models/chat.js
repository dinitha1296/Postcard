const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChatSchema = new Schema({
    participants: Schema.Types.Array,
    Messages: Schema.Types.Array
});

module.exports = Mongoose.model("Chat", ChatSchema);