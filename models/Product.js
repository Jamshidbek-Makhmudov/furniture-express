const assert = require("assert");
const productModel = require("../schema/product.model");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Product {
  constructor() {}

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let match = { product_status: "PROCESS" };
      if (data.seller_mb_id) {
        match["seller_mb_id"] = shapeIntoMongooseObjectId(data.seller_mb_id);
      }

      if (data.product_collection) {
        match["product_collection"] = data.product_collection;
      }

      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : data.order === "sale"
          ? { createdAt: 1 }
          : { [data.order]: -1 };

      if (data.order === "product_price") {
        match["product_price"] = {
          $gte: data.product_price_min,
          $lte: data.product_price_max,
        };
      }
      if (data.product_color) {
        match["product_color"] = { $eq: data.product_color };
      }

      const result = await productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data["page"] * 1 - 1) * data.limit },
          { $limit: data["limit"] * 1 },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "product");
      }

      const result = await productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      data.seller_mb_id = shapeIntoMongooseObjectId(member._id);

      const new_product = new productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      console.log("res", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(param_id, updated_data, auth_id) {
    try {
      const id = shapeIntoMongooseObjectId(param_id),
        mb_id = shapeIntoMongooseObjectId(auth_id);

      console.log(updated_data);
      const result = await productModel
        .findOneAndUpdate({ _id: id, seller_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMySellerProductsData(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member?._id);
      const result = await productModel.find({
        seller_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
