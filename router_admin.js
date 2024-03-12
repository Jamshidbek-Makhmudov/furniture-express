const express = require("express");
const productController = require("./controllers/productController");
const sellerController = require("./controllers/sellerController");
const upload = require("./utils/upload-multer");
const communityController = require("./controllers/CommunityController");
const eventController = require("./controllers/eventController");

/*************************/
/*  BSSR EJS */
/*************************/
const router_admin = express.Router();

router_admin.get("/", sellerController.home);
router_admin
  .route("/sign-up")
  .get(sellerController.getSignupMySeller)
  .post(upload("members").single("brand_img"), sellerController.signupProcess);

router_admin
  .route("/login")
  .get(sellerController.getLoginMySeller)
  .post(sellerController.loginProcess);

router_admin.get("/logout", sellerController.logout);
router_admin.get("/check-me", sellerController.checkSessions);

router_admin.get("/products/menu", sellerController.getMySellerProducts);

router_admin.post(
  "/products/create",
  sellerController.validateAuthSeller,
  upload("products").array("product_images", 3),
  productController.addNewProduct
);

router_admin.post(
  "/products/edit/:id",
  sellerController.validateAuthSeller,
  productController.updateChosenProduct
);

router_admin.get(
  "/all-sellers",
  sellerController.validateAdmin,
  sellerController.getAllSellers
);

router_admin.post(
  "/all-sellers/edit",
  sellerController.validateAdmin,
  sellerController.updateSellerByAdmin
);

router_admin.get(
  "/all-articles",
  sellerController.validateAdmin,
  communityController.getAllArticles
);

router_admin.post(
  "/all-articles/edit",
  sellerController.validateAdmin,
  communityController.updateArticleStatusByAdmin
);

router_admin.get("/events/menu", sellerController.getMySellerEvents);

router_admin.post(
  "/events/create",
  sellerController.validateAuthSeller,
  upload("events").single("event_images"),
  eventController.addNewEvent
);

router_admin.post(
  "/events/edit/:id",
  sellerController.validateAuthSeller,
  eventController.updateChosenEvent
);

module.exports = router_admin;
