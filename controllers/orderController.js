const assert = require("assert");
const Definer = require("../lib/mistake");
const Order = require("../models/Order");

const orderController = {
  createOrder: async (req, res) => {
    try {
      console.log(`POST: cont/createOrder`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, body } = req;
      const order = new Order();
      const result = await order.createOrderData(member, body);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/createOrder, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getMyOrders: async (req, res) => {
    try {
      console.log(`GET: cont/getMyOrders`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, query } = req;
      const order = new Order();
      const result = await order.getMyOrdersData(member, query);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getMyOrders, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  editChosenOrder: async (req, res) => {
    try {
      console.log(`POST: cont/editChosenOrder`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, body } = req;
      const order = new Order();
      const result = await order.editChosenOrderData(member, body);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/editChosenOrder, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },
};
module.exports = orderController;
