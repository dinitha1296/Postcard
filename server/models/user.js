const Mongoose = require("mongoose");
const { Schema } = require("mongoose");

const UserSchema = new Schema({
    username: Schema.Types.String,
    password: Schema.Types.String,
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    inbox: Schema.Types.Array,
    sent: Schema.Types.Array,
    starred: Schema.Types.Array,
    snooze: Schema.Types.Array,
    spam: Schema.Types.Array,
    chats: Schema.Types.Array,
    blocked: Schema.Types.Array,
    createdDate: Schema.Types.Date
});

module.exports = Mongoose.model("User", UserSchema);