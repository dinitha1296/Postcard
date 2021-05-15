const Mongoose = require("mongoose");
const { Schema } = require("mongoose");

const EmailSchema = new Schema({
    to: Schema.Types.String,
    by: Schema.Types.String,
    cc: Schema.Types.Array,
    body: Schema.Types.String,
    attc: Schema.Types.Array,
    datatime: Schema.Types.Date
});

module.exports = Mongoose.model("Email", EmailSchema);