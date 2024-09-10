const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const cartController = require("../controller/cart.js");

router.route("/").get(isLoggedIn, wrapAsync(cartController.getCart));
router.route("/add").post(isLoggedIn, wrapAsync(cartController.saveCart));
router
  .route("/update")
  .post(isLoggedIn, wrapAsync(cartController.updateCartQuantity));
router
  .route("/delete")
  .post(isLoggedIn, wrapAsync(cartController.deleteCartItem));

module.exports = router;
