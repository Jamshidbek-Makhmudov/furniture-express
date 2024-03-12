const mongoose = require("mongoose");
const { board_article_status_enum_list } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    seller_mb_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },

    event_location: {
      type: String,
      required: true,
    },
    event_title: { type: String, required: true },
    event_description: {
      type: String,
      required: true,
    },
    event_status: {
      type: String,
      required: true,
      default: "Active",
      enum: {
        values: board_article_status_enum_list,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    event_views: {
      type: Number,
      required: false,
      default: 0,
    },

    event_date: {
      type: Date,
      default: "10/02/2024",
      required: true,
    },

    event_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Event", eventSchema);
