const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const sellerController = require("./controllers/sellerController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/CommunityController");
const followController = require("./controllers/followController");
const eventController = require("./controllers/eventController");
const commentController = require("./controllers/commentController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_member = require("./utils/upload-multer")("members");

/*************************/
/*  REST API  */
/*************************/

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

router.post(
  "/member-liken",
  memberController.retrieveAuthMember,
  memberController.likeMemberChosen
);

router.post(
  "/member/update",
  memberController.retrieveAuthMember,
  uploader_member.single("mb_image"),
  memberController.updateMember
);

//Product related routers

router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/product/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

//Seller related routers

router.get(
  "/sellers",
  memberController.retrieveAuthMember,
  sellerController.getSellers
);

router.get(
  "/sellers/:id",
  memberController.retrieveAuthMember,
  sellerController.getChosenSeller
);

//Order related routers
router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);

router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);

//Community related routers
router.post(
  "/community/image",
  memberController.retrieveAuthMember,
  uploader_community.single("community_image"),
  communityController.imageInsertion
);

router.post(
  "/community/create",
  memberController.retrieveAuthMember,
  communityController.createArticle
);

router.get(
  "/community/member-articles",
  memberController.retrieveAuthMember,
  communityController.getMemberArticles
);

router.get(
  "/community/all-articles",
  memberController.retrieveAuthMember,
  communityController.getArticles
);

router.get(
  "/community/single-article/:art_id",
  memberController.retrieveAuthMember,
  communityController.getChosenArticle
);

//Following related routers
router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);

router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);

router.get("/follow/followings", followController.getMemberFollowings);

router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getMemberFollowers
);

//event
router.get(
  "/events/target",
  memberController.retrieveAuthMember,
  eventController.getSellerEvents
);

//comment
router.post(
  "/comments/create",
  memberController.retrieveAuthMember,
  commentController.createComment
);

router.post(
  "/reply/comments",
  memberController.retrieveAuthMember,
  commentController.replyComment
);

router.get(
  "/comments",
  memberController.retrieveAuthMember,
  commentController.getAllComment
);

module.exports = router;
