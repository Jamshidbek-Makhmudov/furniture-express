const assert = require("assert");
const Definer = require("../lib/mistake");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
} = require("../lib/config");
const memberModel = require("../schema/member.model");
const followModel = require("../schema/follow.model");

class Follow {
  constructor() {}

  async subscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);

      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const member_data = await memberModel.findById({ _id: follow_id }).exec();

      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubscribtionData(
        follow_id,
        subscriber_id
      );

      assert.ok(result, Definer.general_err1);
      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1);
      return "subscribed";
    } catch (err) {
      throw err;
    }
  }

  async createSubscribtionData(follow_id, subscriber_id) {
    try {
      const new_follow = new followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });

      return await new_follow.save();
    } catch (mong_err) {
      console.log(mong_err);
      throw new Error(Definer.follow_err2);
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
      if (type === "follow_change") {
        await memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_follow_cnt: modifier } }
          )
          .exec();
      } else if (type === "subscriber_change") {
        console.log("sub", mb_id);
        await memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_subscriber_cnt: modifier } }
          )
          .exec();
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async unsubscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);

      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const result = await followModel.findOneAndDelete({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });

      assert.ok(result, Definer.general_err1);
      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);
      return "unsubscribed";
    } catch (err) {
      throw err;
    }
  }

  async getMemberFollowingsData(inquiry) {
    try {
      const subscriber_id = shapeIntoMongooseObjectId(inquiry.mb_id);
      const page = inquiry.page ? Number(inquiry.page) : 1;
      const limit = inquiry.limit ? Number(inquiry.limit) : 3;

      const result = await followModel
        .aggregate([
          { $match: { subscriber_id: subscriber_id } },
          {
            $sort: { createdAt: -1 },
          },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "follow_id",
              foreignField: "_id",
              as: "follow_member_data",
            },
          },
          { $unwind: "$follow_member_data" },
        ])
        .exec();

      assert.ok(result, Definer.follow_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMemberFollowersData(member, inquiry) {
    try {
      const subscriber_id = shapeIntoMongooseObjectId(member?._id),
        follow_id = shapeIntoMongooseObjectId(inquiry?.mb_id),
        page = inquiry.page ? Number(inquiry?.page) : 1,
        limit = inquiry.limit ? Number(inquiry?.limit) : 3;
      let aggregateQuery = [
        { $match: { follow_id: follow_id } },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "members",
            localField: "subscriber_id",
            foreignField: "_id",
            as: "subscriber_member_data",
          },
        },
        { $unwind: "$subscriber_member_data" },
      ];

      if (member?._id === inquiry?.mb_id) {
        aggregateQuery.push(lookup_auth_member_following(follow_id, "follows"));
      }

      const result = await followModel.aggregate(aggregateQuery).exec();

      assert.ok(result, Definer.follow_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Follow;
