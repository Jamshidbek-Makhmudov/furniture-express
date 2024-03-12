const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const orderItemModel = require("../schema/orderItem.model");
const orderModel = require("../schema/order.model");

class Order {
  constructor() {}
  async createOrderData(member, data) {
    try {
      let order_total_amount = 0,
        delivery_cost = 0;
      const mb_id = shapeIntoMongooseObjectId(member._id);

      data.map(({ quantity, price, sale_price }) => {
        order_total_amount += quantity * (sale_price ?? price);
      });

      const order_id = await this.saveOrderData(
        order_total_amount,
        delivery_cost,
        mb_id
      );

      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
      const new_order = new orderModel({
        order_total_amount: order_total_amount,
        order_delivery_cost: delivery_cost,
        mb_id: mb_id,
      });

      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);

      return result._id;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });
      const results = await Promise.all(pro_list);
      console.log("result:::", results);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData({ _id, quantity, price }, order_id) {
    try {
      order_id = shapeIntoMongooseObjectId(order_id);
      _id = shapeIntoMongooseObjectId(_id);

      const order_item = new orderItemModel({
        item_quantity: quantity,
        item_price: price,
        order_id: order_id,
        product_id: _id,
      });

      const result = await order_item.save();
      assert.ok(result, Definer.order_err2);
      return "inserted";
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err2);
    }
  }

  async getMyOrdersData(member, query) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_status = query.status.toUpperCase(),
        matches = { mb_id: mb_id, order_status: order_status };

      const result = await orderModel
        .aggregate([
          { $match: matches },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "orderitems",
              localField: "_id",
              foreignField: "order_id",
              as: "order_items",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "order_items.product_id",
              foreignField: "_id",
              as: "product_data",
            },
          },
        ])
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async editChosenOrderData(member, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_id = shapeIntoMongooseObjectId(data.order_id),
        order_status = data.order_status.toUpperCase();

      const result = await orderModel.findOneAndUpdate(
        { mb_id: mb_id, _id: order_id },
        { order_status: order_status },
        { runValidators: true, lean: true, returnDocument: "after" }
      );
      console.log(result);

      assert.ok(result, Definer.order_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Order;
