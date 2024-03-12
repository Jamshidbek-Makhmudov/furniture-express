const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    reply_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reply_content: {
      type: String,
      required: true,
    },
    reply_owner: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("replyComment", replySchema);
