const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const MessageSchema = new Schema({
    body: Schema.Types.String,
    date: Schema.Types.Date,
    sender: Schema.Types.ObjectId,
    chatIndex: Schema.Types.Number,
    delete_for: Schema.Types.Array
});

module.exports = Mongoose.model("Message", MessageSchema);