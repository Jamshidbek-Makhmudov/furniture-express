const mongoose = require("mongoose");
const {
  product_size_enums,
  product_status_enums,
  product_collection_enums,
  product_color_enums,
} = require("../lib/config");

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      required: true,
      default: "PROCESS",
      enum: {
        values: product_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_size: {
      type: String,
      default: "normal",
      required: true,
      enum: {
        values: product_size_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_color: {
      type: String,
      default: "white" || "black",
      required: true,
      enum: {
        values: product_color_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_description: {
      type: String,
      required: true,
    },
    product_images: {
      type: [String],
      required: false,
      default: [],
    },
    seller_mb_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    product_likes: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
  { versionKey: false }
);
productSchema.index(
  { seller_mb_id: 1, product_name: 1, product_size: 1, product_color: 1 },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
