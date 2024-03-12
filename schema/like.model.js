const mongoose = require("mongoose");
const { board_id_enum_list, like_view_group_list } = require("../lib/config");
const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    mb_id: { type: Schema.Types.ObjectId, required: true },
    like_ref_id: { type: Schema.Types.ObjectId, required: true },
    like_group: {
      type: String,
      required: true,
      enum: {
        values: like_view_group_list,
      },
    },
    bo_id: {
      type: String,
      required: false,
      enum: { values: board_id_enum_list },
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("like", likeSchema);
