const Mongoose = require("mongoose");
const { Schema } = require("mongoose");

const AttachmentSchema = new Schema({
    attc: Schema.Types.Boolean,
    type: Schema.Types.String
});

module.exports = Mongoose.model("Attachment", AttachmentSchema);