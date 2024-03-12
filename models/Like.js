const Definer = require("../lib/mistake");
const articleModel = require("../schema/article.model");
const commentModel = require("../schema/comment.model");
const likeModel = require("../schema/like.model");
const memberModel = require("../schema/member.model");
const productModel = require("../schema/product.model");

class Like {
  constructor(mb_id) {
    this.mb_id = mb_id;
  }
  async validateTargetItem(like_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await memberModel
            .findOne({
              _id: like_ref_id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;
        case "product":
          result = await productModel
            .findOne({
              _id: like_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "article":
          result = await articleModel
            .findOne({
              _id: like_ref_id,
              art_status: "Active",
            })
            .exec();
          break;
        case "comment":
          result = await commentModel
            .findOne({
              _id: like_ref_id,
            })
            .exec();
          break;
      }
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberLike(like_ref_id, group_type) {
    try {
      const new_like = new likeModel({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
        like_group: group_type,
      });
      const result = await new_like.save();
      await this.modifyItemlikeCounts(like_ref_id, group_type, 1);
      return result;
    } catch (err) {
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async removeMemberLike(like_ref_id, group_type) {
    try {
      const result = await likeModel.findOneAndDelete({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
      });
      await this.modifyItemlikeCounts(like_ref_id, group_type, -1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemlikeCounts(like_ref_id, group_type, modifier) {
    try {
      switch (group_type) {
        case "member":
          await memberModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { mb_likes: modifier } }
            )
            .exec();
          break;
        case "product":
          await productModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { product_likes: modifier } }
            )
            .exec();
          break;
        case "article":
          await articleModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { art_likes: modifier } }
            )
            .exec();
          break;
        case "comment":
          await commentModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { comment_likes: modifier } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async checkLikeExistence(like_ref_id) {
    try {
      const like = await likeModel
        .findOne({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
        })
        .exec();
      return like ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Like;
