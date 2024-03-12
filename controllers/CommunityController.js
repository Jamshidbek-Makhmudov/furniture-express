const assert = require("assert");
const Definer = require("../lib/mistake");
const Article = require("../models/Article");

const communityController = {
  imageInsertion: async (req, res) => {
    try {
      console.log(`POST: cont/imageInsertion`);
      console.log(req.file);
      assert.ok(req.file, Definer.general_err3);
      const image_url = req.file.path.replace(/\\/g, "/");

      res.json({ state: "success", data: image_url });
    } catch (err) {
      console.log(`ERROR, cont/imageInsertion, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  createArticle: async (req, res) => {
    try {
      console.log(`GET: cont/createArticle`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, body } = req;
      const article = new Article();
      const result = await article.createArticleData(member, body);

      assert.ok(result, Definer.general_err1);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/createArticle, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getMemberArticles: async (req, res) => {
    try {
      console.log(`GET: cont/getMemberArticles`);

      const { member, query } = req;
      const article = new Article();
      const mb_id = query.mb_id !== "none" ? query.mb_id : member?._id;

      assert.ok(mb_id, Definer.article_err1);

      const result = await article.getMemberArticlesData(member, mb_id, query);

      assert.ok(result, Definer.general_err1);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getMemberArticles, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getArticles: async (req, res) => {
    try {
      console.log(`GET: cont/getArticles`);

      const { member, query } = req;
      const article = new Article();

      const result = await article.getArticlesData(member, query);

      assert.ok(result, Definer.general_err1);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getArticles, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  //BSSR//
  getAllArticles: async (req, res) => {
    try {
      console.log("GET cont/getAllarticles");

      const article = new Article();
      const article_data = await article.getAllArticlesData();
      res.render("all-articles", { article_data: article_data });
    } catch (err) {
      console.log(`ERROR, cont/getAllarticles, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  updateArticleStatusByAdmin: async (req, res) => {
    try {
      console.log("GET cont/updateArticlesStatus");
      const article = new Article();
      const result = await article.updateArticleByAdminData(req.body);
      await res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/updateArticlesStatus, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getChosenArticle: async (req, res) => {
    try {
      console.log("cont/getChosenArticle");
      const art_id = req.params.art_id,
        article = new Article(),
        result = await article.getChosenArticleData(req.member, art_id);
      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getChosenArticle, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },
};

module.exports = communityController;
