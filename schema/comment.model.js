const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment_content: {
      type: String,
      required: true,
    },
    comment_group: {
      type: String,
      default: "product",
    },
    comment_likes: {
      type: Number,
      default: 0,
    },
    comment_owner: {
      type: Object,
      ref: "Member",
      required: false,
    },
    comment_ref_id: {
      type: mongoose.Schema.Types.ObjectId,
    },

    comment_stars: {
      type: Number,
      default: 0,
    },
    mb_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("Comment", CommentSchema);
