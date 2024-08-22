const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const wishlistController = require("../controller/whistlist.js");

router
  .route("/")
  .get(isLoggedIn, wrapAsync(wishlistController.getWishlist))
  .post(isLoggedIn, wrapAsync(wishlistController.saveWishlist));
module.exports = router;
