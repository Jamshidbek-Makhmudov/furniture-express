const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const commentModel = require("../schema/comment.model");
const replyCommentModel = require("../schema/replyComment.model");

class Comment {
  constructor() {}

  async createCommentData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member?._id);
      const new_comment = await this.saveCommentData(data);
      return new_comment;
    } catch (err) {
      throw err;
    }
  }

  async saveCommentData(data) {
    try {
      const comment = new commentModel(data);

      return await comment.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async replyCommentData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member?._id);
      data.reply_comment_id = shapeIntoMongooseObjectId(data?.reply_comment_id);
      const new_Comment = await this.saveReplyCommentData(data);
      return new_Comment;
    } catch (err) {
      throw err;
    }
  }

  async saveReplyCommentData(data) {
    try {
      const comment = new replyCommentModel(data);

      return await comment.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getAllCommentData(member, query) {
    try {
      const product_id = shapeIntoMongooseObjectId(query?.id);
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      const result = await commentModel
        .aggregate([
          { $match: { comment_ref_id: product_id } },

          {
            $lookup: {
              from: "replycomments",
              localField: "_id",
              foreignField: "reply_comment_id",
              as: "comment_replies",
            },
          },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, "no comment found for that member!");

      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Comment;
