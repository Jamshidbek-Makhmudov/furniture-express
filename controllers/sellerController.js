const assert = require("assert");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const Definer = require("../lib/mistake");
const Article = require("../models/Article");
const Event = require("../models/Event");

const sellerController = {
  getSellers: async (req, res) => {
    try {
      console.log(`GET: cont/getSellers `);
      const data = req.query,
        seller = new Seller(),
        result = await seller.getSellersData(req.member, data);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getSellers,    ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getChosenSeller: async (req, res) => {
    try {
      console.log(`GET: cont/getChosenSeller `);
      const seller = new Seller(),
        id = req.params.id,
        result = await seller.getChosenSellerData(req.member, id);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getChosenSeller,    ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  //BSSR
  home: async (req, res) => {
    try {
      console.log(`GET: cont/home`);

      res.render("home-page");
    } catch (err) {
      console.log(`ERROR, cont/home, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getMySellerProducts: async (req, res) => {
    try {
      console.log(`GET: cont/getMySellerProducts`);
      const product = new Product();
      const data = await product.getMySellerProductsData(req.session.member);
      res.render("seller-menu", { seller_data: data });
    } catch (err) {
      console.log(`ERROR, cont/getMySellerProducts, ${err.message}`);
      res.redirect("/furni");
    }
  },

  getMySellerEvents: async (req, res) => {
    try {
      console.log(`GET: cont/getMySellerEvents`);
      const event = new Event();
      const data = await event.getMySellerEventsData(req.session.member);
      res.render("my-events", { my_events_data: data });
    } catch (err) {
      console.log(`ERROR, cont/getMySellerEvents, ${err.message}`);
      res.redirect("/furni");
    }
  },

  getSignupMySeller: async (req, res) => {
    try {
      console.log(`GET: cont/getSignupMySeller`);
      res.render("signup");
    } catch (err) {
      console.log(`ERROR, cont/getSignupMySeller, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  signupProcess: async (req, res) => {
    try {
      console.log(`POST: cont/signupProcess`);
      assert(req.file, Definer.general_err3);
      let new_member = req.body;
      new_member.mb_type = "SELLER";
      new_member.mb_image = req.file.path.replace(/\\/g, "/");
      const member = new Member(),
        result = await member.signupData(new_member);
      assert(result, Definer.general_err1);

      req.session.member = result;
      req.session.save(function () {
        res.redirect("/furni/products/menu");
      });
    } catch (err) {
      console.log(`ERROR, cont/signup, ${err.message}`);
      res.send(
        ` <script>alert("${err.message}"); window.location.replace('/furni/sign-up');</script>
          `
      );
    }
  },

  getLoginMySeller: async (req, res) => {
    try {
      console.log(`GET: cont/LoginMySeller`);
      res.render("login-page");
    } catch (err) {
      console.log(`ERROR, cont/login, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  loginProcess: async (req, res) => {
    try {
      console.log(`POST: cont/loginProcess`);
      const data = req.body,
        member = new Member(),
        result = await member.loginData(data);

      req.session.member = result;
      req.session.save(function () {
        result.mb_type === "SELLER"
          ? res.redirect("/furni/products/menu")
          : res.redirect("/furni/all-sellers");
      });
    } catch (err) {
      console.log(`ERROR, cont/login, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  logout: (req, res) => {
    try {
      console.log("GET cont.logout");
      req.session.destroy(function () {
        res.redirect("/furni");
      });
    } catch (err) {
      console.log(`ERROR, cont/login, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  validateAuthSeller: (req, res, next) => {
    if (req.session?.member?.mb_type === "SELLER") {
      req.member = req.session.member;
      next();
    } else
      res.json({
        state: "fail",
        message: "only authenticated members with SELLER type",
      });
  },

  checkSessions: (req, res) => {
    if (req.session?.member) {
      res.json({ state: "success", data: req.session.member });
    } else {
      res.json({ state: "fail", message: "You are not authenticated" });
    }
  },

  validateAdmin: (req, res, next) => {
    if (req.session?.member?.mb_type === "ADMIN") {
      req.member = req.session.member;
      next();
    } else {
      const html = `<script>alert("Admin page: Permission denied!");
          window.location.replace="/furni";
          </script>`;
      res.end(html);
    }
  },

  getAllSellers: async (req, res) => {
    try {
      console.log("GET cont/getAllSellers");
      const seller = new Seller();
      const seller_data = await seller.getAllSellersData();
      const article = new Article();
      const article_data = await article.getAllArticlesData();
      res.render("all-sellers", {
        seller_data: seller_data,
        article_data: article_data,
      });
    } catch (err) {
      console.log(`ERROR, cont/getAllSellers, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  updateSellerByAdmin: async (req, res) => {
    try {
      console.log("GET cont/updateSellerByAdmin");
      const seller = new Seller();
      const result = await seller.updateSellerByAdminData(req.body);
      await res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/updateSellerByAdmin, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },
};

module.exports = sellerController;
