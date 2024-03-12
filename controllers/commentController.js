const assert = require("assert");
const Definer = require("../lib/mistake");
const Comment = require("../models/Comment");

const commentController = {
  createComment: async (req, res) => {
    try {
      console.log(`POST: cont/createComment`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, body } = req;
      const comment = new Comment();
      const result = await comment.createCommentData(member, body);

      assert.ok(result, Definer.general_err1);
      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/createComment, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  replyComment: async (req, res) => {
    try {
      console.log(`POST: cont/replyComment`);
      assert.ok(req.member, Definer.auth_err5);

      const { member, body } = req;
      const comment = new Comment();
      const result = await comment.replyCommentData(member, body);

      assert.ok(result, Definer.general_err1);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/replyComment, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },

  getAllComment: async (req, res) => {
    try {
      console.log(`GET: cont/getAllComment`);

      const { member, query, comment_id } = req;
      const comment = new Comment();

      const result = await comment.getAllCommentData(member, query, comment_id);

      assert.ok(result, Definer.general_err1);

      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getAllComment, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  },
};

module.exports = commentController;
