const assert = require("assert");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      console.log(`GET: cont/getAllProducts `);
      const product = new Product();
      const result = await product.getAllProductsData(req.member, req.body);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getAllProducts,    ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getChosenProduct: async (req, res) => {
    try {
      console.log(`GET: cont/getChosenProduct `);
      const product = new Product(),
        id = req.params.id,
        result = await product.getChosenProductData(req.member, id);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getChosenProduct,    ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  //BSSR
  addNewProduct: async (req, res) => {
    try {
      console.log("POST: cont/addNewProduct");
      assert(req.files, Definer.general_err3);
      const product = new Product();
      const data = req.body;
      data.product_images = req.files.map((value) => {
        return value.path.replace(/\\/g, "/");
      });
      const result = await product.addNewProductData(data, req.member);

      const html = `<script> alert("New product added successfully");
      window.location.replace('/furni/products/menu')</script>`;
      res.end(html);
    } catch (err) {
      console.log(`ERROR, cont/addNewProduct, ${err.message}`);
    }
  },

  updateChosenProduct: async (req, res) => {
    try {
      console.log("POST: cont/updateChoseProduct");
      const product = new Product();
      const id = req.params.id;
      const result = await product.updateChosenProductData(
        id,
        req.body,
        req.member._id
      );
      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/updateChosenProduct, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },
};

module.exports = productController;
